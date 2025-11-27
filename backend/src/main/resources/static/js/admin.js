document.addEventListener('DOMContentLoaded', function(){
  const trainersList = document.getElementById('trainersList');
  const classesList = document.getElementById('classesList');
  const trainerModalEl = document.getElementById('trainerModal');
  const classModalEl = document.getElementById('classModal');
  const trainerModal = new bootstrap.Modal(trainerModalEl);
  const classModal = new bootstrap.Modal(classModalEl);
  let editingTrainer = null;
  let editingClass = null;

  async function loadTrainers(){
    const res = await Auth.authFetch('/api/trainers');
    if(!res.ok) { trainersList.innerHTML = '<div class="text-danger">Failed to load</div>'; return; }
    const trainers = await res.json();
    trainersList.innerHTML = trainers.map(t => `
      <div class="col-md-4">
        <div class="card glass p-3">
          <div class="d-flex align-items-center gap-3">
            <img src="${t.photoUrl || 'assets/trainer-placeholder.jpg'}" alt="${t.name}" style="width:64px;height:64px;border-radius:8px;object-fit:cover"/>
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
    const res = await Auth.authFetch('/api/classes');
    if(!res.ok) { classesList.innerHTML = '<div class="text-danger">Failed to load</div>'; return; }
    const classes = await res.json();
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
    const res = await Auth.authFetch('/api/trainers');
    if(!res.ok) return;
    const trainers = await res.json();
    const sel = document.getElementById('cTrainer');
    sel.innerHTML = '<option value=\"\">-- Select Trainer --</option>' + trainers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
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
      let res;
      if(editingTrainer){
        res = await Auth.authFetch(`/api/trainers/${editingTrainer}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      } else {
        res = await Auth.authFetch('/api/trainers', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }
      if(res.ok){ trainerModal.hide(); await loadTrainers(); }
      else { alert('Save failed'); }
    }catch(err){ console.error(err); alert('Error'); }
  });

  // Class modal save
  document.getElementById('saveClass').addEventListener('click', async ()=>{
    const payload = { title: document.getElementById('cTitle').value, schedule: document.getElementById('cSchedule').value, capacity: parseInt(document.getElementById('cCapacity').value||0,10), price: parseFloat(document.getElementById('cPrice').value||0), description: document.getElementById('cDesc').value, trainer: { id: document.getElementById('cTrainer').value || null } };
    try{
      let res;
      if(editingClass){
        res = await Auth.authFetch(`/api/classes/${editingClass}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      } else {
        res = await Auth.authFetch('/api/classes', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      }
      if(res.ok){ classModal.hide(); await loadClasses(); }
      else { alert('Save failed'); }
    }catch(err){ console.error(err); alert('Error'); }
  });

  // Delegated buttons
  document.body.addEventListener('click', async (e)=>{
    const action = e.target.getAttribute('data-action') || e.target.closest('[data-action]')?.getAttribute('data-action');
    const id = e.target.getAttribute('data-id') || e.target.closest('[data-id]')?.getAttribute('data-id');
    if(!action) return;
    if(action === 'del-trainer' && id){
      if(!confirm('Delete trainer?')) return;
      await Auth.authFetch(`/api/trainers/${id}`, { method:'DELETE' });
      await loadTrainers();
    }
    if(action === 'edit-trainer' && id){
      const res = await Auth.authFetch(`/api/trainers/${id}`);
      const t = await res.json();
      editingTrainer = id;
      document.getElementById('tName').value = t.name;
      document.getElementById('tSpecialty').value = t.specialty;
      document.getElementById('tBio').value = t.bio;
      document.getElementById('tPhoto').value = t.photoUrl;
      trainerModal.show();
    }
    if(action === 'del-class' && id){
      if(!confirm('Delete class?')) return;
      await Auth.authFetch(`/api/classes/${id}`, { method:'DELETE' });
      await loadClasses();
    }
    if(action === 'edit-class' && id){
      const res = await Auth.authFetch(`/api/classes/${id}`);
      const c = await res.json();
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
    Auth.removeToken(); window.location.href = '/';
  });

  // initial load
  (async ()=>{ await loadTrainers(); await loadClasses(); })();
});


