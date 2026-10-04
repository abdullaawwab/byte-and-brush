import { getUser } from "@netlify/identity";
export default async () => {
  const user = await getUser();
  if (!user) return Response.json({error:"Not signed in"}, {status:401});
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!adminEmail || (user.email || "").toLowerCase() !== adminEmail)
    return Response.json({error:"Owner access is not enabled for this account."},{status:403});
  return Response.json({email:user.email});
};
export const config={path:"/.netlify/functions/auth-me"};