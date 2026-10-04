import { logout, verifyRequestOrigin } from "@netlify/identity";
export default async (req) => {
  try { verifyRequestOrigin(req); await logout(); return Response.json({ok:true}); }
  catch(e){ return Response.json({error:"Sign out failed."},{status:400}); }
};
export const config={path:"/.netlify/functions/auth-logout"};