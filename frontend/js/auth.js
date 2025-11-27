// Simple auth helper for frontend (uses /api/auth endpoints)
const Auth = (function(){
  const apiBase = '/api';
  function saveToken(token){ localStorage.setItem('vg_token', token); }
  function getToken(){ return localStorage.getItem('vg_token'); }
  function removeToken(){ localStorage.removeItem('vg_token'); }

  // Local fallback users store (for offline/demo usage)
  function _localUsers(){
    try{ return JSON.parse(localStorage.getItem('vg_users')||'[]'); }catch(e){ return []; }
  }
  function _saveLocalUsers(users){ localStorage.setItem('vg_users', JSON.stringify(users)); }

  async function register(body){
    // Try backend first, fallback to localStorage
    try{
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      if(res.ok) return res;
      // if backend rejects, fall through to local fallback
    }catch(err){
      // network error -> fallback
    }
    const users = _localUsers();
    if(users.find(u => u.username === body.username || u.email === body.email)) {
      return new Response(JSON.stringify({ message: 'User exists' }), { status: 409, headers: {'Content-Type':'application/json'} });
    }
    const id = 'u' + Date.now();
    users.push({ id, name: body.name, username: body.username, email: body.email, password: body.password });
    _saveLocalUsers(users);
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: {'Content-Type':'application/json'} });
  }

  async function login(body){
    // Try backend first
    try{
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      if(res.ok){
        const data = await res.json();
        if(data.token) saveToken(data.token);
        return data;
      }
      // fall back if backend fails
    }catch(err){
      // network error -> fallback
    }
    const users = _localUsers();
    const user = users.find(u => u.username === body.username || u.email === body.username);
    if(user && user.password === body.password){
      const fakeToken = 'local-' + btoa(user.id + ':' + Date.now());
      saveToken(fakeToken);
      return { token: fakeToken, user: { id: user.id, name: user.name, username: user.username, email: user.email } };
    }
    throw new Error('Login failed');
  }

  function authFetch(url, opts={}){
    opts.headers = opts.headers || {};
    const token = getToken();
    if(token) opts.headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, opts);
  }
  return { register, login, saveToken, getToken, removeToken, authFetch };
})();

// Bind forms
document.addEventListener('DOMContentLoaded', function(){
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if(loginForm){
    loginForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const authAlert = document.getElementById('authAlert');
      const userVal = document.getElementById('loginUser').value.trim();
      const passVal = document.getElementById('loginPass').value;
      function showAlert(msg, type='danger'){
        if(!authAlert) { alert(msg); return; }
        authAlert.className = `alert alert-${type}`;
        authAlert.textContent = msg;
        authAlert.classList.remove('d-none');
        setTimeout(()=> authAlert.classList.add('d-none'), 5000);
      }
      if(!userVal || !passVal){
        showAlert('Please enter username/email and password', 'warning');
        return;
      }
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const prevHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...';
      try{
        await Auth.login({ username: userVal, password: passVal });
        showAlert('Signed in — redirecting...', 'success');
        setTimeout(()=> window.location.href = '../dashboard.html', 900);
      }catch(err){
        console.error(err);
        showAlert('Login failed. Check credentials.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = prevHtml;
      }
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const authAlert = document.getElementById('authAlert');
      function showAlert(msg, type='danger'){
        if(!authAlert) { alert(msg); return; }
        authAlert.className = `alert alert-${type}`;
        authAlert.textContent = msg;
        authAlert.classList.remove('d-none');
        setTimeout(()=> authAlert.classList.add('d-none'), 6000);
      }
      const name = document.getElementById('regName').value.trim();
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPass').value;
      // Basic validation
      if(!name || !username || !email || !password){
        showAlert('Please fill all fields', 'warning'); return;
      }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRe.test(email)){ showAlert('Enter a valid email address', 'warning'); return; }
      if(password.length < 6){ showAlert('Password must be at least 6 characters', 'warning'); return; }
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const prevHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';
      try{
        const res = await Auth.register({ name, username, email, password });
        if(res && res.ok){
          showAlert('Registered successfully — redirecting to login', 'success');
          setTimeout(()=> window.location.href = 'login.html', 900);
        } else if(res && res.status === 409){
          showAlert('User already exists', 'warning');
          submitBtn.disabled = false;
          submitBtn.innerHTML = prevHtml;
        } else {
          showAlert('Registration failed', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = prevHtml;
        }
      }catch(err){
        console.error(err);
        showAlert('Registration error', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = prevHtml;
      }
    });
  }

  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{ Auth.removeToken(); window.location.href = 'index.html'; });
  }

  // If on dashboard, load profile
  if(window.location.pathname.endsWith('dashboard.html')){
    (async ()=>{
      try{
        const res = await Auth.authFetch('/api/members');
        if(res.ok){
          const members = await res.json();
          // simple demo: show first member
          const m = members && members[0];
          if(m){
            document.getElementById('profileName').textContent = m.name || m.username;
            document.getElementById('profileEmail').textContent = m.email || '';
            return;
          }
        }
        throw new Error('No backend members');
      }catch(err){
        console.warn('Backend members not available, falling back to local demo users', err);
        try{
          const users = JSON.parse(localStorage.getItem('vg_users')||'[]');
          const m = users && users[0];
          if(m){
            document.getElementById('profileName').textContent = m.name || m.username;
            document.getElementById('profileEmail').textContent = m.email || '';
          } else {
            document.getElementById('profileName').textContent = 'Demo Member';
            document.getElementById('profileEmail').textContent = 'demo@example.com';
          }
        }catch(e){
          console.error(e);
        }
      }
    })();
  }
});


