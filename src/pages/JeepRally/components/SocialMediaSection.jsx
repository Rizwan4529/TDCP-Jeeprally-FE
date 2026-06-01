import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKEDIN_ICON,
  LOGO_GREEN_EXCLUDED,
  TWITTER_ICON,
} from "../../../assets";
import { fetchSocialMediaFeed } from "../../../api/features/socialMedia/socialMedia.service.jsx";
import { ensureExternalUrl } from "../../../api/features/content/websiteContent.utils.js";
import { handleImageError, resolveImageUrl } from "../../../utils/constants.js";
import {
  DEFAULT_SOCIAL_POST_TITLE,
  getSocialMediaLayoutPosts,
  mapSocialFeedPostsToCards,
} from "./socialMediaSection.utils.js";

const DEFAULT_POSTS = [
  {
    id: "fallback-1",
    image: "/assets/images/jeep_5_1.jpg",
    alt: "Rally support vehicle",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
  {
    id: "fallback-2",
    image: "/assets/images/heroimg.png",
    alt: "Cholistan desert dunes",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
  {
    id: "fallback-3",
    image: "/assets/images/jeep_5_2.jpg",
    alt: "Rally vehicle in action",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
  {
    id: "fallback-4",
    image: "/assets/images/jeep_5_3.jpg",
    alt: "Jeep rally scene",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
];

const DEFAULT_SOCIAL_LINKS = [
  { name: "Facebook", link: "https://www.facebook.com/TDCPOfficial/" },
  { name: "Instagram", link: "https://www.instagram.com/tdcp_official/" },
  { name: "Twitter", link: "https://x.com/tourismpunjab" },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/tourism-development-corporation-of-punjab-pakistan-tdcp",
  },
];

const SOCIAL_ICON_COMPONENTS = {
  facebook: FACEBOOK_ICON,
  instagram: INSTAGRAM_ICON,
  twitter: TWITTER_ICON,
  x: TWITTER_ICON,
  linkedin: LINKEDIN_ICON,
};

function normalizeCmsPost(item) {
  return {
    id: item?.id || item?.image,
    image: resolveImageUrl(item?.image, "/assets/images/heroimg.png"),
    alt: item?.title || "Social media post",
    title: item?.title || DEFAULT_SOCIAL_POST_TITLE,
    description: item?.description || "",
    tags: item?.tags ?? [],
    socialLink: ensureExternalUrl(item?.socialLink),
  };
}

function getPostCaption(post) {
  const parts = [post.description, ...(post.tags ?? [])].filter(Boolean);
  return parts.join(" ") || post.description || "";
}

const InstagramBadge = () => (
  <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-white shadow-[0_10px_22px_rgba(0,0,0,0.12)]">
    <INSTAGRAM_ICON className="text-[24px] text-[#E1306C]" />
  </div>
);

const SocialPostCard = ({ post, featured = false }) => {
  const caption = getPostCaption(post);
  const cardClassName =
    "block rounded-[16px] border border-black/6 bg-white p-2 text-inherit no-underline shadow-[0_10px_26px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-0.5";

  const inner = (
    <>
      <div className="relative overflow-hidden rounded-[12px]">
        {/* Full image (no crop) — kept for reference
        <div
          className={`relative flex items-center justify-center overflow-hidden rounded-[12px] bg-[#f3f4f6] ${
            featured
              ? "h-[240px] md:h-[320px] xl:h-[380px]"
              : "h-[170px] md:h-[180px]"
          }`}
        >
          <img
            src={post.image}
            alt={post.alt}
            className="max-h-full max-w-full object-contain"
            onError={handleImageError}
          />
        </div>
        */}
        <img
          src={post.image}
          alt={post.alt}
          className={`w-full object-cover ${
            featured
              ? "h-[240px] md:h-[320px] xl:h-[380px]"
              : "h-[170px] md:h-[180px]"
          }`}
          onError={handleImageError}
        />
        <InstagramBadge />
      </div>

      <div className="px-2 pb-2 pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E7EBF0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
            <img
              src={LOGO_GREEN_EXCLUDED}
              alt="TDCP logo"
              className="h-full w-full rounded-full object-contain"
            />
          </div>

          <div>
            <h3 className="text-[18px] font-gilda font-semibold text-[#2B2B2B]">
              {post.title}
            </h3>
          </div>
        </div>

        {caption ? (
          <p className="mt-3 line-clamp-4 text-[14px] leading-[1.45] text-[#7A7A7A]">
            {caption}
          </p>
        ) : null}
      </div>
    </>
  );

  if (post.socialLink) {
    return (
      <a
        href={post.socialLink}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
        aria-label={`View Instagram post: ${post.alt}`}
      >
        {inner}
      </a>
    );
  }

  return <article className={cardClassName}>{inner}</article>;
};

function SocialPostCardSkeleton({ featured = false }) {
  return (
    <div
      className="rounded-[16px] border border-black/6 bg-white p-2 shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
      aria-hidden="true"
    >
      <div
        className={`animate-pulse rounded-[12px] bg-gray-200 ${
          featured
            ? "h-[240px] md:h-[320px] xl:h-[380px]"
            : "h-[170px] md:h-[180px]"
        }`}
      />
      <div className="space-y-3 px-2 pb-2 pt-4">
        <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}

const SocialMediaSection = ({ content }) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["social-media", "feed"],
    queryFn: fetchSocialMediaFeed,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const postTitle = content?.postTitle || DEFAULT_SOCIAL_POST_TITLE;

  const apiPosts = useMemo(
    () => mapSocialFeedPostsToCards(data?.posts, { title: postTitle }),
    [data?.posts, postTitle],
  );

  const cmsPosts = useMemo(
    () =>
      (content?.items ?? []).map(normalizeCmsPost).filter((item) => item.image),
    [content?.items],
  );

  const posts = useMemo(() => {
    if (apiPosts.length > 0) return apiPosts;
    if (cmsPosts.length > 0) return cmsPosts;
    return DEFAULT_POSTS;
  }, [apiPosts, cmsPosts]);

  const { leftPosts, featuredPost, rightPost } = useMemo(
    () => getSocialMediaLayoutPosts(posts),
    [posts],
  );

  const socialLinks = content?.socialLinks?.length
    ? content.socialLinks
    : DEFAULT_SOCIAL_LINKS;

  const showSkeleton = isPending && apiPosts.length === 0;

  return (
    <section className="bg-white py-section-break">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="font-gilda text-[30px] leading-tight text-black md:text-[52px]">
            {content?.title || "Social Media"}
          </h2>
        </div>

        {isError && apiPosts.length === 0 ? (
          <p className="mb-6 text-center text-sm text-red-600">
            Instagram feed could not be loaded. Showing available content.
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.22fr_0.94fr] xl:gap-8">
          <div className="space-y-6">
            {showSkeleton ? (
              <>
                <SocialPostCardSkeleton />
                <SocialPostCardSkeleton />
              </>
            ) : (
              leftPosts.map((post) => (
                <SocialPostCard key={post.id} post={post} />
              ))
            )}
          </div>

          <div>
            {showSkeleton ? (
              <SocialPostCardSkeleton featured />
            ) : featuredPost ? (
              <SocialPostCard post={featuredPost} featured />
            ) : null}
          </div>

          <div className="space-y-6">
            {showSkeleton ? (
              <SocialPostCardSkeleton />
            ) : rightPost ? (
              <SocialPostCard post={rightPost} />
            ) : null}

            <div className="px-2 pt-2 md:px-3 md:pt-5">
              <h3 className="font-gilda text-[34px] leading-none text-black md:text-[56px]">
                Follow Us
              </h3>
              <p className="mt-3 text-[18px] text-[#7A7A7A]">
                Get exclusive information
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon =
                    SOCIAL_ICON_COMPONENTS[social?.name?.toLowerCase?.()] ||
                    INSTAGRAM_ICON;

                  return (
                    <a
                      key={`${social.link}-${index}`}
                      href={ensureExternalUrl(social.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-[28px] text-black shadow-[0_10px_18px_rgba(249,218,74,0.28)] transition-transform duration-200 hover:scale-105"
                      aria-label={
                        social?.name || `Open social link ${index + 1}`
                      }
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
