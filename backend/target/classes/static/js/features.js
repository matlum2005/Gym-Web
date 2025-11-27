/* Frontend add-on features: BMI, workout suggestion, progress rings, achievements, gallery, video promo, events slider */
document.addEventListener('DOMContentLoaded', function(){
  /* ===== BMI Calculator ===== */
  const bmiForm = document.getElementById('bmiForm');
  if(bmiForm){
    bmiForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const w = parseFloat(document.getElementById('bmiWeight').value);
      const h = parseFloat(document.getElementById('bmiHeight').value) / 100;
      if(!w || !h){ alert('Please enter valid values'); return; }
      const bmi = +(w / (h*h)).toFixed(1);
      const el = document.getElementById('bmiResult');
      let cat = 'Normal';
      if(bmi < 18.5) cat = 'Underweight';
      else if(bmi >= 25) cat = 'Overweight';
      el.textContent = `${bmi} — ${cat}`;
      el.classList.add('bmi-result');
    });
  }

  /* ===== Workout Suggestion (simple rule-based) ===== */
  const suggestForm = document.getElementById('goalForm');
  if(suggestForm){
    suggestForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const goal = document.getElementById('goalSelect').value;
      const out = document.getElementById('suggestionOut');
      const plans = {
        'lose':'4x HIIT sessions/week + 30min cardio + Calorie deficit diet',
        'build':'5x strength sessions/week + progressive overload plan + protein focus',
        'maintain':'3–4 sessions/week mixed strength & conditioning'
      };
      out.textContent = plans[goal] || 'Balanced program';
      out.classList.add('text-neon');
    });
  }

  /* ===== Progress rings animation ===== */
  function animateRings(){
    document.querySelectorAll('.ring').forEach(r=>{
      const circle = r.querySelector('circle.progress');
      const val = parseInt(r.getAttribute('data-value') || '0',10);
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      const offset = circumference - (val / 100) * circumference;
      setTimeout(()=> { circle.style.strokeDashoffset = offset; }, 200);
    });
  }
  animateRings();

  /* ===== Achievements / badges ===== */
  const badges = document.querySelectorAll('.badge-ach');
  badges.forEach(b=>{
    b.addEventListener('click', ()=>{
      if(b.classList.contains('locked')){ alert('Locked — complete goals to unlock'); return; }
      b.classList.toggle('active');
    });
  });

  /* ===== Lightbox for gallery ===== */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<img alt=\"gallery\"/><button class=\"btn btn-sm btn-outline-light\" style=\"position:absolute;top:18px;right:18px\">Close</button>';
  document.body.appendChild(lightbox);
  lightbox.querySelector('button').addEventListener('click', ()=> lightbox.classList.remove('show'));
  document.querySelectorAll('.masonry img').forEach(img=>{
    img.addEventListener('click', ()=> {
      lightbox.querySelector('img').src = img.src;
      lightbox.classList.add('show');
    });
  });

  /* ===== Video promo modal ===== */
  const promoBtn = document.getElementById('promoOpen');
  if(promoBtn){
    promoBtn.addEventListener('click', ()=>{
      const modal = new bootstrap.Modal(document.getElementById('promoModal'));
      modal.show();
    });
  }

  /* ===== Events slider auto scroll ===== */
  const events = document.querySelector('.events-slider');
  if(events){
    let x=0;
    setInterval(()=> {
      if(events.scrollWidth > events.clientWidth) {
        x = (x + 260) % (events.scrollWidth);
        events.scrollTo({ left: x, behavior: 'smooth' });
      }
    }, 4000);
  }

  /* ===== Daily motivational quote (rotating) ===== */
  const quotes = [
    'Progress not perfection.',
    'One more rep counts.',
    'Consistency builds champions.',
    'Small steps. Big wins.'
  ];
  const quoteEl = document.getElementById('dailyQuote');
  if(quoteEl){
    let qi = 0;
    quoteEl.textContent = quotes[qi];
    setInterval(()=>{ qi = (qi+1)%quotes.length; quoteEl.textContent = quotes[qi]; }, 6000);
  }
});


