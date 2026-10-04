import { login, verifyRequestOrigin } from "@netlify/identity";
export default async (req) => {
  try {
    verifyRequestOrigin(req);
    const {email,password}=await req.json();
    const adminEmail=(process.env.ADMIN_EMAIL||"").trim().toLowerCase();
    if(!adminEmail || String(email||"").toLowerCase()!==adminEmail)
      return Response.json({error:"Invalid owner credentials."},{status:401});
    await login(String(email),String(password));
    return Response.json({ok:true,email:String(email)});
  } catch(e) {
    console.error(e);
    return Response.json({error:"Sign in failed. Check the owner account and password."},{status:401});
  }
};
export const config={path:"/.netlify/functions/auth-login"};