import { useMemo } from "react";
import { Link } from "react-router";
import { BiBell } from "react-icons/bi";
import {
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKEDIN_ICON,
  LOGO_WHITE,
  TWITTER_ICON,
} from "../assets";
import Button from "../components/common/Button";
import SectionContainer from "../components/common/SectionContainer";
import SmartLink from "../components/common/SmartLink";
import { socialIcons as defaultSocialIcons } from "./data/data";
import { useWebsiteContentQuery } from "../api/features/content/hooks.jsx";
import {
  ensureExternalUrl,
  getWebsiteContentPage,
  getWebsiteContentSection,
  getWebsiteSectionItems,
} from "../api/features/content/websiteContent.utils.js";

const DEFAULT_THINGS_TO_DO = [
  { title: "Chairlift & Cable Car", path: "http://chairlift.tdcp.gop.pk" },
  { title: "SightSeeing", path: "http://sightseeing.tdcp.gop.pk" },
  { title: "Boating Facilities", path: "http://boating.tdcp.gop.pk" },
  { title: "SoftWheel Train", path: "http://softwheel.tdcp.gop.pk" },
  { title: "Cholistan Desert Rally", path: "https://cdr.tdcp.gop.pk" },
  { title: "Thal Desert Rally", path: "https://thalrally.tdcp.gop.pk" },
];
const DEFAULT_QUICK_LINKS = [
  { title: "Home", path: "/" },
  { title: "Profile", path: "/profile" },
  { title: "Leadership", path: "/leadership" },
  { title: "Contact Us", path: "/contact" },
];
const DEFAULT_CONTACT_INFO = [
  { label: "Phone", value: "+92 (42) 111 111 042" },
  {
    label: "Address",
    value: "68-Trade Center Block, Near Ayub Chowk, Johar Town, Lahore",
  },
  { label: "Email", value: "info@tdcp.gop.pk" },
];
const SOCIAL_ICON_COMPONENTS = {
  facebook: FACEBOOK_ICON,
  instagram: INSTAGRAM_ICON,
  twitter: TWITTER_ICON,
  x: TWITTER_ICON,
  linkedin: LINKEDIN_ICON,
};

const Footer = () => {
  const { data: websiteContent } = useWebsiteContentQuery();
  const siteFooterPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "siteFooter"),
    [websiteContent]
  );
  const siteHeaderPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "siteHeader"),
    [websiteContent]
  );
  const brandSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "brand"),
    [siteFooterPage]
  );
  const newsletterSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "newsletter"),
    [siteFooterPage]
  );
  const quickLinksSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "quickLinks"),
    [siteFooterPage]
  );
  const thingsToDoSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "thingsToDo"),
    [siteFooterPage]
  );
  const contactSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "contact"),
    [siteFooterPage]
  );
  const legalSection = useMemo(
    () => getWebsiteContentSection(siteFooterPage, "legal"),
    [siteFooterPage]
  );
  const topBarSection = useMemo(
    () => getWebsiteContentSection(siteHeaderPage, "topBar"),
    [siteHeaderPage]
  );
  const socialLinks = useMemo(() => {
    const links = getWebsiteSectionItems(topBarSection, "socialLinks")
      .map((social) => ({
        ...social,
        icon:
          SOCIAL_ICON_COMPONENTS[social?.name?.toLowerCase?.()] ||
          INSTAGRAM_ICON,
        link: ensureExternalUrl(social.link),
      }))
      .filter((social) => social.link);

    return links.length > 0 ? links : defaultSocialIcons;
  }, [topBarSection]);
  const quickLinks = getWebsiteSectionItems(quickLinksSection).length
    ? getWebsiteSectionItems(quickLinksSection)
    : DEFAULT_QUICK_LINKS;
  const thingsToDo = getWebsiteSectionItems(thingsToDoSection).length
    ? getWebsiteSectionItems(thingsToDoSection)
    : DEFAULT_THINGS_TO_DO;
  const contactInfo = getWebsiteSectionItems(contactSection).length
    ? getWebsiteSectionItems(contactSection)
    : DEFAULT_CONTACT_INFO;

  return (
    <div className="bg-[#2B2B2B]">
      <SectionContainer className="text-white !pb-0">
        <div className="flex flex-col md:flex-row gap-lg md:gap-xl">
          <div className="w-full md:w-[30%] md:max-w[30%] spacing-y-md flex items-center md:items-start flex-col">
            <div>
              <Link
                to="/"
                className="cursor-default flex items-center flex-col spacing-y-sm"
              >
                <img
                  src={LOGO_WHITE}
                  alt="Footer Logo"
                  className="size-32 object-contain aspect-square"
                />
                <div className="para text-center">
                  {brandSection?.title || "Tourism Development Corporation of Punjab"}
                </div>
              </Link>
            </div>

            <div className="flex gap-sm">
              <div className="hidden lg:flex gap-md">
                {socialLinks.map((social, index) => (
                  <a
                    href={social.link}
                    target="_blank"
                    key={`${social.link}-${index}`}
                    rel="noopener noreferrer"
                    className="group p-1 rounded-full ring-1 ring-white hover:ring-accent transition-all duration-300 flex items-center justify-center size-6"
                  >
                    <social.icon className="text-white group-hover:text-accent transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-[70%] md:max-w[70%] spacing-y-md">
            <h2 className="sub-heading font-gilda">
              {newsletterSection?.title || "Subscribe to Newsletter"}
            </h2>

            <div>
              <div className="grid grid-cols-[1fr_auto] items-center">
                <input
                  type="email"
                  placeholder={newsletterSection?.inputPlaceholder || "Your Email"}
                  className="flex-1 bg-transparent border-none py-4 md:py-6 focus:outline-none focus:border-none transition-colors duration-300"
                />

                <div>
                  <Button variant="solid-green">
                    <span className="block md:hidden">
                      <BiBell className="h-5 w-5" />
                    </span>
                    <span className="hidden md:block">
                      {newsletterSection?.buttonText || "Subscribe"}
                    </span>
                  </Button>
                </div>
              </div>
              <div className="h-[1px] bg-[#6B6A6A] w-full hidden md:block" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-md md:gap-0">
              <div className="spacing-y-sm">
                <h4 className="heading-20 font-gilda">
                  {quickLinksSection?.title || "Quick Links"}
                </h4>
                <ul className="para text-muted">
                  {quickLinks.map((link, index) => (
                    <li key={link.id ?? `${link.title}-${index}`}>
                      <SmartLink
                        to={link.external ? ensureExternalUrl(link.path) : link.path}
                        className="transition-all duration-300 hover:text-accent"
                      >
                        {link.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="spacing-y-sm">
                <h4 className="heading-20 font-gilda">
                  {thingsToDoSection?.title || "Things to do"}
                </h4>
                <ul className="para text-muted">
                  {thingsToDo.map((item, index) => (
                    <li key={item.id ?? `${item.title}-${index}`}>
                      <SmartLink
                        to={ensureExternalUrl(item.path)}
                        className="transition-all duration-300 hover:text-accent"
                      >
                        {item.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="spacing-y-sm col-span-full md:col-span-1">
                <h4 className="heading-20 font-gilda">
                  {contactSection?.title || "Contact"}
                </h4>
                <ul className="para text-muted">
                  {contactInfo.map((contact, index) => (
                    <li key={contact.id ?? `${contact.value}-${index}`}>
                      <span>{contact.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#6B6A6A] mt-8 h-[1px]" />
        <div className="para flex flex-col md:flex-row gap-lg md:gap-0 items-center justify-between py-8">
          <div>
            {legalSection?.copyrightText ||
              "Copyright © 2025 TDCP. All Rights Reserved."}
          </div>
          <div className="space-x-2">
            <span>{legalSection?.designedByLabel || "Designed by"}</span>
            <SmartLink
              to={legalSection?.designedByUrl || "https://stashtechnologies.com"}
              className="transition-all duration-300 hover:text-accent"
            >
              {legalSection?.designedByName || "Stash Technologies"}
            </SmartLink>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Footer;
