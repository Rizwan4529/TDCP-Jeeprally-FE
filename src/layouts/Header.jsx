import { useEffect, useState } from "react";
import { LOGO_GREEN_EXCLUDED } from "../assets";
import { FiX, FiAlignRight } from "react-icons/fi";
import { Link, useLocation } from "react-router";
import Button from "../components/common/Button";
import AuthModal from "../components/auth/AuthModal";

import { socialIcons, links, contactInfo } from "./data/data";

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const path = location.pathname;

  const isActive = (link) => {
    return link.path === path;
  };

  // Ensure mobile menu closes on desktop resize
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

  return (
    <div className="fixed w-full top-0 z-50 transition-colors duration-300 bg-white border-b border-gray-100">
      <div className="flex flex-col">
        {/* Top Strip */}
        <div className="bg-black text-white py-2 overflow-hidden">
          <div className="container flex items-center justify-end gap-4 md:gap-6 text-[10px] md:text-[12px] font-sans px-4">
            <div className="hidden lg:flex gap-4 items-center">
              {socialIcons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-green transition-all duration-300"
                >
                  <icon.icon className="size-4" />
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="hover:text-brand-green cursor-pointer truncate max-w-[120px] md:max-w-none">
                {contactInfo.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hover:text-brand-green cursor-pointer whitespace-nowrap">
                {contactInfo.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={LOGO_GREEN_EXCLUDED}
              alt="logo"
              className="h-12 md:h-15 transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-grow">
            <ul className="flex gap-8 xl:gap-12">
              {links.map((link) => (
                <li
                  key={link.title}
                  className={`text-[15px] font-semibold transition-all duration-300 hover:text-brand-green ${isActive(link) ? "text-brand-green" : "text-[#333]"
                    }`}
                >
                  <Link to={link.path}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Helpline Button */}
          <div className="hidden lg:flex flex-shrink-0">
            <a href="tel:1421">
              <Button variant="solid-green" className="!px-6 !py-1 !rounded-md text-[16px] ">
                Helpline:1421
              </Button>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-3xl text-black"
            onClick={() => setMobileOpen(true)}
          >
            <FiAlignRight />
          </button>
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
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={LOGO_GREEN_EXCLUDED} alt="logo" className="h-10" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-2xl text-black"
          >
            <FiX />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <ul className="flex flex-col p-4">
          {links.map((link) => (
            <li key={link.title} className="border-b border-gray-50">
              <Link
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block py-4 text-[16px] font-semibold ${isActive(link) ? "text-brand-green" : "text-[#333]"
                  } hover:text-brand-green transition-colors duration-200`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Contact Info & Socials in Mobile */}
        <div className="p-4 mt-auto">
          <div className="flex flex-col gap-2 mb-6 text-[14px]">
            <span className="text-gray-600">{contactInfo.email}</span>
            <span className="text-gray-600">{contactInfo.phone}</span>
          </div>

          <div className="flex gap-4">
            {socialIcons.map((icon, index) => (
              <a
                key={index}
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-brand-green transition-all duration-300"
              >
                <icon.icon className="size-5" />
              </a>
            ))}
          </div>

          <div className="mt-8">
            <a href="tel:1421">
              <Button variant="solid-green" className="w-full !px-4 !py-3 !rounded-md font-bold">
                Helpline:1421
              </Button>
            </a>
          </div>
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
