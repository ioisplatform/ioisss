import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:cors});
const digits=(v:string)=>String(v||"").replace(/\D/g,"");
const normPhone=(v:string)=>digits(v).slice(-10);

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST") return json({message:"Method not allowed."},405);

  const url=Deno.env.get("SUPABASE_URL")||"";
  const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
  if(!url||!service) return json({code:"AUTH_NOT_CONFIGURED",message:"Recovery service is not configured."},500);

  let body:any;
  try{body=await req.json();}catch{return json({message:"Invalid request."},400);}

  const action=String(body?.action||"");
  const email=String(body?.email||"").trim().toLowerCase();
  const phone=normPhone(body?.phone);
  const memberId=String(body?.member_id||"").trim().toUpperCase();

  if(!["find_user_id","reset_password"].includes(action))
    return json({message:"Invalid recovery action."},400);

  if(!email || phone.length!==10)
    return json({message:"Registered Email और 10-digit WhatsApp/Mobile Number डालें."},400);

  const admin=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});

  // Primary source: members table.
  const {data:members,error:mErr}=await admin
    .from("members")
    .select("id,auth_user_id,iois_user_id,email,mobile,status,full_name")
    .ilike("email",email);

  if(mErr) return json({code:"SERVER_ERROR",message:"Member lookup failed."},500);

  let member=(members||[]).find((x:any)=>normPhone(x.mobile)===phone);

  // Fallback for older registrations.
  if(!member){
    const {data:registry,error:rErr}=await admin
      .from("iois_member_registry")
      .select("id,user_id,member_id,email,phone,full_name,sponsor_id,plan_amount,plan_code,plan_name")
      .ilike("email",email);

    if(rErr) return json({code:"SERVER_ERROR",message:"Member registry lookup failed."},500);
    const r=(registry||[]).find((x:any)=>normPhone(x.phone)===phone);
    if(r){
      member={
        auth_user_id:r.user_id,
        iois_user_id:r.member_id,
        email:r.email,
        mobile:r.phone,
        full_name:r.full_name,
        status:"active"
      };
    }
  }

  if(!member)
    return json({code:"DETAILS_NOT_MATCHED",message:"Registered Email और WhatsApp/Mobile Number match नहीं हुआ."},404);

  if(["blocked","suspended","rejected","inactive"].includes(String(member.status||"").toLowerCase()))
    return json({code:"MEMBER_INACTIVE",message:"यह member account active नहीं है."},403);

  if(action==="find_user_id")
    return json({success:true,member_id:member.iois_user_id});

  if(String(memberId)!==String(member.iois_user_id||"").trim().toUpperCase())
    return json({message:"Member ID match नहीं हुआ."},404);

  const newPassword=String(body?.new_password||"");
  if(newPassword.length<8)
    return json({message:"Password कम से कम 8 characters का होना चाहिए."},400);

  if(!member.auth_user_id)
    return json({code:"AUTH_NOT_LINKED",message:"इस member account का secure login account अभी link नहीं है."},409);

  const {error:uerr}=await admin.auth.admin.updateUserById(
    member.auth_user_id,{password:newPassword}
  );

  if(uerr){
    console.error(uerr);
    return json({code:"PASSWORD_UPDATE_FAILED",message:"Password update नहीं हो पाया."},500);
  }

  return json({success:true});
});
