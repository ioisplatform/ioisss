// =========================================================
// IOIS - CENTRAL CONFIGURATION
// =========================================================

window.IOIS_CONFIG = {
    SUPABASE_URL: "https://hrvwzviprlnpkhgrzdrc.supabase.co",
    SUPABASE_KEY: "sb_publishable_tXoFuC0rz0JeDOQvmpjz7w_ZAJhKOVF",

    ROUTES: {
        HOME: "index.html",
        REGISTER: "register.html",
        LOGIN: "login.html",
        DASHBOARD: "dashboard.html",
        RESET_PASSWORD: "reset-password.html"
    },

    APP_NAME: "IOIS",
    APP_FULL_NAME: "Indian Online Income Supporting System",

    PLANS: [
        {id:"starter",name:"Starter",display:"Alpha Starter Pass",price:10,payout:7,features:["Digital ID Pass","3 CV Templates","2 Cover Letters","10 ChatGPT Prompts","Useful Website Links"]},
        {id:"basic",name:"Basic",display:"Nexus Pro Creator Kit",price:49,payout:35,features:["Pro Creator Badge","15+ Bio-data","50+ Social Posts","Smartphone Website Guide"]},
        {id:"plus",name:"Plus",display:"Apex Executive Pass",price:99,payout:70,features:["Executive Business Pass","100+ Branding Templates","Logos","Business Card Bundle"]},
        {id:"premium",name:"Premium",display:"Zenith VIP Creator",price:199,payout:120,features:["VIP Creator Card","Mobile Design Masterclass","300+ Marketing Banners"]},
        {id:"pro",name:"Pro",display:"Govt Exam & Student",price:299,payout:220,features:["Student ID Card","Govt Job Alert Sheet","GK & Exam Notes"]},
        {id:"business",name:"Business",display:"Diamond Business Agency",price:499,payout:375,features:["Diamond Agency Card","1000+ Graphic Assets","Video Assets","Agency Manual"]},
        {id:"enterprise",name:"Enterprise",display:"VIP Mastermind & AI",price:999,payout:750,features:["VIP Elite Card","ChatGPT / Canva AI Mastery","Freelancing Blueprint"]}
    ]
};
