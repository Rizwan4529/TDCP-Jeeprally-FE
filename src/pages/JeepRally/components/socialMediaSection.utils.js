import { ensureExternalUrl } from "../../../api/features/content/websiteContent.utils.js";

/** Four unique slots: left ×2, center featured, right ×1 */
export const SOCIAL_FEED_DISPLAY_COUNT = 4;
export const DEFAULT_SOCIAL_POST_TITLE = "TDCP Jeep Rally";

export function isDisplayableSocialImageUrl(url) {
  if (url == null || String(url).trim() === "") return false;
  return !/\.mp4(\?|$)/i.test(String(url));
}

export function mapSocialFeedPostToCard(post, title = DEFAULT_SOCIAL_POST_TITLE) {
  const image = post?.mediaUrl || post?.thumbnailUrl || "";
  const caption = post?.caption?.trim() || "";

  return {
    id: post?._id || post?.socialPostId || image,
    image: isDisplayableSocialImageUrl(image) ? String(image).trim() : "",
    alt: caption || "Instagram post",
    title,
    description: caption,
    tags: [],
    socialLink: ensureExternalUrl(post?.permalink),
  };
}

export function dedupeSocialFeedCards(cards = []) {
  const seen = new Set();
  return (cards ?? []).filter((card) => {
    const key = card?.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function mapSocialFeedPostsToCards(
  posts = [],
  { title = DEFAULT_SOCIAL_POST_TITLE, limit = SOCIAL_FEED_DISPLAY_COUNT } = {},
) {
  const cards = (posts ?? [])
    .map((post) => mapSocialFeedPostToCard(post, title))
    .filter((card) => card.image);

  return dedupeSocialFeedCards(cards).slice(0, limit);
}

export function getSocialMediaLayoutPosts(cards = []) {
  const unique = dedupeSocialFeedCards(cards);

  if (unique.length === 0) {
    return { leftPosts: [], featuredPost: null, rightPost: null };
  }

  const [first, second, third, fourth] = unique;

  if (unique.length === 1) {
    return { leftPosts: [], featuredPost: first, rightPost: null };
  }

  if (unique.length === 2) {
    return {
      leftPosts: [first],
      featuredPost: second,
      rightPost: null,
    };
  }

  if (unique.length === 3) {
    return {
      leftPosts: [first],
      featuredPost: second,
      rightPost: third,
    };
  }

  return {
    leftPosts: [first, second].filter(Boolean),
    featuredPost: third,
    rightPost: fourth,
  };
}
