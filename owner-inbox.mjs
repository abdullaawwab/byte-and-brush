import { getUser } from "@netlify/identity";
import { listEnquiries, updateEnquiry, deleteEnquiry } from "../lib/data.mjs";
async function owner(){
  const u=await getUser(); const email=(process.env.ADMIN_EMAIL||"").trim().toLowerCase();
  return u && email && (u.email||"").toLowerCase()===email;
}
export default async (req)=>{
  if(!(await owner())) return Response.json({error:"Unauthorized"},{status:401});
  try{
    if(req.method==="GET") return Response.json({items:await listEnquiries()});
    const b=await req.json();
    if(!b.id) return Response.json({error:"Missing enquiry id"},{status:400});
    if(req.method==="PATCH"){
      const item=await updateEnquiry(String(b.id),{read:Boolean(b.read)});
      return item?Response.json(item):Response.json({error:"Not found"},{status:404});
    }
    if(req.method==="DELETE"){
      await deleteEnquiry(String(b.id));
      return Response.json({ok:true});
    }
    return Response.json({error:"Method not allowed"},{status:405});
  }catch(e){
    console.error(e);
    return Response.json({error:"Inbox operation failed."},{status:500});
  }
};
export const config={path:"/.netlify/functions/owner-inbox"};