// Simple auth helper for frontend (uses /api/auth endpoints)
const Auth = (function(){
  const apiBase = '/api';
  function saveToken(token){ localStorage.setItem('vg_token', token); }
  function getToken(){ return localStorage.getItem('vg_token'); }
  function removeToken(){ localStorage.removeItem('vg_token'); }

  async function register(body){
    const res = await fetch(`${apiBase}/auth/register`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    return res;
  }
  async function login(body){
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
    });
    if(res.ok){
      const data = await res.json();
      if(data.token) saveToken(data.token);
      return data;
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
      const body = { username: document.getElementById('loginUser').value, password: document.getElementById('loginPass').value };
      try{
        await Auth.login(body);
        window.location.href = '/dashboard.html';
      }catch(err){
        alert('Login failed. Check credentials.');
      }
    });
  }

  if(registerForm){
    registerForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const body = {
        name: document.getElementById('regName').value,
        username: document.getElementById('regUsername').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPass').value
      };
      try{
        const res = await Auth.register(body);
        if(res.ok){ alert('Registered — please login'); window.location.href = '/auth/login.html'; }
        else { alert('Registration failed'); }
      }catch(err){
        alert('Registration error'); console.error(err);
      }
    });
  }

  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{ Auth.removeToken(); window.location.href = '/'; });
  }

  // If on dashboard, load profile
  if(window.location.pathname.endsWith('/dashboard.html')){
    (async ()=>{
      try{
        const res = await Auth.authFetch('/api/members');
        if(res.ok){
          const members = await res.json();
          // simple demo: show first member
          const m = members && members[0];
          if(m){
            document.getElementById('profileName').textContent = m.name || m.username;
            document.getElementById('profileEmail').textContent = m.email;
          }
        }
      }catch(err){ console.error(err); }
    })();
  }
});


