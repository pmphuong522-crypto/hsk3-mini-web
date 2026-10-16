const STORE="hsk3_practice_v1";
const TYPES_BY_SKILL={listening:[1,2,3],recognition:[6,7],application:[4,5,8]};
const TYPE_LABEL={1:"Nghe từ → chọn nghĩa",2:"Nghe câu → chọn từ còn thiếu",3:"Nghe câu → nhập lại câu",4:"Sắp xếp từ thành câu",5:"Điền từ phù hợp",6:"Nối Hán ↔ nghĩa",7:"Nối Hán ↔ Pinyin",8:"Nhìn câu → chọn nghĩa tiếng Việt"};
let BANK=[], BY_WORD=new Map(), WORDS=[], TRANSLATION_BY_EXAMPLE=new Map(), lesson=1, session=null, current=null, timerHandle=null, audio=null, audioSpeed=1, reviewMode=false;

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s??"").replace(/\s+/g,"").replace(/\p{P}+/gu,"").trim();

// T3 only: accept Arabic digits and Chinese numerals interchangeably when the
// numeral is used with a recognizable number/time/counter unit. This avoids
// rewriting ordinary words such as 一直、一起、一个人 when they are not numeric.
function chineseNumeralToArabic(raw){
 const digitMap={零:"0",〇:"0",一:"1",二:"2",两:"2",三:"3",四:"4",五:"5",六:"6",七:"7",八:"8",九:"9"};
 if(!/[十百千万]/.test(raw)) return [...raw].map(ch=>digitMap[ch]??ch).join("");
 let total=0, section=0, number=0;
 const units={十:10,百:100,千:1000,万:10000};
 for(const ch of raw){
  if(digitMap[ch]!==undefined){number=Number(digitMap[ch]);continue;}
  const unit=units[ch];
  if(unit===10000){section=(section+number)*unit;total+=section;section=0;number=0;}
  else if(unit){section+=(number||((unit===10)?1:0))*unit;number=0;}
 }
 return String(total+section+number);
}
function normalizeT3(answer){
 return norm(answer).replace(
  /[零〇一二两三四五六七八九十百千万]+(?=(?:点|岁|年|月|日|号|分钟|分|秒|小时|个|本|张|次|天|块|元|公斤|斤|米|公里|层|楼|路|班|周|星期))/g,
  n=>chineseNumeralToArabic(n)
 );
}
// Reviewed pilot: accept 他/她 swaps only for these audio-ambiguous human-pronoun sentences.
// Keep this allowlist narrow; do not infer or accept variants for every T3 sentence.
const T3_GENDER_AMBIGUOUS_EXAMPLES=new Set([
"H3-065-ex02",
"H3-052-ex01",
"H3-054-02-ex02",
 "H3-004-ex02",
 "H3-005-ex02","H3-060-ex01","H3-081-ex01","H3-084-ex01","H3-094-ex02",
 "H3-098-ex02","H3-102-ex01","H3-106-02-ex02","H3-115-ex02","H3-119-ex01","H3-120-ex01","H3-121-ex01","H3-149-ex02","H3-182-ex02","H3-309-ex01"
]);
function t3AnswerMatches(answer,e){
 const submitted=normalizeT3(answer), expected=normalizeT3(e.normalized_answer);
 if(submitted===expected)return true;
 if(!T3_GENDER_AMBIGUOUS_EXAMPLES.has(e.example_id))return false;
 const source=String(e.normalized_answer||"");
 // Pilot entries were reviewed to contain one consistent human-pronoun form.
 // Accept only the direct 他 ↔ 她 substitution; 它 and other homophones remain strict.
 let alternate=null;
 if(source.includes("他")&&!source.includes("她"))alternate=source.replace(/他/g,"她");
 else if(source.includes("她")&&!source.includes("他"))alternate=source.replace(/她/g,"他");
 return alternate!==null&&submitted===normalizeT3(alternate);
}
const priorityRank={red:0,orange:1,yellow:2,green:3};
const band=(w,s)=>{
 if(w==="red"&&s==="red")return "A";
 if((w==="red"&&s==="orange")||(w==="orange"&&s==="red"))return "B";
 if((w==="orange"&&s==="orange")||(w==="red"&&s==="yellow")||(w==="yellow"&&s==="red"))return "C";
 if((w==="yellow"&&s==="orange")||(w==="orange"&&s==="yellow")||(w==="yellow"&&s==="yellow"))return "D";
 if(w==="green"&&s==="green")return "F"; return "E";
};
const newWordState=id=>({word_id:id,total_correct:0,total_wrong:0,consecutive_correct:0,priority:"yellow",last_used_at:null,last_exercise_type:null,times_in_current_session:0,cooldown_until_question_index:-1});
const newSkillState=skill=>({skill,total_correct:0,total_wrong:0,consecutive_correct:0,priority:"yellow"});
function loadStore(){try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch{return {}}}
function saveStore(){localStorage.setItem(STORE,JSON.stringify({word_state:storeWord,skill_state:storeSkill,current_session:session,session_history:history,wrong_questions:wrongQuestions}))}
let db=loadStore(),storeWord=db.word_state||{},storeSkill=db.skill_state||{},history=db.session_history||[],wrongQuestions=db.wrong_questions||{};

function stateWord(id){return storeWord[id]||(storeWord[id]=newWordState(id))}
function stateSkill(skill){return storeSkill[skill]||(storeSkill[skill]=newSkillState(skill))}

async function init(){
 let data=null;
 try{
   const r=await fetch("./practice/exercise_bank_v1.json",{cache:"no-store"});
   if(!r.ok) throw new Error("HTTP "+r.status);
   data=await r.json();
 }catch(err){
   // Fallback for opening practice.html directly via file://.
   data=window.HSK3_EXERCISE_BANK||null;
   if(!data){
     document.querySelector("#lessonGrid").innerHTML=`<div class="load-error"><b>Không tải được dữ liệu bài học.</b><br>Hãy mở bằng GitHub Pages hoặc chạy server cục bộ.
     <div class="sub">Nếu bạn đang mở file trực tiếp bằng double-click, bản này đã có dữ liệu dự phòng; hãy thử tải lại trang.</div></div>`;
     return;
   }
 }
 BANK=(data.exercises||[]).filter(e=>e.valid);
 // T3 can optionally reveal the Vietnamese meaning after grading. Its matching T8
 // record shares example_id, so the translation stays sourced from the original Excel data.
 TRANSLATION_BY_EXAMPLE=new Map(BANK.filter(e=>e.type===8&&e.example_id&&e.translation).map(e=>[e.example_id,e.translation]));
 BANK.forEach(e=>{if(!BY_WORD.has(e.word_id))BY_WORD.set(e.word_id,[]);BY_WORD.get(e.word_id).push(e)});
 WORDS=[...BY_WORD.keys()].sort();
 renderLessons();
 renderWrongCount();
 if(window.HSKCloud) window.HSKCloud.initPracticeUI();
 if(db.current_session && !db.current_session.finished){showResume(db.current_session)}
}
function renderLessons(){
 const lessons=[...new Set(BANK.map(e=>e.lesson))].sort((a,b)=>a-b);
 $("lessonGrid").innerHTML=lessons.map(l=>{
   const count=new Set(BANK.filter(e=>e.lesson===l).map(e=>e.word_id)).size;
   return `<button class="lesson" data-l="${l}"><b>Bài ${l}</b><span>${count} từ</span></button>`;
 }).join("");
 document.querySelectorAll(".lesson").forEach(b=>b.onclick=()=>start(Number(b.dataset.l)));
}
function showResume(s){
 $("resumeBox").classList.remove("hidden");
 const mins=Math.floor((s.elapsed_ms||0)/60000), sec=Math.floor(((s.elapsed_ms||0)%60000)/1000);
 $("resumeBox").innerHTML=`Có session Bài ${s.lesson} đang dở — ${mins}:${String(sec).padStart(2,"0")}, đã gặp ${s.covered_words.length} từ. <button class="btn primary" id="resumeExisting">Tiếp tục</button>`;
 $("resumeExisting").onclick=()=>resume(s);
}
function start(l){
 reviewMode=false; stopTimer(); lesson=l;
 const words=[...new Set(BANK.filter(e=>e.lesson===l).map(e=>e.word_id))];
 words.forEach(id=>{stateWord(id).times_in_current_session=0;stateWord(id).cooldown_until_question_index=-1});
 session={session_id:"S-"+Date.now(),lesson:l,question_index:0,covered_words:[],previous_word_id:null,previous_type:null,previous_skill:null,skill_run:0,started_at:Date.now(),elapsed_ms:0,correct:0,wrong:0,history:[],finished:false};
 db.current_session=session; saveStore();
 $("startView").classList.add("hidden");$("summaryView").classList.add("hidden");$("practiceView").classList.remove("hidden");
 $("lessonLabel").textContent=`Bài ${l}`;startTimer();nextQuestion();
}
function renderWrongCount(){
 const n=Object.values(wrongQuestions).filter(x=>!x.mastered).length;
 const el=$("wrongCount"); if(el)el.textContent=n?`${n} câu đang chờ ôn tập`:'Chưa có câu sai cần ôn tập.';
 const b=$("reviewWrongBtn"); if(b){b.disabled=!n;b.textContent=n?'Bắt đầu ôn':'Chưa có câu sai'}
}
function startWrongReview(){
 const queue=Object.values(wrongQuestions).filter(x=>!x.mastered).map(x=>BANK.find(e=>e.exercise_id===x.exercise_id)).filter(Boolean);
 if(!queue.length){renderWrongCount();return}
 reviewMode=true; stopTimer(); lesson=0;
 session={session_id:'R-'+Date.now(),lesson:0,review_queue:shuffle(queue.map(e=>e.exercise_id)),question_index:0,covered_words:[],previous_word_id:null,previous_type:null,previous_skill:null,skill_run:0,started_at:Date.now(),elapsed_ms:0,correct:0,wrong:0,history:[],finished:false,review:true};
 db.current_session=session;saveStore();$("startView").classList.add('hidden');$("summaryView").classList.add('hidden');$("practiceView").classList.remove('hidden');$("lessonLabel").textContent='Ôn tập câu sai';startTimer();nextQuestion();
}
function resume(s){
 session=s; lesson=s.lesson; $("startView").classList.add("hidden");$("summaryView").classList.add("hidden");$("practiceView").classList.remove("hidden");
 $("lessonLabel").textContent=`Bài ${lesson}`;startTimer(); if(session.current_question) {current=session.current_question;renderCurrent()} else nextQuestion();
}
function startTimer(){
 stopTimer(); const started=Date.now(); const base=session.elapsed_ms||0; session._timerBase=started;
 timerHandle=setInterval(()=>{session.elapsed_ms=base+(Date.now()-started);renderTimer();},500);
 renderTimer();
}
function stopTimer(){if(timerHandle){clearInterval(timerHandle);timerHandle=null}}
function renderTimer(){const ms=session.elapsed_ms||0;const s=Math.floor(ms/1000);$("timer").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
function candidates(){
 if(reviewMode){
   const ids=session.review_queue||[];
   const remaining=ids.slice(session.review_cursor||0);
   if(!remaining.length)return [];
   const e=BANK.find(x=>x.exercise_id===remaining[0]);
   return e?[{e,band:"A"}]:[];
 }
 const lessonWords=[...new Set(BANK.filter(e=>e.lesson===lesson).map(e=>e.word_id))];
 const unseen=lessonWords.filter(id=>!session.covered_words.includes(id));
 const pool=unseen.length?unseen:lessonWords;
 let arr=[];
 for(const wid of pool){
   const ws=stateWord(wid); if(wid===session.previous_word_id||ws.times_in_current_session>=3||session.question_index<ws.cooldown_until_question_index)continue;
   for(const e of (BY_WORD.get(wid)||[])){
     if(TYPES_BY_SKILL[e.skill]?.includes(e.type)) arr.push({e,band:band(ws.priority,stateSkill(e.skill).priority)});
   }
 }
 if(session.skill_run>=3 && session.previous_skill){const alt=arr.filter(x=>x.e.skill!==session.previous_skill);if(alt.length)arr=alt}
 if(!arr.length)return [];
 if(unseen.length){
   const diff=arr.filter(x=>session.previous_type==null||x.e.type!==session.previous_type);
   arr=diff.length?diff:arr;
   const wid=shuffle([...new Set(arr.map(x=>x.e.word_id))])[0];
   return shuffle(arr.filter(x=>x.e.word_id===wid));
 }
 const order=["A","B","C","D","E","F"]; const chosen=order.find(b=>arr.some(x=>x.band===b)); let p=arr.filter(x=>x.band===chosen);
 const diff=p.filter(x=>session.previous_type==null||x.e.type!==session.previous_type);return shuffle(diff.length?diff:p);
}
function nextQuestion(){
 const arr=candidates();
 if(!arr.length){return finish()}
 const e=arr[0].e, ws=stateWord(e.word_id);
 session.question_index++; ws.times_in_current_session++; session.covered_words.push(...(session.covered_words.includes(e.word_id)?[]:[e.word_id])); if(reviewMode)session.review_cursor=(session.review_cursor||0)+1;
 const prevSkill=session.previous_skill;
session.previous_word_id=e.word_id;session.previous_type=e.type;session.previous_skill=e.skill;session.skill_run=(prevSkill===e.skill?session.skill_run+1:1);
 current={question_id:`${session.session_id}-${session.question_index}-${e.exercise_id}`,exercise:e,graded:false,answer:null,feedback:null};
 session.current_question=current;saveStore();renderCurrent();
}
function renderCurrent(){
 updateProgress(); const e=current.exercise; const card=$("questionCard");
 let body="";
 if(e.type===1)body=renderT1(e);
 else if(e.type===2)body=renderT2(e);
 else if(e.type===3)body=renderT3(e);
 else if(e.type===4)body=renderT4(e);
 else if(e.type===5)body=renderT5(e);
 else if(e.type===6)body=renderMatch(e,false);
 else if(e.type===7)body=renderMatch(e,true);
 else if(e.type===8)body=renderT8(e);
 card.innerHTML=`<span class="type-label">T${e.type} · ${TYPE_LABEL[e.type]}</span>${body}`;
 bindQuestion(e); autoPlay(e);
}
function updateProgress(){
 const total=new Set(BANK.filter(e=>e.lesson===lesson).map(e=>e.word_id)).size;
 const covered=session.covered_words.length; $("coverage").textContent=covered<total?`Đã gặp ${covered}/${total} từ`:`✓ Đã gặp ${covered}/${total} từ — Đang củng cố...`;
 $("qcount").textContent=`${session.question_index} câu`; $("progressBar").style.width=Math.min(100,covered/total*100)+"%";
}
function audioPath(e){return "./"+e.audio_src}
function play(e){
 try{if(audio){audio.pause();audio.currentTime=0} audio=new Audio(audioPath(e));audio.playbackRate=audioSpeed;audio.play().catch(()=>{});}
 catch{}
}
function autoPlay(e){if([1,2,3].includes(e.type))play(e)}
function audioControls(e){return `<div class="audio-row"><button class="audio-big" id="replay">🔊</button><select id="speed" class="speed"><option value="1">100%</option><option value=".8">80%</option></select></div>`}
function renderT1(e){const opts=distractors(e,"meaning",3);return `${audioControls(e)}<div class="q-title">Nghe từ và chọn nghĩa đúng</div><div class="options">${shuffle([e,...opts]).map((x,i)=>`<button class="option" data-v="${esc(x.meaning)}">${esc(x.meaning)}</button>`).join("")}</div>`}
function renderT2(e){const opts=distractors(e,"target",3);return `${audioControls(e)}<div class="sentence">${esc(e.blank_sentence).replace("___",'<span class="blank">_____</span>')}</div><div class="options">${shuffle([e,...opts]).map(x=>`<button class="option" data-v="${esc(x.target)}">${esc(x.target)}</button>`).join("")}</div>`}
function renderT3(e){return `${audioControls(e)}<div class="q-title">Nghe câu rồi nhập lại câu đã nghe</div><input class="answer" id="textAnswer" autocomplete="off" placeholder="Nhập câu tiếng Trung..."><div class="actions"><button class="btn primary" id="checkText">Kiểm tra</button></div>`}
function renderT4(e){
 const tokens=shuffle(e.tokens.map((value,i)=>({id:`T${i}`,value,order:i})));
 current.sort={tokens,answer:[],punctuation:e.punctuation||((e.sentence||'').match(/[。！？]$/)||[''])[0]};
 return `<div class="q-title">Sắp xếp các cụm từ thành câu hoàn chỉnh</div><div class="sort-area" id="sortAnswer" aria-label="Các cụm từ đã chọn"></div><div class="sort-pool" id="sortPool">${tokens.map(t=>`<button type="button" class="sort-token" data-id="${t.id}">${esc(t.value)}</button>`).join('')}</div><div class="actions sort-actions"><button class="btn" id="clearSort">Xóa câu</button><button class="btn primary" id="checkSort">Kiểm tra</button></div>`;
}
function renderT5(e){const opts=distractors(e,"target",3);return `<div class="sentence">${esc(e.blank_sentence).replace("___",'<span class="blank">_____</span>')}</div><div class="options">${shuffle([e,...opts]).map(x=>`<button class="option" data-v="${esc(x.target)}">${esc(x.target)}</button>`).join("")}</div>`}
function renderT8(e){const opts=distractors(e,"translation",3);return `<div class="sentence">${esc(e.sentence)}</div><div class="options">${shuffle([e,...opts]).map(x=>`<button class="option" data-v="${esc(x.translation)}">${esc(x.translation)}</button>`).join("")}</div>`}
function distractors(e,field,n){
 const out=[];
 const seen=new Set([e[field]]);
 const addFrom=pool=>{
   for(const x of shuffle(pool)){
     const value=x[field];
     const excludedValues=new Set((e.exclude_distractor_targets||[]).map(v=>String(v).trim()));
     if(value&&x.word_id!==e.word_id&&!seen.has(value)&&!excludedValues.has(String(value).trim())){
       seen.add(value);out.push(x);
       if(out.length===n)return true;
     }
   }
   return false;
 };
 // T2/T5 use the exercise target, not the raw Hanzi field.
 // Prefer same lesson + same POS; if the lesson does not contain enough
 // distinct distractors, widen to same POS across the learned scope, then
 // same lesson, then the full scope.
 if(field==="meaning"){
   const stripTone = value => String(value||"").normalize("NFD")
     .replace(/[\\u0300-\\u036f]/g,"").replace(/ü/g,"u").replace(/Ü/g,"U")
     .replace(/[1-5]/g,"").replace(/[^a-zA-Z]/g,"").toLowerCase();
   const targetPinyin = stripTone(e.pinyin);
   const safePool = pool => pool.filter(x => stripTone(x.pinyin)!==targetPinyin);
   // T1 is audio-only: homophones (including tone-only differences) must not
   // appear as competing meanings in the same option set.
   if(addFrom(safePool(BANK.filter(x=>x.lesson===e.lesson))))return out;
   if(addFrom(safePool(BANK)))return out;
   return out;
 }
 if(field==="target"){
   if(addFrom(BANK.filter(x=>x.lesson===e.lesson&&x.pos_normalized===e.pos_normalized)))return out;
   if(addFrom(BANK.filter(x=>x.pos_normalized===e.pos_normalized)))return out;
   if(addFrom(BANK.filter(x=>x.lesson===e.lesson)))return out;
   addFrom(BANK);
   return out;
 }
 addFrom(BANK.filter(x=>x.lesson===e.lesson&&x.pos_normalized===e.pos_normalized));
 if(out.length<n)addFrom(BANK.filter(x=>x.pos_normalized===e.pos_normalized));
 if(out.length<n)addFrom(BANK);
 return out;
}
function renderMatch(e,pinyin){
 // A matching set must be unambiguous in BOTH columns. Different word_id values
 // are not enough: duplicate Hanzi or duplicate Pinyin/meaning would make the
 // question confusing and can produce impossible-to-grade pairs.
 const rightField=pinyin?"pinyin":"meaning";
 const seenHanzi=new Set(), seenRight=new Set(), seenWords=new Set();
 const picked=[];
 const addCandidate=x=>{
   const h=String(x.hanzi??"").trim();
   const r=String(x[rightField]??"").trim();
   if(!h||!r||seenWords.has(x.word_id)||seenHanzi.has(h)||seenRight.has(r))return false;
   picked.push(x); seenWords.add(x.word_id); seenHanzi.add(h); seenRight.add(r); return true;
 };
 addCandidate(e);
 const local=shuffle(BANK.filter(x=>x.type===e.type&&x.lesson===e.lesson&&x.valid&&x.word_id!==e.word_id));
 const global=shuffle(BANK.filter(x=>x.type===e.type&&x.valid&&x.word_id!==e.word_id));
 for(const x of local){if(picked.length>=4)break;addCandidate(x)}
 // Widen to the full validated vocabulary only when the lesson cannot provide
 // four distinct visible pairs. Never fall back to duplicates.
 if(picked.length<4)for(const x of global){if(picked.length>=4)break;addCandidate(x)}
 if(picked.length<4){
   current.generatorError=`Không đủ 4 cặp ${pinyin?"Hán–Pinyin":"Hán–nghĩa"} không trùng nhau để tạo câu hỏi này.`;
   return `<div class="load-error"><b>Chưa thể tạo câu nối này.</b><br>${esc(current.generatorError)} Hệ thống sẽ bỏ qua câu hỏi này.</div>`;
 }
 const left=shuffle(picked.map((x,i)=>({id:`L${i}`,value:x.hanzi,wid:x.word_id})));
 const right=shuffle(picked.map((x,i)=>({id:`R${i}`,value:x[rightField],wid:x.word_id})));
 current.match={left,right,pinyin,selected:null,pairs:[]};
 return `<div class="q-title">Nối ${pinyin?"Hán ↔ Pinyin":"Hán ↔ nghĩa"}</div><p class="match-hint">Mỗi chữ Hán và mỗi đáp án chỉ xuất hiện một lần. Bấm lại vào mục đã chọn để bỏ chọn; bấm vào một cặp đã nối để tháo cặp trước khi kiểm tra.</p><div class="matching"><div class="match-col">${left.map(x=>`<button class="match left" data-id="${x.id}">${esc(x.value)}</button>`).join("")}</div><div class="match-col">${right.map(x=>`<button class="match right" data-id="${x.id}">${esc(x.value)}</button>`).join("")}</div></div><div class="actions"><button class="btn primary" id="checkMatch">Kiểm tra</button></div>`;
}
function bindQuestion(e){
 $("replay")?.addEventListener("click",()=>play(e)); $("speed")?.addEventListener("change",ev=>{audioSpeed=Number(ev.target.value);if(audio)audio.playbackRate=audioSpeed});
 document.querySelectorAll(".option").forEach(b=>b.onclick=()=>{if(current.graded)return;grade(b.dataset.v,e)});
 $("checkText")?.addEventListener("click",()=>grade($("textAnswer").value,e));
 $("textAnswer")?.addEventListener("keydown",ev=>{if(ev.key==="Enter")grade($("textAnswer").value,e)});
 if(e.type===4)bindSorting(e);
 if(e.type===6||e.type===7)bindMatching(e);
}
function bindSorting(e){
 const draw=()=>{
  const chosen=new Set(current.sort.answer.map(t=>t.id));
  $('sortAnswer').innerHTML=current.sort.answer.map(t=>`<button type="button" class="sort-token chosen" data-id="${t.id}">${esc(t.value)}</button>`).join('');
  $('sortPool').innerHTML=current.sort.tokens.filter(t=>!chosen.has(t.id)).map(t=>`<button type="button" class="sort-token" data-id="${t.id}">${esc(t.value)}</button>`).join('');
  document.querySelectorAll('.sort-token').forEach(b=>b.onclick=()=>{
   if(current.graded)return;
   const t=current.sort.tokens.find(x=>x.id===b.dataset.id); const i=current.sort.answer.findIndex(x=>x.id===t.id);
   if(i>=0)current.sort.answer.splice(i,1);else current.sort.answer.push(t);
   draw();
  });
 };
 $('clearSort').onclick=()=>{if(!current.graded){current.sort.answer=[];draw()}};
 $('checkSort').onclick=()=>grade(current.sort.answer.map(t=>t.id),e);
 draw();
}
function bindMatching(e){
 const clearSelection=()=>{
   current.match.selected=null;
   document.querySelectorAll(".match.selected").forEach(x=>x.classList.remove("selected"));
 };
 const unpairByItem=id=>{
   const pair=current.match.pairs.find(p=>p[0]===id||p[1]===id);
   if(!pair)return false;
   current.match.pairs=current.match.pairs.filter(p=>p!==pair);
   pair.forEach(itemId=>document.querySelector(`.match[data-id="${itemId}"]`)?.classList.remove("matched","selected"));
   if(current.match.selected===pair[0])clearSelection();
   return true;
 };
 document.querySelectorAll(".match.left").forEach(b=>b.onclick=()=>{
   if(current.graded)return;
   if(unpairByItem(b.dataset.id)){clearSelection();return;}
   if(current.match.selected===b.dataset.id){clearSelection();return;}
   clearSelection();current.match.selected=b.dataset.id;b.classList.add("selected");
 });
 document.querySelectorAll(".match.right").forEach(b=>b.onclick=()=>{
   if(current.graded)return;
   if(unpairByItem(b.dataset.id)){clearSelection();return;}
   if(!current.match.selected)return;
   const l=current.match.selected;
   if(current.match.pairs.some(p=>p[0]===l))return;
   current.match.pairs.push([l,b.dataset.id]);
   document.querySelector(`.match[data-id="${l}"]`)?.classList.add("matched");
   b.classList.add("matched");clearSelection();
 });
 $("checkMatch").onclick=()=>grade(current.match.pairs,e);
}
function applyResult(e,correct){
 const ws=stateWord(e.word_id), ss=stateSkill(e.skill);
 if(correct){ws.total_correct++;ws.consecutive_correct++;ss.total_correct++;ss.consecutive_correct++;
   if(ws.priority==="red"&&ws.consecutive_correct>=2)ws.priority="orange";
   else if(ws.priority==="orange"&&ws.consecutive_correct>=3)ws.priority="yellow";
   else if(ws.priority==="yellow"&&ws.consecutive_correct>=4)ws.priority="green";
   if(ss.priority==="red"&&ss.consecutive_correct>=2)ss.priority="orange";
   else if(ss.priority==="orange"&&ss.consecutive_correct>=3)ss.priority="yellow";
   else if(ss.priority==="yellow"&&ss.consecutive_correct>=4)ss.priority="green";
 }else{ws.total_wrong++;ws.consecutive_correct=0;ws.priority=ws.priority==="yellow"?"orange":ws.priority==="orange"?"red":ws.priority==="green"?"orange":"red";ws.cooldown_until_question_index=session.question_index+4;ss.total_wrong++;ss.consecutive_correct=0;ss.priority=ss.priority==="yellow"?"orange":ss.priority==="orange"?"red":ss.priority==="green"?"orange":"red"}
 ws.last_used_at=session.question_index;ws.last_exercise_type=e.type;
 session.history.push({question_id:current.question_id,exercise_id:e.exercise_id,lesson:e.lesson,word_id:e.word_id,exercise_type:e.type,skill:e.skill,result:correct?"correct":"wrong",timestamp:Date.now()});
 if(!correct){const item=wrongQuestions[e.exercise_id]||{exercise_id:e.exercise_id,word_id:e.word_id,lesson:e.lesson,type:e.type,first_wrong_at:Date.now(),wrong_count:0,mastered:false};item.wrong_count++;item.last_wrong_at=Date.now();item.mastered=false;wrongQuestions[e.exercise_id]=item;}
 else if(wrongQuestions[e.exercise_id]){wrongQuestions[e.exercise_id].correct_in_review=(wrongQuestions[e.exercise_id].correct_in_review||0)+1;if(reviewMode){wrongQuestions[e.exercise_id].mastered=true;wrongQuestions[e.exercise_id].mastered_at=Date.now();}}
 if(window.HSKCloud) window.HSKCloud.recordAnswer({exercise:e,correct,session,reviewMode,wrongCount:wrongQuestions[e.exercise_id]?.wrong_count||0});
 if(correct)session.correct++;else session.wrong++;
 renderWrongCount();
}
function grade(answer,e){
 if(current.graded)return;
 let correct=false;
 if(e.type===1)correct=answer===e.meaning;
 else if(e.type===2||e.type===5)correct=answer===e.target||answer===e.hanzi;
 else if(e.type===3)correct=t3AnswerMatches(answer,e);
 else if(e.type===4){
   if(Array.isArray(answer)&&answer.length===e.tokens.length){
     const submitted=answer.map(id=>current.sort.tokens.find(t=>t.id===id)?.value);
     const accepted=e.accepted_token_orders||[e.tokens];
     correct=accepted.some(order=>order.length===submitted.length&&order.every((value,i)=>value===submitted[i]));
   }
 }
 else if(e.type===8)correct=answer===e.translation;
 else if(e.type===6||e.type===7){const expected=new Set(current.match.left.filter(l=>{const r=current.match.right.find(r=>r.wid===l.wid);return r&&current.match.pairs.some(p=>p[0]===l.id&&p[1]===r.id)}).map(l=>l.wid));correct=expected.size===4}
 current.graded=true;current.answer=answer;current.feedback=correct?"correct":"wrong";applyResult(e,correct);saveStore();renderFeedback(correct,e);
}
function renderFeedback(correct,e){
 const c=$("questionCard");const existing=c.querySelector(".feedback"); if(existing)return;
 const answer=correct?"Chính xác!":"Chưa đúng.";
 let extra="";
 if(e.type===1)extra=`<br><b>${esc(e.hanzi)}</b> · ${esc(e.pinyin)} · ${esc(e.meaning)}`;
 if(e.type===2||e.type===5)extra=`<br>Đáp án: <b>${esc(e.target||e.hanzi)}</b>`;
 if(e.type===3){
   const translation=TRANSLATION_BY_EXAMPLE.get(e.example_id);
   extra=`<br>Đáp án: <b>${esc(e.normalized_answer)}</b>`;
   if(translation)extra+=`<div class="translation-reveal"><button type="button" class="btn translation-toggle" id="showVietnamese">Hiện nghĩa tiếng Việt</button><div id="vietnameseMeaning" class="translation-meaning hidden">${esc(translation)}</div></div>`;
 }
 if(e.type===4)extra=`<br>Câu đúng: <b>${esc(e.sentence)}</b>`;
 if(e.type===8)extra=`<br>Đáp án: <b>${esc(e.translation)}</b>`;
 if(e.type===6||e.type===7){
   const left=current.match?.left||[], right=current.match?.right||[], pairs=current.match?.pairs||[];
   const pairByLeft=new Map(pairs.map(([l,r])=>[l,r]));
   const rows=left.map(l=>{
     const selectedRid=pairByLeft.get(l.id);
     const selected=right.find(r=>r.id===selectedRid);
     const correctRight=right.find(r=>r.wid===l.wid);
     const ok=!!selected && selected.wid===l.wid;
     const shownSelected=selected?esc(selected.value):'<i>Chưa nối</i>';
     const shownCorrect=esc(correctRight?.value||'');
     return `<div class="match-feedback-row ${ok?'match-ok':'match-no'}"><span class="mf-left">${esc(l.value)}</span><span class="mf-arrow">→</span><span class="mf-selected">${shownSelected}${ok?'':' ✗'}</span>${ok?'':'<span class="mf-correct">Đúng: '+shownCorrect+'</span>'}</div>`;
   }).join('');
   extra=`<div class="match-feedback"><b>${correct?'4/4 cặp đều đúng':'Kiểm tra từng cặp:'}</b>${rows}</div>`;
 }
 const div=document.createElement("div");div.className=`feedback ${correct?"ok":"no"}`;div.innerHTML=`<b>${answer}</b>${extra}`;
 c.appendChild(div);
 const showVietnamese=$("showVietnamese"), vietnameseMeaning=$("vietnameseMeaning");
 if(showVietnamese&&vietnameseMeaning)showVietnamese.onclick=()=>{
   const opening=vietnameseMeaning.classList.contains("hidden");
   vietnameseMeaning.classList.toggle("hidden",!opening);
   showVietnamese.textContent=opening?"Ẩn nghĩa tiếng Việt":"Hiện nghĩa tiếng Việt";
 };
 const a=document.createElement("div");a.className="actions";a.innerHTML=`<button class="btn primary" id="continueBtn">Tiếp tục →</button>`;c.appendChild(a);
 $("continueBtn").onclick=()=>{current=null;session.current_question=null;saveStore(); if(session.elapsed_ms>=900000)finish();else nextQuestion()};
 // update choice visual
 document.querySelectorAll(".option").forEach(b=>{if((e.type===1&&b.dataset.v===e.meaning)||(e.type===2||e.type===5)&&b.dataset.v===(e.target||e.hanzi)||(e.type===8&&b.dataset.v===e.translation))b.classList.add("correct");if(!correct&&b.dataset.v===String(current.answer))b.classList.add("wrong")});
 if(e.type===3&&$("textAnswer"))$("textAnswer").disabled=true;
 if(e.type===4){document.querySelectorAll(".sort-token").forEach(b=>b.disabled=true);$("checkSort")?.setAttribute("disabled","disabled");$("clearSort")?.setAttribute("disabled","disabled")}
}
function pause(){
 if(!session||session.finished)return;session.elapsed_ms=session.elapsed_ms+(Date.now()-(session._timerBase||Date.now()));delete session._timerBase;stopTimer();saveStore();$("pauseOverlay").classList.remove("hidden")
}
function backToLessonSelection(){
 stopTimer();
 current=null;
 if(session && !session.finished){
   session.finished=true;
   session.current_question=null;
   saveStore();
 }
 $("pauseOverlay").classList.add("hidden");
 $("practiceView").classList.add("hidden");
 $("summaryView").classList.add("hidden");
 $("startView").classList.remove("hidden");
 $("resumeBox").classList.add("hidden");
 renderLessons();
 window.scrollTo({top:0,behavior:"smooth"});
}
function finish(){
 stopTimer(); if(session)session.finished=true;session.current_question=null;saveStore();
 const total=session.correct+session.wrong, acc=total?Math.round(session.correct/total*100):0;
 const totalWords=new Set(BANK.filter(e=>e.lesson===lesson).map(e=>e.word_id)).size;
 $("practiceView").classList.add("hidden");$("summaryView").classList.remove("hidden");
 $("summaryView").innerHTML=`<h1>${reviewMode?"Hoàn thành ôn tập câu sai":"Hoàn thành luyện tập"}</h1><p>${reviewMode?"Ôn tập câu sai":`Bài ${lesson}`}</p><div class="summary-stats"><div class="stat"><b>${Math.floor((session.elapsed_ms||0)/60000)}:${String(Math.floor(((session.elapsed_ms||0)%60000)/1000)).padStart(2,"0")}</b>thời gian</div><div class="stat"><b>${total}</b>câu</div><div class="stat"><b>${session.correct}</b>đúng</div><div class="stat"><b>${acc}%</b>chính xác</div></div><p>${reviewMode?"Đã xử lý "+session.question_index+" câu trong danh sách ôn tập.":"Đã gặp <b>"+session.covered_words.length+"/"+totalWords+"</b> từ."}</p><div class="actions"><button class="btn" id="chooseLesson">← Chọn bài luyện tập</button>${reviewMode?"":"<button class=\"btn primary\" id=\"again\">Luyện lại Bài "+lesson+"</button>"}</div>`;
 $("chooseLesson").onclick=backToLessonSelection;
 if($("again"))$("again").onclick=()=>start(lesson);
}
$("pauseBtn").onclick=pause;
$("resumeBtn").onclick=()=>{$("pauseOverlay").classList.add("hidden");session._timerBase=Date.now();startTimer();saveStore()};
$("quitBtn").onclick=()=>{session.finished=true;session.current_question=null;saveStore();$("pauseOverlay").classList.add("hidden");finish()};
window.addEventListener("beforeunload",()=>{if(session&&!session.finished){session.elapsed_ms=session.elapsed_ms+(Date.now()-(session._timerBase||Date.now()));session._timerBase=Date.now();saveStore()}});
$("reviewWrongBtn")?.addEventListener("click",startWrongReview);
init();
