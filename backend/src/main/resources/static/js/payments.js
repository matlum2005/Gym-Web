document.addEventListener('DOMContentLoaded', function(){
  const fabJoin = document.getElementById('fabJoin');
  const payModalEl = document.getElementById('paymentModal');
  const payModal = payModalEl ? new bootstrap.Modal(payModalEl) : null;
  const payAmount = document.getElementById('payAmount');
  const payPlan = document.getElementById('payPlan');
  const payEmail = document.getElementById('payEmail');
  const payStripe = document.getElementById('payStripe');
  const payRzp = document.getElementById('payRzp');

  function openModal(plan='Standard', amount=1999){
    if(!payModal) return;
    payPlan.textContent = plan;
    payAmount.value = amount;
    payEmail.value = '';
    payModal.show();
  }

  fabJoin && fabJoin.addEventListener('click', ()=> openModal('Standard', 1999));

  async function recordPayment(amount, currency, email){
    try{
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ amount, currency, email })
      });
      if(res.ok){
        alert('Payment recorded (demo). Thank you!');
        payModal.hide();
      } else {
        alert('Payment failed to record.');
      }
    }catch(err){
      console.error(err);
      alert('Error during payment.');
    }
  }

  payStripe && payStripe.addEventListener('click', ()=>{
    const amt = parseFloat(payAmount.value) || 0;
    const email = payEmail.value || null;
    // In real integration, initiate Stripe Checkout here. Demo: directly record payment.
    recordPayment(amt, 'INR', email);
  });
  payRzp && payRzp.addEventListener('click', ()=>{
    const amt = parseFloat(payAmount.value) || 0;
    const email = payEmail.value || null;
    // In real integration, call server to create Razorpay order. Demo: directly record payment.
    recordPayment(amt, 'INR', email);
  });
});


