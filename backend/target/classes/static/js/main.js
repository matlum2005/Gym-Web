document.addEventListener("DOMContentLoaded", function(){
  const membersList = document.getElementById("membersList");
  const joinForm = document.getElementById("joinForm");
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  async function loadMembers(){
    if(!membersList) return;
    membersList.innerHTML = '<div class="col-12 text-center">Loading...</div>';
    try{
      const res = await fetch('/api/members');
      if(!res.ok) throw new Error('Network error');
      const members = await res.json();
      if(!members || members.length === 0){
        membersList.innerHTML = '<div class="col-12 text-center">No members yet.</div>';
        return;
      }
      membersList.innerHTML = '';
      members.forEach(m => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `<div class="card shadow-sm"><div class="card-body">
          <h5 class="card-title">${escapeHtml(m.name)}</h5>
          <p class="card-text">${escapeHtml(m.email || '')}</p>
          <p class="text-muted">${escapeHtml(m.membershipType || '')}</p>
        </div></div>`;
        membersList.appendChild(col);
      });
    }catch(err){
      membersList.innerHTML = '<div class="col-12 text-danger text-center">Failed to load members.</div>';
      console.error(err);
    }
  }

  function escapeHtml(str){
    if(!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // Theme toggle (dark/light) persisted in localStorage
  function applyTheme(theme){
    if(theme === 'dark'){
      document.body.classList.add('theme-dark');
      themeIcon.className = 'bi bi-sun-fill';
    } else {
      document.body.classList.remove('theme-dark');
      themeIcon.className = 'bi bi-moon-fill';
    }
    localStorage.setItem('theme', theme);
  }
  (function initTheme(){
    const saved = localStorage.getItem('theme');
    if(saved) { applyTheme(saved); }
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
    themeToggle && themeToggle.addEventListener('click', ()=> {
      const current = document.body.classList.contains('theme-dark') ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  })();
  /* ensure logo loads, otherwise replace with text */
  (function logoFallback(){
    const logo = document.querySelector('.navbar-brand img.logo-img');
    if(!logo) return;
    logo.addEventListener('error', ()=>{
      const parent = logo.parentElement;
      const text = document.createElement('div');
      text.className = 'brand-title';
      text.textContent = 'Vector Gym';
      logo.replaceWith(text);
    });
    // if image exists but has whitespace name issues, attempt to load alternative filename
    if(!logo.complete || logo.naturalWidth === 0){
      const altSrc = logo.src.replace('logo-gym.jpg','logo gym.jpg');
      fetch(altSrc, { method: 'HEAD' }).then(r=>{
        if(r.ok) logo.src = altSrc;
      }).catch(()=>{ /* ignore */ });
    }
  })();

  if(joinForm){
    joinForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const payload = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        membershipType: document.getElementById('membershipType').value
      };
      try{
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error('Failed to join');
        joinForm.reset();
        await loadMembers();
        alert('Thanks — welcome to Vector Gym!');
      }catch(err){
        console.error(err);
        alert('Could not submit. Check console for details.');
      }
    });
  }

  loadMembers();

  /* ====== Sticky navbar on scroll ====== */
  (function stickyNav(){
    const nav = document.getElementById('mainNav');
    if(!nav) return;
    function onScroll(){
      if(window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

});

document.addEventListener("DOMContentLoaded", function(){
  const membersList = document.getElementById("membersList");
  const joinForm = document.getElementById("joinForm");

  async function loadMembers(){
    membersList.innerHTML = '<div class="col-12 text-center text-muted">Loading members...</div>';
    try{
      const res = await fetch('/api/members');
      if(!res.ok) throw new Error('Network error');
      const members = await res.json();
      if(!members || members.length === 0){
        membersList.innerHTML = '<div class="col-12 text-center text-muted">No members yet.</div>';
        return;
      }
      membersList.innerHTML = '';
      members.forEach(m => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `<div class="card shadow-sm h-100"><div class="card-body">
          <h5 class="card-title mb-1">${escapeHtml(m.name)}</h5>
          <p class="card-text text-muted mb-1">${escapeHtml(m.email || '')}</p>
          <p class="small text-muted">${escapeHtml(m.membershipType || '')}</p>
        </div></div>`;
        membersList.appendChild(col);
      });
    }catch(err){
      membersList.innerHTML = '<div class="col-12 text-danger text-center">Failed to load members.</div>';
      console.error(err);
    }
  }

  function escapeHtml(str){
    if(!str) return '';
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // Simple bootstrap validation
  (function () {
    'use strict'
    if (!joinForm) return;
    joinForm.addEventListener('submit', function (event) {
      if (!joinForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        joinForm.classList.add('was-validated');
        return;
      }
    }, false)
  })()

  joinForm && joinForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      membershipType: document.getElementById('membershipType').value
    };
    try{
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if(!res.ok) throw new Error('Failed to join');
      joinForm.reset();
      joinForm.classList.remove('was-validated');
      await loadMembers();
      alert('Thanks — welcome to Pro Gym!');
    }catch(err){
      console.error(err);
      alert('Could not submit. Check console for details.');
    }
  });

  loadMembers();
});


