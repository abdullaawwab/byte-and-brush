import { saveEnquiry } from "../lib/data.mjs";
function clean(v,n=200){return String(v??"").trim().slice(0,n)}
export default async (req)=>{
  if(req.method!=="POST") return Response.json({error:"Method not allowed"},{status:405});
  try{
    const b=await req.json();
    if(clean(b.website,100)) return Response.json({ok:true}); // honeypot
    const name=clean(b.name,100), email=clean(b.email,180), idea=clean(b.idea,2000);
    if(!name || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || idea.length<10)
      return Response.json({error:"Please complete your name, email and project idea."},{status:400});
    const item={
      id:crypto.randomUUID(),
      createdAt:new Date().toISOString(),
      read:false,
      service:clean(b.service,80),
      name,email,
      phone:clean(b.phone,60),
      deadline:clean(b.deadline,30),
      budget:clean(b.budget,80),
      idea,
      source:clean(b.source,80)
    };
    await saveEnquiry(item);
    return Response.json({ok:true,id:item.id});
  }catch(e){
    console.error(e);
    return Response.json({error:"Could not save your enquiry. Please try again."},{status:500});
  }
};
export const config={path:"/.netlify/functions/enquiry"};