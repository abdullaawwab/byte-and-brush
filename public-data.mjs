import { getSettings } from "../lib/data.mjs";
export default async () => {
  const d=await getSettings();
  return Response.json(d,{headers:{"Cache-Control":"no-store"}});
};
export const config={path:"/.netlify/functions/public-data"};