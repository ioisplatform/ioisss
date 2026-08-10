// IOIS Telegram notification Edge Function
// Secrets required in Supabase:
// TELEGRAM_BOT_TOKEN = current bot token
// TELEGRAM_CHAT_ID = 964524685
Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed',{status:405});
  try {
    const token=Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId=Deno.env.get('TELEGRAM_CHAT_ID') || '964524685';
    if(!token) return new Response(JSON.stringify({success:false,error:'TELEGRAM_BOT_TOKEN secret is missing'}),{status:500,headers:{'content-type':'application/json'}});
    const p=await req.json();
    const text=[
      '🔔 IOIS — New Registration',
      `👤 Name: ${p.name||'-'}`,
      `🆔 User ID: ${p.user_id||'-'}`,
      `📱 Mobile: ${p.phone||'-'}`,
      `📧 Email: ${p.email||'-'}`,
      `💳 Plan: ${p.plan||'-'}`,
      `💰 Amount: ₹${p.amount??'-'}`,
      `🤝 Referral: ${p.sponsor_id||p.referral_code||'-'}`,
      `🕒 Time: ${p.created_at||new Date().toISOString()}`
    ].join('\n');
    const r=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({chat_id:chatId,text})});
    const result=await r.json();
    return new Response(JSON.stringify({success:r.ok,telegram:result}),{status:r.ok?200:502,headers:{'content-type':'application/json'}});
  } catch(error){return new Response(JSON.stringify({success:false,error:String(error)}),{status:500,headers:{'content-type':'application/json'}})}
});
