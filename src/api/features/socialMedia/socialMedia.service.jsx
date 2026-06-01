import api from "../../axios.jsx";
import endpoints from "../../endpoints";

export async function fetchSocialMediaFeed() {
  const { data } = await api.get(endpoints.socialMedia.feed);
  if (!data?.success) {
    throw new Error(data?.message || "Failed to load social media feed");
  }
  return data.data ?? { posts: [] };
}
