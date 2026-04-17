import { useEffect, useState } from "react";
import { LOGO_WHITE, LOGO_GREEN_EXCLUDED, CHEVRON_ARROW_DOWN, EMAIL_ICON, PHONE_ICON } from "../assets";
import { FiX, FiAlignRight, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import AuthModal from "../components/auth/AuthModal";
import { useAuth } from "../context/AuthContext";

import { socialIcons, links, secondaryLinks } from "./data/data";
import SmartLink from "../components/common/SmartLink";
import {
  useAvailableSitesLinksQuery,
  useContentNamesListQuery,
} from "../api/features/content/hooks";
import { useResortsQuery } from "../api/features/events/hooks";

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: namesList } = useContentNamesListQuery();
  const { data: resortsData } = useResortsQuery();
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const dynamicSecondaryLinks = [
    {
      title: "Top Regions",
      path: "#",
      icon: CHEVRON_ARROW_DOWN,
      children:
        // [
        //   ...(namesList?.["attractions-by-destination"]?.map((name) => ({
        //     title: name
        //       .replace(/-/g, " ")
        //       .replace(/\b\w/g, (l) => l.toUpperCase()),
        //     path: `/districts/${name}`,
        //   })) || []),
        //   {
        //     title: "Explore All",
        //     path: "/top-destinations",
        //   },
        // ],
        [
          {
            col: "By Districts",
            items: [
              ...(namesList?.["attractions-by-destination"]?.slice(0, 5)?.map((name) => ({
                title: name
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                path: `/districts/${name}`,
              })) || []),
              {
                title: "Explore All",
                path: "/explore-districts",
              },
            ],
          },
          {
            col: "By Interests",
            items: [
              ...(namesList?.["attractions-by-category"]?.slice(0, 5)?.map((name) => ({
                title: name
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                path: `/attractions/${name}`,
              })) || []),
              {
                title: "Explore All",
                path: "/top-destinations",
              }
            ],
          },
        ],
    },
    {
      title: "Book Online",
      path: "#",
      icon: CHEVRON_ARROW_DOWN,
      children: [
        {
          title: "Chairlift & Cable Car",
          path: "https://chairlift.tdcp.gop.pk",
        },
        { title: "Sightseeing", path: "https://sightseeing.tdcp.gop.pk" },
        { title: "Boating Facilities", path: "https://boating.tdcp.gop.pk" },
        { title: "SoftWheel Train", path: "https://softwheel.tdcp.gop.pk" },
        { title: "Fleet Transportation", path: "/fleet" },
      ],
    },
    {
      title: "Plan A Trip",
      path: "/tours",
    },
    {
      title: "TDCP Resorts",
      path: "#",
      icon: CHEVRON_ARROW_DOWN,
      children: [
        ...(resortsData
          ?.filter((item) => {
            const keywords = ["Patriata", "Charehan", "Kallar Kahar", "Khabeki", "Dharabi"];
            return keywords.some((keyword) =>
              item.name.toLowerCase().includes(keyword.toLowerCase())
            );
          })
          ?.map((item) => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const checkInDate = today.toISOString().split("T")[0];
            const checkOutDate = tomorrow.toISOString().split("T")[0];

            return {
              title: item.name,
              path: `https://resorts.tdcp.gop.pk/hoteldetail?AccommodationId=${item.id}&checkIn=${checkInDate}&checkOut=${checkOutDate}`,
              external: true,
            };
          }) || []),
        {
          title: "Explore All",
          path: "https://resorts.tdcp.gop.pk",
          external: true,
        },
      ],
    },
    {
      title: "News & Events",
      path: "#",
      icon: CHEVRON_ARROW_DOWN,
      children: [
        { title: "Cholistan Desert Rally", path: "https://cdr.tdcp.gop.pk" },
        { title: "Thal Desert Rally", path: "https://thalrally.tdcp.gop.pk" },
        { title: "Explore All News & Events", path: "/events" },
      ],
    },
  ];

  const path = location.pathname;
  const pathsToExclude = ["/contact", "/leadership"];
  const isExcluded = pathsToExclude.includes(path);

  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleExpand = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const isActive = (link) => {
    return link.path === path;
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure mobile menu closes on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false); // switched to lg
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

  return (
    <div
      className={`fixed w-full top-0 z-50 transition-colors duration-300 bg-white`}
    >
      <div>
        {/* Top Strip */}
        <div className="bg-black text-white px-2 lg:px-20 py-1">
          <div className="container flex items-center justify-between min-h-[40px]">
            {/* Social Icons (Left) */}
            <div className="flex gap-4 items-center">
              {socialIcons.slice(0, 4).map((icon, index) => (
                <a
                  key={index}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-full ring-1 ring-white/30 hover:ring-accent transition-all duration-300 size-6"
                >
                  <icon.icon className="text-white hover:text-accent transition-all duration-300 size-3" />
                </a>
              ))}
            </div>

            {/* Contact Info (Right) */}
            <div className="hidden md:flex items-center gap-8 text-xs lg:text-sm font-light">
              <a href="mailto:info@example.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <EMAIL_ICON className="size-4" />
                <span>info@example.com</span>
              </a>
              <a href="tel:00-000-0000" className="flex items-center gap-2 hover:text-accent transition-colors">
                <PHONE_ICON className="size-4" />
                <span>00-000-0000</span>
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Strip */}
        <div className="container">
          <div
            className={`flex items-center justify-between py-4 lg:px-20 mx-auto relative`}
          >
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="cursor-pointer">
                <img
                  src={LOGO_GREEN_EXCLUDED}
                  alt="logo"
                  className={`h-16 lg:h-20 transition-all duration-300`}
                />
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <ul className="flex gap-4 lg:gap-8 xl:gap-12">
                {links.map((link) => (
                  <li
                    key={link.path + link.title}
                    className="relative group cursor-pointer transition-all duration-300 whitespace-nowrap"
                  >
                    <Link
                      to={link.path}
                      className={`text-slate-700 hover:text-accent font-medium text-lg transition-colors ${isActive(link) ? "text-accent" : ""
                        }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helpline Button */}
            <div className="hidden lg:flex">
              <a href="tel:1421">
                <Button variant="solid-accent" className="!px-8 !py-3 text-lg font-semibold shadow-md">
                  Helpline: 1421
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-2xl text-black"
              onClick={() => setMobileOpen(true)}
            >
              <FiAlignRight />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-primary z-50 transform transition-transform duration-300 overflow-y-auto ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 bg-primary sticky top-0">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl text-white"
          >
            <FiX />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <ul className="flex flex-col gap-2 px-6 pb-4">
          {links.map((link) => (
            <li key={link.title} className="text-white text-sm">
              <Link
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 ${isActive(link) ? "text-accent" : "text-white"
                  } hover:text-accent transition-colors duration-200 text-lg`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Helpline (Mobile) */}
        <div className="px-6 mt-4">
          <a href="tel:1421" onClick={() => setMobileOpen(false)}>
            <Button variant="solid-accent" className="w-full !px-4 !py-2">
              Helpline: 1421
            </Button>
          </a>
        </div>

        {/* Social Icons (Mobile) */}
        <div className="flex gap-4 px-6 mt-8 mb-10">
          {socialIcons.slice(0, 4).map((icon, index) => (
            <a
              key={index}
              href={icon.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="group p-1 rounded-full ring-1 ring-white/30 size-8 flex items-center justify-center hover:ring-accent transition-all"
            >
              <icon.icon className="text-white hover:text-accent transition-all size-4" />
            </a>
          ))}
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Header;

