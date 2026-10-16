(function(){
 let client=null, user=null, profile=null;
 const cfg=window.HSK_SUPABASE_CONFIG||{};
 function configured(){return !!(cfg.url&&cfg.anonKey&&window.supabase?.createClient)}
 async function init(){
  if(!configured()){setStatus('Chưa kết nối tài khoản');return}
  client=window.supabase.createClient(cfg.url,cfg.anonKey);
  const {data}=await client.auth.getSession(); user=data.session?.user||null;
  if(user){await loadProfile();setStatus(profile?.display_name||user.email)}else setStatus('Chưa đăng nhập');
  client.auth.onAuthStateChange(async(_event,session)=>{user=session?.user||null;if(user){await loadProfile();setStatus(profile?.display_name||user.email);await syncLocalHistory()}else{profile=null;setStatus('Chưa đăng nhập')}});
 }
 function setStatus(s){const e=document.getElementById('accountStatus');if(e)e.textContent=s}
 async function loadProfile(){if(!client||!user)return;const r=await client.from('profiles').select('id,display_name,role').eq('id',user.id).maybeSingle();profile=r.data||{id:user.id,role:'student',display_name:user.email};}
 async function initPracticeUI(){await init();const b=document.getElementById('accountBtn');if(b)b.onclick=()=>{location.href='./account.html'};}
 async function recordAnswer(payload){if(!client||!user)return;try{await client.from('answer_events').insert({student_id:user.id,exercise_id:payload.exercise.exercise_id,word_id:payload.exercise.word_id,lesson:payload.exercise.lesson,exercise_type:payload.exercise.type,skill:payload.exercise.skill,is_correct:payload.correct,is_review:payload.reviewMode,wrong_count:payload.wrongCount,session_id:payload.session.session_id,answered_at:new Date().toISOString()})}catch(e){console.warn('Không đồng bộ được kết quả lên máy chủ',e)}}
 async function syncLocalHistory(){/* Past local history is not uploaded automatically to avoid duplicating or misattributing records. New answers sync after login. */}
 window.HSKCloud={initPracticeUI,recordAnswer,get client(){return client},get user(){return user},get profile(){return profile},get configured(){return configured()}};
})();
