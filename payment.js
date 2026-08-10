(async function(){
  const message=document.getElementById('message'), amount=document.getElementById('amount'), form=document.getElementById('paymentForm');
  function setMessage(t,ok=false){message.textContent=t;message.style.color=ok?'#4ade80':'#fb7185'}
  if(!window.IOIS_SUPABASE){setMessage('Supabase load नहीं हुआ।');return}
  const {data:{user},error:authError}=await IOIS_SUPABASE.auth.getUser();
  if(authError||!user){location.href='login.html';return}
  const {data:member,error}=await IOIS_SUPABASE.from('members').select('id,plan_amount,plan_id,membership_status,selected_services').eq('auth_user_id',user.id).single();
  if(error||!member){setMessage('Member record नहीं मिला। पहले registration complete करें।');return}
  amount.value='₹'+Number(member.plan_amount).toLocaleString('en-IN');
  document.getElementById('planName').textContent=member.plan_id||'—';
  document.getElementById('services').textContent=Array.isArray(member.selected_services)&&member.selected_services.length?member.selected_services.join(' • '):'—';
  document.getElementById('membershipStatus').textContent=member.membership_status||'pending';
  form.addEventListener('submit',async e=>{e.preventDefault();setMessage('Payment submit हो रहा है...',true);
    const payload={member_id:member.id,payment_method:document.getElementById('method').value,upi_id:document.getElementById('upiId').value.trim(),transaction_reference:document.getElementById('transactionReference').value.trim(),payment_status:'PENDING',amount:member.plan_amount};
    if(!payload.upi_id||!payload.transaction_reference){setMessage('UPI ID और transaction reference भरें।');return}
    const {data:pending}=await IOIS_SUPABASE.from('payments').select('id').eq('member_id',member.id).eq('payment_status','PENDING').limit(1);
    if(Array.isArray(pending)&&pending.length){setMessage('आपका एक payment verification के लिए पहले से pending है।',false);return}
    const {error}=await IOIS_SUPABASE.from('payments').insert(payload);
    if(error){console.error(error);setMessage(error.message);return}
    setMessage('Payment submitted. Admin verification pending है।',true); form.reset(); amount.value='₹'+Number(member.plan_amount).toLocaleString('en-IN');
  });
})();
