import {
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKEDIN_ICON,
  LOGO_GREEN_EXCLUDED,
  TWITTER_ICON,
} from "../../../assets";
import { ensureExternalUrl } from "../../../api/features/content/websiteContent.utils.js";

const DEFAULT_POSTS = [
  {
    image: "/assets/images/jeep_5_1.jpg",
    alt: "Rally support vehicle",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
  {
    image: "/assets/images/heroimg.png",
    alt: "Cholistan desert dunes",
    title: "TDCP Jeep Rally",
    description: "see you in january, lahore....",
    tags: ["#tdcp", "#2026", "#rally"],
    socialLink: "https://www.instagram.com/tdcp_official/",
  },
  {
    image: "/assets/images/jeep_5_2.jpg",
    alt: "Rally vehicle in action",
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

function normalizePost(item) {
  return {
    image: item?.image || "/assets/images/heroimg.png",
    alt: item?.title || "Social media post",
    title: item?.title || "TDCP Jeep Rally",
    description: item?.description || "see you in january, lahore....",
    tags: item?.tags ?? [],
    socialLink: ensureExternalUrl(item?.socialLink),
  };
}

function getPostCaption(post) {
  return [post.description, ...(post.tags ?? [])].filter(Boolean).join(" ");
}

const InstagramBadge = () => (
  <div className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-white shadow-[0_10px_22px_rgba(0,0,0,0.12)]">
    <INSTAGRAM_ICON className="text-[24px] text-[#E1306C]" />
  </div>
);

const SocialPostCard = ({ post, featured = false }) => (
  <article className="rounded-[16px] border border-black/6 bg-white p-2 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
    <div className="relative overflow-hidden rounded-[12px]">
      <img
        src={post.image}
        alt={post.alt}
        className={`w-full object-cover ${
          featured
            ? "h-[240px] md:h-[320px] xl:h-[380px]"
            : "h-[170px] md:h-[180px]"
        }`}
      />
      <InstagramBadge />
    </div>

    <div className="px-2 pb-2 pt-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E7EBF0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
          <img
            src={LOGO_GREEN_EXCLUDED}
            alt="TDCP logo"
            className="h-6 w-6 rounded-full object-contain"
          />
        </div>

        <div>
          <h3 className="text-[15px] font-medium text-[#2B2B2B]">
            {post.title}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-[14px] leading-[1.45] text-[#7A7A7A]">
        {getPostCaption(post)}
      </p>
    </div>
  </article>
);

const SocialMediaSection = ({ content }) => {
  // console.log("Social Media Section Content", content);
  const normalizedPosts =
    content?.items?.map(normalizePost).filter((item) => item.image) ?? [];
  const posts = normalizedPosts.length > 0 ? normalizedPosts : DEFAULT_POSTS;
  const leftPosts = [posts[0], posts[1] ?? posts[0]].filter(Boolean);
  const featuredPost = posts[1] ?? posts[0];
  const rightPost = posts[2] ?? posts[1] ?? posts[0];
  const socialLinks = content?.socialLinks?.length
    ? content.socialLinks
    : DEFAULT_SOCIAL_LINKS;

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="font-gilda text-[30px] leading-tight text-black md:text-[52px]">
            {content?.title || "Social Media"}
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.22fr_0.94fr] xl:gap-8">
          <div className="space-y-6">
            {leftPosts.map((post) => (
              <SocialPostCard key={`${post.image}-${post.title}`} post={post} />
            ))}
          </div>

          <div>
            {featuredPost ? (
              <SocialPostCard post={featuredPost} featured={true} />
            ) : null}
          </div>

          <div className="space-y-6">
            {rightPost ? <SocialPostCard post={rightPost} /> : null}

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
