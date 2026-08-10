(function(){
  const fallback=[
    {id:'starter',name:'Starter',display:'Alpha Starter Pass',amount:10,payout:7,features:['Digital ID Pass','3 CV Templates','2 Cover Letters','10 ChatGPT Prompts','Useful Website Links']},
    {id:'basic',name:'Basic',display:'Nexus Pro Creator Kit',amount:49,payout:35,features:['Pro Creator Badge','15+ Bio-data','50+ Social Posts','Smartphone Website Guide']},
    {id:'plus',name:'Plus',display:'Apex Executive Pass',amount:99,payout:70,features:['Executive Business Pass','100+ Branding Templates','Logos','Business Card Bundle']},
    {id:'premium',name:'Premium',display:'Zenith VIP Creator',amount:199,payout:120,features:['VIP Creator Card','Mobile Design Masterclass','300+ Marketing Banners']},
    {id:'pro',name:'Pro',display:'Govt Exam & Student',amount:299,payout:220,features:['Student ID Card','Govt Job Alert Sheet','GK & Exam Notes']},
    {id:'business',name:'Business',display:'Diamond Business Agency',amount:499,payout:375,features:['Diamond Agency Card','1000+ Graphic Assets','Video Assets','Agency Manual']},
    {id:'enterprise',name:'Enterprise',display:'VIP Mastermind & AI',amount:999,payout:750,features:['VIP Elite Card','ChatGPT / Canva AI Mastery','Freelancing Blueprint']}
  ];
  const grid=document.getElementById('plans-grid'), msg=document.getElementById('membership-message');
  function render(plans){grid.innerHTML=plans.map((p,i)=>`<article class="plan-card ${i===6?'featured':''}"><span class="plan-no">PLAN ${String(i+1).padStart(2,'0')} ${i===6?'• VIP':''}</span><h3>${p.display||p.name}</h3><div class="plan-price">₹${Number(p.amount).toLocaleString('en-IN')}</div><ul>${(p.features||String(p.description||'').split(/[,•]/).filter(Boolean)).map(x=>`<li>✓ ${x}</li>`).join('')}</ul><div class="payout">Direct Payout Example: ₹${Number(p.payout||0).toLocaleString('en-IN')}</div><button class="btn-primary full" onclick="IOIS_GO_REGISTER('${p.id}')">Join ₹${Number(p.amount).toLocaleString('en-IN')}</button></article>`).join('');}
  render(fallback); msg.textContent='Plans दिखाए जा रहे हैं। Login/Register के बाद चुना हुआ plan account से जोड़ा जाएगा।';
  (async()=>{try{if(!window.IOIS_SUPABASE)return;const {data,error}=await IOIS_SUPABASE.from('membership_plans').select('*').eq('is_active',true).order('amount');if(!error&&data&&data.length){const normalized=data.map(x=>({id:x.plan_code||x.id,name:x.plan_name,display:x.display_name||x.plan_name,amount:x.amount,payout:x.payout||0,features:Array.isArray(x.features)?x.features:[]}));render(normalized);msg.textContent='Plans database से load हुए हैं।';}}catch(e){console.warn('Membership database fallback',e)}})();
})();
