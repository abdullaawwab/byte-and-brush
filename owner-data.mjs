import { getUser } from "@netlify/identity";
import { getSettings, saveSettings } from "../lib/data.mjs";

async function owner(){
  const user=await getUser();
  if(!user) return null;
  const adminEmail=(process.env.ADMIN_EMAIL||"").trim().toLowerCase();
  if(!adminEmail || (user.email||"").toLowerCase()!==adminEmail) return null;
  return user;
}
export default async (req)=>{
  if(!(await owner())) return Response.json({error:"Unauthorized"},{status:401});
  if(req.method==="GET") return Response.json(await getSettings());
  if(req.method==="PUT"){
    const body=await req.json();
    const current=await getSettings();
    const next={
      ...current,
      prices:{
        web:Math.max(0,Math.round(Number(body.prices?.web))),
        poster:Math.max(0,Math.round(Number(body.prices?.poster))),
        game:Math.max(0,Math.round(Number(body.prices?.game)))
      },
      days:{
        web:String(body.days?.web||current.days.web).slice(0,80),
        poster:String(body.days?.poster||current.days.poster).slice(0,80),
        game:String(body.days?.game||current.days.game).slice(0,80)
      }
    };
    await saveSettings(next);
    return Response.json(next);
  }
  return Response.json({error:"Method not allowed"},{status:405});
};
export const config={path:"/.netlify/functions/owner-data"};