document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");
    const message = document.getElementById("message");
    const button = document.getElementById("registerButton");
    const plan = document.getElementById("plan");
    const servicesBox = document.getElementById("services");
    const serviceCount = document.getElementById("serviceCount");
    const selectAll = document.getElementById("selectAll");
    const planName = document.getElementById("planName");
    const planDisplay = document.getElementById("planDisplay");
    const planPrice = document.getElementById("planPrice");
    const query = new URLSearchParams(location.search);
    const plans = Array.isArray(window.IOIS_CONFIG?.PLANS) ? window.IOIS_CONFIG.PLANS : [];

    function showMessage(text, type) { message.textContent = text; message.className = "msg show " + type; }
    function validMobile(v) { return /^[6-9]\d{9}$/.test(v); }
    function selected() { return [...servicesBox.querySelectorAll('input[type="checkbox"]:checked')].map(x => x.value); }
    function updateCount() { const n=selected().length; serviceCount.textContent = `${n} service${n===1?'':'s'} selected`; selectAll.textContent = n === servicesBox.querySelectorAll('input[type="checkbox"]').length && n ? "सभी हटाएँ" : "सभी चुनें"; }

    function renderServices(p) {
        servicesBox.innerHTML = (p?.features || []).map((feature, i) => `<label class="service"><input type="checkbox" value="${String(feature).replace(/"/g,'&quot;')}"><span><b>${feature}</b><small>Plan में उपलब्ध service</small></span></label>`).join("");
        if (!servicesBox.children.length) servicesBox.innerHTML = '<div class="hint">इस plan के लिए services उपलब्ध नहीं हैं।</div>';
        servicesBox.querySelectorAll('input').forEach(x=>x.addEventListener('change',updateCount));
        updateCount();
    }
    function renderPlan() {
        const p=plans.find(x=>x.id===plan.value)||plans[0];
        if(!p) return;
        planName.textContent=p.name; planDisplay.textContent=p.display; planPrice.textContent='₹'+Number(p.price).toLocaleString('en-IN');
        renderServices(p);
    }

    plan.innerHTML = plans.map(p=>`<option value="${p.id}">${p.name} — ₹${Number(p.price).toLocaleString('en-IN')}</option>`).join("");
    const requestedPlan = query.get("plan");
    if (requestedPlan && plans.some(p=>p.id===requestedPlan)) plan.value=requestedPlan;
    const saved = (()=>{try{return JSON.parse(localStorage.getItem("iois_prefill")||"null")}catch{return null}})();
    if(saved){ if(saved.name) document.getElementById("fullName").value=saved.name; if(saved.phone) document.getElementById("mobile").value=saved.phone; if(saved.ref) document.getElementById("referral").value=saved.ref; localStorage.removeItem("iois_prefill"); }
    const referralFromUrl=query.get("ref"); if(referralFromUrl) document.getElementById("referral").value=referralFromUrl;
    renderPlan(); plan.addEventListener("change",renderPlan);
    selectAll.addEventListener("click",()=>{ const boxes=[...servicesBox.querySelectorAll('input[type="checkbox"]')]; const all=boxes.length && boxes.every(x=>x.checked); boxes.forEach(x=>x.checked=!all); updateCount(); });
    document.getElementById("togglePassword").addEventListener("click",()=>{const x=document.getElementById("password");x.type=x.type==='password'?'text':'password'});
    document.getElementById("toggleConfirmPassword").addEventListener("click",()=>{const x=document.getElementById("confirmPassword");x.type=x.type==='password'?'text':'password'});

    form.addEventListener("submit", async function(e){
        e.preventDefault();
        const fullName=document.getElementById("fullName").value.trim();
        const mobile=document.getElementById("mobile").value.trim();
        const email=document.getElementById("email").value.trim().toLowerCase();
        const password=document.getElementById("password").value;
        const confirm=document.getElementById("confirmPassword").value;
        const referral=document.getElementById("referral").value.trim();
        const services=selected();
        if(fullName.length<2) return showMessage("कृपया सही पूरा नाम दर्ज करें।","err");
        if(!validMobile(mobile)) return showMessage("सही 10 digit Indian mobile number दर्ज करें।","err");
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage("सही email address दर्ज करें।","err");
        if(password.length<8) return showMessage("Password कम से कम 8 characters का होना चाहिए।","err");
        if(password!==confirm) return showMessage("दोनों passwords समान होने चाहिए।","err");
        if(!services.length) return showMessage("कम से कम 1 service चुनें।","err");
        if(!document.getElementById("terms").checked) return showMessage("Registration confirmation स्वीकार करें।","err");
        button.disabled=true; button.textContent="Account बनाया जा रहा है...";
        try {
            const result=await window.IOIS_AUTH.signUp({fullName,mobile,email,password,planId:plan.value,referralCode:referral,selectedServices:services});
            if(!result.success){ showMessage(result.message,"err"); button.disabled=false; button.textContent="Create IOIS Account"; return; }
            if(result.session){ showMessage("Registration successful! Dashboard खोला जा रहा है...","ok"); setTimeout(()=>location.href="dashboard.html",900); }
            else { showMessage("Registration successful! Email verification पूरा करके Login करें।","ok"); form.reset(); plan.value=requestedPlan||"starter"; renderPlan(); button.disabled=false; button.textContent="Create IOIS Account"; }
        } catch(err){ console.error(err); showMessage("Registration के दौरान error आया। कृपया दोबारा प्रयास करें।","err"); button.disabled=false; button.textContent="Create IOIS Account"; }
    });
});
