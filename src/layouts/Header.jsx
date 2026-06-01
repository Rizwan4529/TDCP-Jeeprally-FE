import { useEffect, useMemo, useState } from "react";
import {
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKEDIN_ICON,
  LOGO_WHITE,
  TWITTER_ICON,
} from "../assets";
import { FiAlignRight, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import RoutesNavDropdown from "../components/rally/RoutesNavDropdown";
import { redirectToDashboardLogin } from "../utils/constants";
import {
  isRoutesNavActive,
  isRoutesNavLink,
} from "../pages/Routes/rallyStages.utils";
import {
  contactInfo as defaultContactInfo,
  leftNavLinks as defaultLeftNavLinks,
  mobileNavLinks as defaultMobileNavLinks,
  rightNavLinks as defaultRightNavLinks,
  socialIcons as defaultSocialIcons,
  utilityLinks as defaultUtilityLinks,
} from "./data/data";
import { useWebsiteContentQuery } from "../api/features/content/hooks.jsx";
import {
  ensureExternalUrl,
  getWebsiteContentPage,
  getWebsiteContentSection,
  getWebsiteSectionItems,
} from "../api/features/content/websiteContent.utils.js";

const SOCIAL_ICON_COMPONENTS = {
  facebook: FACEBOOK_ICON,
  instagram: INSTAGRAM_ICON,
  twitter: TWITTER_ICON,
  x: TWITTER_ICON,
  linkedin: LINKEDIN_ICON,
};

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: websiteContent } = useWebsiteContentQuery();

  const path = location.pathname;
  const hash = location.hash;
  const siteHeaderPage = useMemo(
    () => getWebsiteContentPage(websiteContent, "siteHeader"),
    [websiteContent],
  );
  const topBarSection = useMemo(
    () => getWebsiteContentSection(siteHeaderPage, "topBar"),
    [siteHeaderPage],
  );
  const primaryNavSection = useMemo(
    () => getWebsiteContentSection(siteHeaderPage, "primaryNav"),
    [siteHeaderPage],
  );
  const utilityLinks = useMemo(() => {
    const links = getWebsiteSectionItems(topBarSection, "utilityLinks");
    return links.length > 0 ? links : defaultUtilityLinks;
  }, [topBarSection]);
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
  const leftNavLinks = useMemo(() => {
    const links = getWebsiteSectionItems(primaryNavSection, "leftLinks");
    return links.length > 0 ? links : defaultLeftNavLinks;
  }, [primaryNavSection]);
  const rightNavLinks = useMemo(() => {
    const links = getWebsiteSectionItems(primaryNavSection, "rightLinks");
    return links.length > 0 ? links : defaultRightNavLinks;
  }, [primaryNavSection]);
  const mobileNavLinks = useMemo(() => {
    const links = getWebsiteSectionItems(primaryNavSection, "mobileLinks");
    return links.length > 0 ? links : defaultMobileNavLinks;
  }, [primaryNavSection]);
  const contactInfo = topBarSection?.contact ?? defaultContactInfo;
  const ctaText = primaryNavSection?.ctaText || "Login";

  const isActive = (link) => {
    if (!link || link.external) return false;

    if (isRoutesNavLink(link)) {
      return isRoutesNavActive(path);
    }

    const [linkPath, linkHash = ""] = link.path.split("#");
    const normalizedPath = linkPath || "/";
    const normalizedHash = linkHash ? `#${linkHash}` : "";

    if (normalizedPath !== path) return false;
    if (normalizedHash) return normalizedHash === hash;
    if (normalizedPath === "/") return hash === "";
    return true;
  };

  const allMobileLinks = useMemo(() => {
    const seen = new Set();
    return mobileNavLinks.filter((link) => {
      const key = `${link.title}-${link.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [mobileNavLinks]);

  const renderLink = (link, className, onClick) => {
    if (link.external) {
      return (
        <a
          href={ensureExternalUrl(link.path)}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onClick}
        >
          {link.title}
        </a>
      );
    }

    return (
      <Link to={link.path} className={className} onClick={onClick}>
        {link.title}
      </Link>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [mobileOpen]);

  const navLinkClass = (link) =>
    `text-[15px] font-medium tracking-[0.01em] transition-colors duration-200 ${
      !isActive(link) ? "text-black" : "text-primary/85 hover:text-black"
    }`;

  const mobileNavLinkClass = (link) =>
    `block w-full py-4 text-left text-[16px] font-medium transition-colors duration-200 ${
      isActive(link)
        ? "text-primary"
        : "text-[#3B2A1F] hover:text-primary"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-primary text-white">
        <div className="mx-auto hidden h-11 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 text-[14px] lg:grid xl:px-10">
          <div className="flex items-center gap-3 whitespace-nowrap">
            {utilityLinks.map((link, index) => (
              <div
                key={link.id ?? link.title}
                className="flex items-center gap-3"
              >
                {index > 0 && <span className="h-3 w-px bg-white/40" />}
                {renderLink(
                  link,
                  "transition-opacity duration-200 hover:opacity-80",
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            {socialLinks.map((social, index) => (
              <a
                key={`${social.link}-${index}`}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-200 hover:opacity-80 border border-white rounded-full p-2"
              >
                <social.icon className="size-3.5" />
              </a>
            ))}
          </div>

          <div className="flex items-center justify-end gap-6 whitespace-nowrap">
            <span className="tracking-[0.02em]">
              Helpline: {contactInfo.helpline}
            </span>
            <span>{contactInfo.phone}</span>
          </div>
        </div>

        <div className="flex h-7 items-center justify-between px-4 text-[10px] lg:hidden">
          <span className="tracking-[0.02em]">
            Helpline: {contactInfo.helpline}
          </span>
          <span>{contactInfo.phone}</span>
        </div>
      </div>

      <div className="relative overflow-visible bg-secondary shadow-[0_6px_20px_rgba(62,34,12,0.10)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden justify-center lg:flex">
          <div className="pointer-events-auto relative flex h-[78px] w-[92px] items-center justify-center rounded-b-[4px] border-primary/20 bg-secondary">
            <Link
              to="/"
              className="flex h-full w-full items-center justify-center"
            >
              <img
                src={LOGO_WHITE}
                alt="TDCP logo"
                className="size-[70px] shrink-0 object-contain"
              />
            </Link>
          </div>
        </div>

        <div className="mx-auto hidden h-[58px] max-w-[1440px] grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] items-center px-6 lg:grid xl:px-10">
          <nav className="justify-self-start overflow-visible">
            <ul className="flex items-center gap-8 overflow-visible xl:gap-10">
              {leftNavLinks.map((link) => (
                <li key={link.id ?? link.title} className="overflow-visible">
                  {isRoutesNavLink(link) ? (
                    <RoutesNavDropdown
                      title={link.title}
                      className={navLinkClass(link)}
                      align="left"
                    />
                  ) : (
                    renderLink(link, navLinkClass(link))
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div />

          <div className="flex items-center justify-self-end gap-8 overflow-visible xl:gap-10">
            <nav className="overflow-visible">
              <ul className="flex items-center gap-8 overflow-visible xl:gap-10">
                {rightNavLinks.map((link, index) => (
                  <li
                    key={link.id ?? `${link.title}-${index}`}
                    className="overflow-visible"
                  >
                    {isRoutesNavLink(link) ? (
                      <RoutesNavDropdown
                        title={link.title}
                        className={navLinkClass(link)}
                        align="right"
                      />
                    ) : (
                      renderLink(link, navLinkClass(link))
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              onClick={redirectToDashboardLogin}
              className="inline-flex h-9 items-center rounded-full bg-primary px-8 text-[14px] font-medium text-white shadow-[0_6px_14px_rgba(91,52,17,0.22)] transition-colors duration-200 hover:bg-primary-dark"
            >
              {ctaText}
            </button>
          </div>
        </div>

        <div className="relative flex h-14 items-center justify-between px-4 lg:hidden">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 text-primary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <FiAlignRight className="text-[22px]" />
          </button>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            <div className="pointer-events-auto relative flex h-[80px] w-[92px] items-center justify-center rounded-b-[10px] border-x border-b border-primary/20 bg-secondary shadow-[0_8px_16px_rgba(91,52,17,0.16)]">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex h-full w-full items-center justify-center"
              >
                <img
                  src={LOGO_WHITE}
                  alt="TDCP logo"
                  className="size-[60px] shrink-0 object-contain"
                />
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={redirectToDashboardLogin}
            className="inline-flex h-9 items-center rounded-full bg-primary px-5 text-[13px] font-medium text-white shadow-[0_6px_14px_rgba(91,52,17,0.22)] transition-colors duration-200 hover:bg-primary-dark"
          >
            {ctaText}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/45"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-[70] h-full w-[84vw] max-w-[360px] overflow-y-auto bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between bg-secondary px-4 py-4">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img
              src={LOGO_WHITE}
              alt="TDCP logo"
              className="h-11 w-11 object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 text-primary"
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <div className="border-b border-primary/10 bg-primary px-4 py-3 text-white">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
            {utilityLinks.map((link) => (
              <div key={link.id ?? link.title}>
                {renderLink(
                  link,
                  "transition-opacity duration-200 hover:opacity-80",
                  () => setMobileOpen(false),
                )}
              </div>
            ))}
          </div>
        </div>

        <ul className="flex flex-col px-4 py-3">
          {allMobileLinks.map((link) => (
            <li
              key={link.id ?? link.title}
              className="border-b border-primary/8 last:border-b-0"
            >
              {isRoutesNavLink(link) ? (
                <RoutesNavDropdown
                  title={link.title}
                  className={mobileNavLinkClass(link)}
                  variant="inline"
                />
              ) : (
                renderLink(
                  link,
                  mobileNavLinkClass(link),
                  () => setMobileOpen(false),
                )
              )}
            </li>
          ))}
        </ul>

        <div className="space-y-5 px-4 py-5">
          <div className="flex items-center justify-between rounded-2xl bg-[#FFF9E8] px-4 py-3 text-[12px] text-[#5C4938]">
            <span>Helpline: {contactInfo.helpline}</span>
            <span>{contactInfo.phone}</span>
          </div>

          <div className="flex items-center gap-4 text-primary">
            {socialLinks.map((social, index) => (
              <a
                key={`${social.link}-${index}`}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/15 transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                <social.icon className="size-4" />
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              redirectToDashboardLogin();
            }}
            className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-white shadow-[0_8px_18px_rgba(91,52,17,0.22)] transition-colors duration-200 hover:bg-primary-dark"
          >
            {ctaText}
          </button>
        </div>
      </div>

    </header>
  );
};

export default Header;
