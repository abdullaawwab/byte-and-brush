export default async (req) => {
  const headers={"Content-Type":"application/json","Cache-Control":"no-store","Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"};
  if(req.method==="OPTIONS") return new Response("",{status:204,headers});
  if(req.method!=="POST") return Response.json({error:"Method not allowed"},{status:405,headers});
  const key=process.env.OPENAI_API_KEY;
  if(!key) return Response.json({error:"AI is not configured on this site."},{status:503,headers});
  try{
    const body=await req.json();
    const messages=Array.isArray(body.messages)?body.messages:[];
    const business=body.business||{};
    const safe=messages.filter(m=>m&&(m.role==="user"||m.role==="assistant")&&typeof m.content==="string")
      .slice(-14).map(m=>({role:m.role,content:m.content.slice(0,4000)}));
    const instructions=`You are the official AI assistant for Byte & Brush Studio.
Be friendly, useful and concise.
When answering about Byte & Brush, use ONLY the supplied current business data. Never invent prices, delivery times, services, discounts, contact details, guarantees, or policies.
If asked for a custom quote, explain that the owner confirms the final quote.
Help visitors choose Website, Poster, or Game services and explain what information belongs in the enquiry form.
You may answer ordinary safe general questions too.
Never claim that you personally sent an enquiry, changed a price, or contacted the owner.
If a visitor asks to start a project, direct them to the enquiry form on the website.
CURRENT BUSINESS DATA:
${JSON.stringify(business)}`;
    const r=await fetch("https://api.openai.com/v1/responses",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization:`Bearer ${key}`},
      body:JSON.stringify({
        model:process.env.OPENAI_MODEL||"gpt-5-mini",
        instructions,
        input:safe,
        max_output_tokens:500
      })
    });
    const d=await r.json();
    if(!r.ok){console.error(d);return Response.json({error:"The AI provider returned an error."},{status:502,headers})}
    const reply=d.output_text||d.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("").trim();
    if(!reply) return Response.json({error:"The AI returned an empty answer."},{status:502,headers});
    return Response.json({reply},{headers});
  }catch(e){console.error(e);return Response.json({error:"Unable to process the AI request."},{status:500,headers})}
};
export const config={path:"/.netlify/functions/chat"};