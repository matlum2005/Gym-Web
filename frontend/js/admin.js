document.addEventListener('DOMContentLoaded', function(){
  const trainersList = document.getElementById('trainersList');
  const classesList = document.getElementById('classesList');
  const trainerModalEl = document.getElementById('trainerModal');
  const classModalEl = document.getElementById('classModal');
  const trainerModal = new bootstrap.Modal(trainerModalEl);
  const classModal = new bootstrap.Modal(classModalEl);
  const settingsModalEl = document.getElementById('settingsModal');
  const settingsModal = settingsModalEl ? new bootstrap.Modal(settingsModalEl) : null;
  let editingTrainer = null;
  let editingClass = null;

  async function loadTrainers(){
    // Try backend; if it fails use localStorage fallback for a ready-to-use demo
    let trainers = null;
    try{
      const res = await Auth.authFetch('/api/trainers');
      if(res.ok) trainers = await res.json();
    }catch(e){ trainers = null; }
    if(!trainers){
      try{ trainers = JSON.parse(localStorage.getItem('vg_trainers')||'[]'); }catch(e){ trainers = []; }
    }
    if(!trainers || trainers.length === 0){ trainersList.innerHTML = '<div class="text-muted">No trainers yet.</div>'; return; }
    trainersList.innerHTML = trainers.map(t => `
      <div class="col-md-4">
        <div class="card glass p-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${t.photoUrl || 'https://images.unsplash.com/photo-1554284126-60b0b628a1a6?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a1d1e2b'}" alt="${t.name}" style="width:64px;height:64px;border-radius:8px;object-fit:cover"/>
            <div>
              <div class="fw-bold">${t.name}</div>
              <small class="text-muted">${t.specialty || ''}</small>
            </div>
          </div>
          <p class="small text-muted mt-2">${t.bio ? t.bio.substring(0,120) : ''}</p>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-sm btn-outline-light" data-id="${t.id}" data-action="edit-trainer">Edit</button>
            <button class="btn btn-sm btn-outline-danger" data-id="${t.id}" data-action="del-trainer">Delete</button>
          </div>
        </div>
      </div>`).join('');
  }

  async function loadClasses(){
    // Try backend, fallback to localStorage
    let classes = null;
    try{
      const res = await Auth.authFetch('/api/classes');
      if(res.ok) classes = await res.json();
    }catch(e){ classes = null; }
    if(!classes){
      try{ classes = JSON.parse(localStorage.getItem('vg_classes')||'[]'); }catch(e){ classes = []; }
    }
    if(!classes || classes.length === 0){ classesList.innerHTML = '<div class="text-muted">No classes yet.</div>'; return; }
    classesList.innerHTML = classes.map(c => `
      <div class="col-md-6">
        <div class="card glass p-3">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="fw-bold">${c.title}</div>
              <small class="text-muted">${c.schedule}</small>
            </div>
            <div class="text-end">
              <div class="text-neon">₹${c.price || 0}</div>
              <small class="text-muted d-block">${c.capacity || 0} spots</small>
            </div>
          </div>
          <p class="small text-muted mt-2">${c.description ? c.description.substring(0,140) : ''}</p>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-sm btn-outline-light" data-id="${c.id}" data-action="edit-class">Edit</button>
            <button class="btn btn-sm btn-outline-danger" data-id="${c.id}" data-action="del-class">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // load trainers into select
  async function populateTrainersSelect(){
    let trainers = null;
    try{
      const res = await Auth.authFetch('/api/trainers');
      if(res.ok) trainers = await res.json();
    }catch(e){ trainers = null; }
    if(!trainers){
      try{ trainers = JSON.parse(localStorage.getItem('vg_trainers')||'[]'); }catch(e){ trainers = []; }
    }
    const sel = document.getElementById('cTrainer');
    sel.innerHTML = '<option value=\"\">-- Select Trainer --</option>' + (trainers||[]).map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
  }

  document.getElementById('openTrainer').addEventListener('click', ()=>{
    editingTrainer = null;
    document.getElementById('tName').value = '';
    document.getElementById('tSpecialty').value = '';
    document.getElementById('tBio').value = '';
    document.getElementById('tPhoto').value = '';
    trainerModal.show();
  });

  document.getElementById('openClass').addEventListener('click', async ()=>{
    editingClass = null;
    document.getElementById('cTitle').value = '';
    document.getElementById('cSchedule').value = '';
    document.getElementById('cCapacity').value = '';
    document.getElementById('cPrice').value = '';
    document.getElementById('cDesc').value = '';
    await populateTrainersSelect();
    classModal.show();
  });

  // Trainer modal save
  document.getElementById('saveTrainer').addEventListener('click', async ()=>{
    const payload = { name: document.getElementById('tName').value, specialty: document.getElementById('tSpecialty').value, bio: document.getElementById('tBio').value, photoUrl: document.getElementById('tPhoto').value };
    try{
      // Try backend first; fallback to localStorage
      let ok = false;
      try{
        let res;
        if(editingTrainer){
          res = await Auth.authFetch(`/api/trainers/${editingTrainer}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        } else {
          res = await Auth.authFetch('/api/trainers', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        }
        ok = res && res.ok;
      }catch(e){ ok = false; }
      if(!ok){
        // localStorage save
        const trainers = JSON.parse(localStorage.getItem('vg_trainers')||'[]');
        if(editingTrainer){
          const idx = trainers.findIndex(t => t.id === editingTrainer);
          if(idx >= 0) trainers[idx] = Object.assign({}, trainers[idx], payload);
        } else {
          const id = 't' + Date.now();
          trainers.push(Object.assign({ id }, payload));
        }
        localStorage.setItem('vg_trainers', JSON.stringify(trainers));
      }
      trainerModal.hide(); await loadTrainers();
    }catch(err){ console.error(err); alert('Error'); }
  });

  // Class modal save
  document.getElementById('saveClass').addEventListener('click', async ()=>{
    const payload = { title: document.getElementById('cTitle').value, schedule: document.getElementById('cSchedule').value, capacity: parseInt(document.getElementById('cCapacity').value||0,10), price: parseFloat(document.getElementById('cPrice').value||0), description: document.getElementById('cDesc').value, trainer: { id: document.getElementById('cTrainer').value || null } };
    try{
      // Try backend then fallback to localStorage
      let ok = false;
      try{
        let res;
        if(editingClass){
          res = await Auth.authFetch(`/api/classes/${editingClass}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        } else {
          res = await Auth.authFetch('/api/classes', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        }
        ok = res && res.ok;
      }catch(e){ ok = false; }
      if(!ok){
        const classes = JSON.parse(localStorage.getItem('vg_classes')||'[]');
        if(editingClass){
          const idx = classes.findIndex(c => c.id === editingClass);
          if(idx >= 0) classes[idx] = Object.assign({}, classes[idx], payload);
        } else {
          const id = 'c' + Date.now();
          classes.push(Object.assign({ id }, payload));
        }
        localStorage.setItem('vg_classes', JSON.stringify(classes));
      }
      classModal.hide(); await loadClasses();
    }catch(err){ console.error(err); alert('Error'); }
  });

  // Delegated buttons
  document.body.addEventListener('click', async (e)=>{
    const action = e.target.getAttribute('data-action') || e.target.closest('[data-action]')?.getAttribute('data-action');
    const id = e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id');
    if(!action) return;
    if(action === 'del-trainer' && id){
      if(!confirm('Delete trainer?')) return;
      try{
        const res = await Auth.authFetch(`/api/trainers/${id}`, { method:'DELETE' });
        if(!res.ok) throw new Error('Backend delete failed');
      }catch(e){
        // fallback local delete
        const trainers = JSON.parse(localStorage.getItem('vg_trainers')||'[]').filter(t=>t.id !== id);
        localStorage.setItem('vg_trainers', JSON.stringify(trainers));
      }
      await loadTrainers();
    }
    if(action === 'edit-trainer' && id){
      let t = null;
      try{
        const res = await Auth.authFetch(`/api/trainers/${id}`);
        if(res.ok) t = await res.json();
      }catch(e){
        try{ t = JSON.parse(localStorage.getItem('vg_trainers')||'[]').find(x=>x.id===id) }catch(e){ t = null; }
      }
      editingTrainer = id;
      document.getElementById('tName').value = t?.name || '';
      document.getElementById('tSpecialty').value = t?.specialty || '';
      document.getElementById('tBio').value = t?.bio || '';
      document.getElementById('tPhoto').value = t?.photoUrl || '';
      trainerModal.show();
    }
    if(action === 'del-class' && id){
      if(!confirm('Delete class?')) return;
      try{
        const res = await Auth.authFetch(`/api/classes/${id}`, { method:'DELETE' });
        if(!res.ok) throw new Error('Backend delete failed');
      }catch(e){
        const classes = JSON.parse(localStorage.getItem('vg_classes')||'[]').filter(c=>c.id !== id);
        localStorage.setItem('vg_classes', JSON.stringify(classes));
      }
      await loadClasses();
    }
    if(action === 'edit-class' && id){
      let c = null;
      try{
        const res = await Auth.authFetch(`/api/classes/${id}`);
        if(res.ok) c = await res.json();
      }catch(e){
        try{ c = JSON.parse(localStorage.getItem('vg_classes')||'[]').find(x=>x.id===id) }catch(e){ c = null; }
      }
      editingClass = id;
      document.getElementById('cTitle').value = c.title;
      document.getElementById('cSchedule').value = c.schedule;
      document.getElementById('cCapacity').value = c.capacity;
      document.getElementById('cPrice').value = c.price;
      document.getElementById('cDesc').value = c.description;
      await populateTrainersSelect();
      if(c.trainer) document.getElementById('cTrainer').value = c.trainer.id;
      classModal.show();
    }
  });

  // Logout
  document.getElementById('adminLogout').addEventListener('click', ()=>{
    Auth.removeToken(); window.location.href = 'index.html';
  });

  // initial load
  (async ()=>{ await loadTrainers(); await loadClasses(); })();

  /* ====== Admin settings (color tokens) ====== */
  function defaultSiteSettings(){
    return {
      accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6a00',
      ctaStart: getComputedStyle(document.documentElement).getPropertyValue('--cta-start').trim() || '#00b4ff',
      ctaEnd: getComputedStyle(document.documentElement).getPropertyValue('--cta-end').trim() || '#0056ff',
      neon: getComputedStyle(document.documentElement).getPropertyValue('--neon').trim() || '#00b4ff'
    };
  }
  function loadSiteSettings(){
    try{
      const raw = localStorage.getItem('vg_site_settings');
      if(!raw) return defaultSiteSettings();
      return Object.assign(defaultSiteSettings(), JSON.parse(raw));
    }catch(e){ return defaultSiteSettings(); }
  }
  function applySiteSettings(s){
    if(!s) s = loadSiteSettings();
    document.documentElement.style.setProperty('--accent', s.accent);
    document.documentElement.style.setProperty('--cta-start', s.ctaStart);
    document.documentElement.style.setProperty('--cta-end', s.ctaEnd);
    document.documentElement.style.setProperty('--neon', s.neon);
    // update preview button if exists
    const preview = document.getElementById('settingsPreview');
    if(preview) preview.querySelector('.btn-cta')?.classList.add('btn-cta');
  }
  // open settings modal
  document.getElementById('openSettings')?.addEventListener('click', ()=>{
    const s = loadSiteSettings();
    document.getElementById('sAccent').value = s.accent || '#ff6a00';
    document.getElementById('sCtaStart').value = s.ctaStart || '#00b4ff';
    document.getElementById('sCtaEnd').value = s.ctaEnd || '#0056ff';
    document.getElementById('sNeon').value = s.neon || '#00b4ff';
    // live preview handlers
    ['sAccent','sCtaStart','sCtaEnd','sNeon'].forEach(id=>{
      const el = document.getElementById(id);
      el && el.addEventListener('input', ()=> {
        const tmp = {
          accent: document.getElementById('sAccent').value,
          ctaStart: document.getElementById('sCtaStart').value,
          ctaEnd: document.getElementById('sCtaEnd').value,
          neon: document.getElementById('sNeon').value
        };
        applySiteSettings(tmp);
      });
    });
    settingsModal && settingsModal.show();
  });
  // save settings
  document.getElementById('saveSettings')?.addEventListener('click', ()=>{
    const s = {
      accent: document.getElementById('sAccent').value,
      ctaStart: document.getElementById('sCtaStart').value,
      ctaEnd: document.getElementById('sCtaEnd').value,
      neon: document.getElementById('sNeon').value
    };
    localStorage.setItem('vg_site_settings', JSON.stringify(s));
    applySiteSettings(s);
    settingsModal && settingsModal.hide();
    showToast('Settings saved', 'success');
  });
  // reset
  document.getElementById('resetSettings')?.addEventListener('click', ()=>{
    localStorage.removeItem('vg_site_settings');
    const d = defaultSiteSettings();
    applySiteSettings(d);
    document.getElementById('sAccent').value = d.accent;
    document.getElementById('sCtaStart').value = d.ctaStart;
    document.getElementById('sCtaEnd').value = d.ctaEnd;
    document.getElementById('sNeon').value = d.neon;
    showToast('Settings reset', 'info');
  });

  // apply saved settings on admin load
  applySiteSettings(loadSiteSettings());
});


