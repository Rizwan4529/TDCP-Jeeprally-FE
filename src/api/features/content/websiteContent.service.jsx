import rallyAxios from "../../rallyAxios.jsx";

export async function fetchWebsiteContent() {
  const { data } = await rallyAxios.get("/content/all");
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load website content");
  }

  return data?.data?.[0]?.content ?? { theme: {}, pages: [] };
}
