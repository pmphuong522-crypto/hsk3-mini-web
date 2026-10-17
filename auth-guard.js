/* Require a Supabase session before accessing learning pages. */
(() => {
  const file = location.pathname.split('/').pop() || 'index.html';
  if (!['index.html', 'practice.html'].includes(file)) return;

  const style = document.createElement('style');
  style.textContent = '#authGate{position:fixed;inset:0;z-index:99999;background:#f5f7fb;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif}#authGate .auth-card{width:min(420px,100%);padding:26px;background:#fff;border:1px solid #dfe5ee;border-radius:18px;box-shadow:0 8px 30px rgba(30,50,90,.08);text-align:center;color:#18212f}#authGate p{color:#657184;line-height:1.55}#authGate a{display:inline-block;margin-top:8px;padding:11px 16px;border-radius:11px;background:#315efb;color:white;text-decoration:none}';
  document.head.appendChild(style);
  const gate = document.createElement('div'); gate.id = 'authGate';
  gate.innerHTML = '<div class="auth-card"><h2>Đang kiểm tra đăng nhập…</h2><p>Vui lòng chờ trong giây lát.</p></div>';
  document.documentElement.appendChild(gate);

  const cfg = window.HSK_SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase?.createClient) {
    gate.innerHTML = '<div class="auth-card"><h2>Chưa kết nối tài khoản</h2><p>Không thể xác minh đăng nhập vì cấu hình Supabase chưa sẵn sàng. Hãy kiểm tra file <code>supabase-config.js</code> và tải lại trang.</p><a href="./account.html">Mở trang tài khoản</a></div>';
    return;
  }

  const client = window.supabase.createClient(cfg.url, cfg.anonKey);
  client.auth.getSession().then(({ data, error }) => {
    if (error) throw error;
    if (data.session?.user) { gate.remove(); return; }
    const next = file === 'practice.html' ? 'practice.html' : 'index.html';
    location.replace('./account.html?next=' + encodeURIComponent(next));
  }).catch(err => {
    console.error('Không xác minh được phiên đăng nhập:', err);
    gate.innerHTML = '<div class="auth-card"><h2>Không kiểm tra được đăng nhập</h2><p>Hãy kiểm tra kết nối mạng và thử tải lại trang.</p><a href="./account.html">Mở trang tài khoản</a></div>';
  });
})();
