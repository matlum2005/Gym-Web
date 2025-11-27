document.addEventListener("DOMContentLoaded", function(){
  const membersList = document.getElementById("membersList");
  const joinForm = document.getElementById("joinForm");
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  async function loadMembers(){
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

  // Theme toggle (light/dark) persisted in localStorage
  function applyTheme(theme){
    if(theme === 'light'){
      document.body.classList.add('theme-light');
      // update both icons if present
      const ti = document.getElementById('themeIcon');
      const tid = document.getElementById('themeIconDesktop');
      if(ti) ti.className = 'bi bi-sun-fill';
      if(tid) tid.className = 'bi bi-sun-fill';
    } else {
      document.body.classList.remove('theme-light');
      const ti = document.getElementById('themeIcon');
      const tid = document.getElementById('themeIconDesktop');
      if(ti) ti.className = 'bi bi-moon-fill';
      if(tid) tid.className = 'bi bi-moon-fill';
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
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
    // Desktop/nav variant toggle (if present)
    const themeToggleDesktop = document.getElementById('themeToggleDesktop');
    if(themeToggleDesktop){
      themeToggleDesktop.addEventListener('click', ()=> {
        const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
        applyTheme(current === 'light' ? 'dark' : 'light');
      });
    }
  })();
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
      alert('Thanks — welcome to Pro Gym!');
    }catch(err){
      console.error(err);
      alert('Could not submit. Check console for details.');
    }
  });

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

  /* ====== Parallax simple handler ====== */
  (function parallaxInit(){
    const par = document.querySelectorAll('[data-parallax]');
    if(!par) return;
    function tick(){
      par.forEach(el=>{
        const v = parseFloat(el.getAttribute('data-parallax')) || 0.4;
        const rect = el.getBoundingClientRect();
        const offset = window.scrollY * v;
        el.style.backgroundPosition = `center calc(50% + ${offset * 0.1}px)`;
      });
    }
    tick();
    window.addEventListener('scroll', ()=> requestAnimationFrame(tick), { passive: true });
  })();

  /* ====== Intersection animations ====== */
  (function animateOnScroll(){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting) en.target.classList.add('fade-up','in-view');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.glass, .service-card, .trainer-card, .pricing-card, .stat-card').forEach(el=> obs.observe(el));
  })();

  /* ====== Testimonial slider ====== */
  (function testimonialSlider(){
    const slider = document.getElementById('testSlider');
    if(!slider) return;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    let idx = slides.findIndex(s => s.classList.contains('active'));
    if(idx < 0) idx = 0;
    const show = (i)=>{
      slides.forEach((s,si)=> s.classList.toggle('active', si === i));
    };
    const next = ()=> { idx = (idx + 1) % slides.length; show(idx); };
    const prev = ()=> { idx = (idx - 1 + slides.length) % slides.length; show(idx); };
    document.getElementById('nextTest')?.addEventListener('click', next);
    document.getElementById('prevTest')?.addEventListener('click', prev);
    let auto = setInterval(next, 6000);
    [slider, document.getElementById('nextTest'), document.getElementById('prevTest')].forEach(el=>{
      el && el.addEventListener('mouseenter', ()=> clearInterval(auto));
      el && el.addEventListener('mouseleave', ()=> auto = setInterval(next, 6000));
    });
  })();
 
  /* ====== AI Workout Chatbot ====== */
  (function aiChatbot(){
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');

    // AI Response Database
    const aiResponses = {
      exercises: {
        keywords: ['exercise', 'workout', 'lift', 'train', 'muscle', 'strength', 'cardio', 'running', 'push', 'pull', 'squat', 'deadlift', 'bench', 'overhead'],
        responses: [
          "For building strength, focus on compound movements like squats, deadlifts, bench press, and overhead press. Aim for 3-5 sets of 4-6 reps.",
          "Cardio workouts should include a mix of steady-state and HIIT. Try 20-30 minutes of moderate intensity 3-4 times per week.",
          "Remember proper form is crucial! If you're new to an exercise, start with lighter weights and focus on technique before increasing load."
        ]
      },
      nutrition: {
        keywords: ['eat', 'food', 'diet', 'protein', 'carb', 'calorie', 'meal', 'nutrition', 'supplement', 'vitamin'],
        responses: [
          "Aim for a balanced macronutrient split: 40-50% carbs, 25-30% protein, and 20-30% fats. Adjust based on your goals and activity level.",
          "Protein intake should be around 1.6-2.2g per kg of body weight for optimal muscle recovery and growth.",
          "Stay hydrated! Drink at least 3-4 liters of water daily, more if you're active or in hot weather."
        ]
      },
      recovery: {
        keywords: ['rest', 'recovery', 'sleep', 'tired', 'sore', 'pain', 'injury', 'stretch', 'mobility'],
        responses: [
          "Quality sleep (7-9 hours) is essential for recovery and muscle growth. Poor sleep can hinder your progress significantly.",
          "Active recovery like light walking, swimming, or yoga can help reduce soreness while still promoting blood flow.",
          "Foam rolling and stretching should be part of your routine. Focus on major muscle groups for 5-10 minutes post-workout."
        ]
      },
      motivation: {
        keywords: ['motivation', 'goal', 'progress', 'plateau', 'consistency', 'habit', 'discipline'],
        responses: [
          "Consistency beats perfection! Focus on showing up regularly rather than having perfect workouts every time.",
          "Track your progress weekly, not daily. Small improvements compound over time and lead to big results.",
          "Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound. Break them into smaller milestones."
        ]
      },
      general: {
        responses: [
          "That's a great question! I'm here to help with all your fitness needs. Can you be more specific about what you're looking for?",
          "Remember, sustainable progress comes from consistency and proper recovery. Keep up the great work!",
          "Every fitness journey is unique. What works for others might need adjustment for your body and lifestyle."
        ]
      }
    };

    function getAIResponse(userMessage) {
      const message = userMessage.toLowerCase();

      // Check each category for keyword matches
      for (const [category, data] of Object.entries(aiResponses)) {
        if (category === 'general') continue;

        const hasKeyword = data.keywords.some(keyword => message.includes(keyword));
        if (hasKeyword) {
          const randomResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
          return randomResponse;
        }
      }

      // Default to general responses
      return aiResponses.general.responses[Math.floor(Math.random() * aiResponses.general.responses.length)];
    }

    function addMessage(message, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `mb-2 ${isUser ? 'user-message' : 'ai-message'}`;

      if (isUser) {
        messageDiv.innerHTML = `
          <small class="text-muted">You:</small>
          <p class="small mb-0">${escapeHtml(message)}</p>
        `;
      } else {
        messageDiv.innerHTML = `
          <small class="text-neon">🤖 AI Coach:</small>
          <p class="small mb-0">${message}</p>
        `;
      }

      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChat() {
      const message = chatInput.value.trim();
      if (!message) return;

      addMessage(message, true);
      chatInput.value = '';

      // Simulate typing delay
      setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response);
      }, 1000 + Math.random() * 1000); // 1-2 second delay
    }

    // Event listeners
    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleChat();
      }
    });

    // Add some initial helpful suggestions
    setTimeout(() => {
      addMessage("💡 Try asking me about: exercises, nutrition, recovery, or motivation tips!");
    }, 2000);
  })();

  /* ====== Gallery lightbox & trainer micro-interactions ====== */
  (function galleryLightboxAndTrainerExtras(){
    // create lightbox container if not present
    let lightbox = document.querySelector('.lightbox');
    if(!lightbox){
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<button class="close-btn" aria-label="Close">&times;</button><img alt="preview"/>';
      document.body.appendChild(lightbox);
    }
    const lbImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-btn');
    function openLightbox(src, alt=''){
      lbImg.src = src;
      lbImg.alt = alt;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox(){
      lightbox.classList.remove('show');
      lbImg.src = '';
      document.body.style.overflow = '';
    }
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

    // bind masonry images
    document.querySelectorAll('.masonry img').forEach(img=>{
      img.addEventListener('click', ()=> openLightbox(img.src, img.alt || 'Image'));
      img.style.cursor = 'zoom-in';
    });

    // trainer avatars also open lightbox
    document.querySelectorAll('.trainer-card .avatar').forEach(av=>{
      av.addEventListener('click', ()=> openLightbox(av.src, av.alt || 'Trainer'));
    });

    // Add small social icons to trainer cards if missing
    document.querySelectorAll('.trainer-card').forEach(card=>{
      if(card.querySelector('.trainer-social')) return;
      const social = document.createElement('div');
      social.className = 'trainer-social';
      social.innerHTML = '<a href=\"#\" aria-label=\"instagram\"><i class=\"fab fa-instagram\"></i></a><a href=\"#\" aria-label=\"twitter\"><i class=\"fab fa-twitter\"></i></a><a href=\"#\" aria-label=\"linkedin\"><i class=\"fab fa-linkedin\"></i></a>';
      card.appendChild(social);
    });

    // simple toast helper
    window.showToast = function(message = '', type = 'info', ms = 3000){
      let t = document.querySelector('.site-toast');
      if(!t){
        t = document.createElement('div');
        t.className = 'site-toast';
        document.body.appendChild(t);
      }
      t.textContent = message;
      t.style.background = type === 'success' ? 'linear-gradient(90deg,var(--neon), #05b35a)' : (type === 'danger' ? 'linear-gradient(90deg,#ff004d,#ff6a00)' : 'linear-gradient(90deg,rgba(0,180,255,0.9),#0056ff)');
      t.classList.add('show');
      clearTimeout(t._hideTimeout);
      t._hideTimeout = setTimeout(()=> t.classList.remove('show'), ms);
    };
  })();
});


