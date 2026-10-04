import { getStore } from "@netlify/blobs";

export const DEFAULT_DATA = {
  prices: { web: 1499, poster: 299, game: 999 },
  days: { web: "7–10 days", poster: "2–3 days", game: "5–7 days" },
  extras: {
    web: [["Online booking / order form", 800], ["Photo gallery", 400], ["Own domain setup", 500]],
    poster: [["Extra size (banner/flyer)", 150], ["Animated version for Instagram", 300], ["Express (24 hours)", 200]],
    game: [["Leaderboard", 500], ["Custom characters", 600], ["Sound and music", 300]]
  }
};

const store = () => getStore({ name: "byte-and-brush-data", consistency: "strong" });

export async function getSettings() {
  const value = await store().get("settings", { type: "json" });
  return value || DEFAULT_DATA;
}
export async function saveSettings(data) {
  await store().setJSON("settings", data);
  return data;
}
export async function saveEnquiry(item) {
  await store().setJSON(`enquiries/${item.id}`, item);
}
export async function listEnquiries() {
  const result = [];
  const { blobs } = await store().list({ prefix: "enquiries/" });
  for (const b of blobs) {
    const item = await store().get(b.key, { type: "json" });
    if (item) result.push(item);
  }
  result.sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  return result;
}
export async function updateEnquiry(id, patch) {
  const key = `enquiries/${id}`;
  const item = await store().get(key, { type: "json" });
  if (!item) return null;
  const updated = {...item, ...patch, updatedAt:new Date().toISOString()};
  await store().setJSON(key, updated);
  return updated;
}
export async function deleteEnquiry(id) {
  await store().delete(`enquiries/${id}`);
}
