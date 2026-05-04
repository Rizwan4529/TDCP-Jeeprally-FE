import SectionContainer from "../components/common/SectionContainer";
import { LOGO_WHITE } from "../assets";
import Button from "../components/common/Button";
import { Link } from "react-router";

import { socialIcons } from "./data/data";
import { BiBell } from "react-icons/bi";
import SmartLink from "../components/common/SmartLink";

const Footer = () => {
  const thingsToDo = [
    {
      title: "Chairlift & Cable Car",
      path: "http://chairlift.tdcp.gop.pk",
    },
    { title: "SightSeeing", path: "http://sightseeing.tdcp.gop.pk" },
    { title: "Boating Facilities", path: "http://boating.tdcp.gop.pk" },
    { title: "SoftWheel Train", path: "http://softwheel.tdcp.gop.pk" },
    { title: "Cholistan Desert Rally", path: "https://cdr.tdcp.gop.pk" },
    { title: "Thal Desert Rally", path: "https://thalrally.tdcp.gop.pk" },
  ];

  const quickLinks = [
    { title: "Home", path: "/" },
    { title: "Profile", path: "/profile" },
    { title: "Leadership", path: "/leadership" },
    { title: "Contact Us", path: "/contact" },
  ];

  const contactInfo = [
    { label: "Phone", value: "+92 (42) 111 111 042" },
    {
      label: "Address",
      value: "68-Trade Center Block, Near Ayub Chowk, Johar Town, Lahore",
    },
    { label: "Email", value: "info@tdcp.gop.pk" },
  ];

  return (
    <div className="bg-[#2B2B2B]">
      <SectionContainer className="text-white !pb-0">
        <div className="flex flex-col md:flex-row gap-lg md:gap-xl">
          <div className="w-full md:w-[30%] md:max-w[30%] spacing-y-md flex items-center md:items-start flex-col">
            <div className="">
              <Link to="/" className="cursor-default flex items-center flex-col spacing-y-sm">
                <img
                  src={LOGO_WHITE}
                  alt="Footer Logo"
                  className="size-32 object-contain aspect-square"
                />
                <div className="para">
                  Tourism Development <br /> Corporation of Punjab
                </div>
              </Link>
            </div>
            {/* <p className="para">
              Punjab, the land of five rivers had huge potential in tourism.
            </p> */}

            <div className="flex gap-sm">
              <div className="hidden lg:flex gap-md">
                {socialIcons.map((social, index) => (
                  <a
                    href={social.link}
                    target="_blank"
                    key={social.link + index}
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
            <h2 className="sub-heading font-gilda">Subscribe to Newsletter</h2>

            <div>
              <div className="grid grid-cols-[1fr_auto] items-center">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1 bg-transparent border-none py-4 md:py-6 focus:outline-none focus:border-none transition-colors duration-300"
                />

                <div>
                  <Button variant="solid-green">
                    {/* Show icon on small screens, text on md+ */}
                    <span className="block md:hidden">
                      <BiBell className="h-5 w-5" />
                    </span>
                    <span className="hidden md:block">Subscribe</span>
                  </Button>
                </div>
              </div>
              <div className="h-[1px] bg-[#6B6A6A] w-full hidden md:block" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-md md:gap-0">
              <div className="spacing-y-sm">
                <h4 className="heading-20 font-gilda">Quick Links</h4>
                <ul className="para text-muted">
                  {quickLinks.map((link, index) => (
                    <li key={link.title + index}>
                      <SmartLink
                        to={link.path}
                        className="transition-all duration-300 hover:text-accent"
                      >
                        {link.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="spacing-y-sm">
                <h4 className="heading-20 font-gilda ">Things to do</h4>
                <ul className="para text-muted">
                  {thingsToDo.map((item, index) => (
                    <li key={item.title + index}>
                      <SmartLink
                        to={item.path}
                        className="transition-all duration-300 hover:text-accent"
                      >
                        {item.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="spacing-y-sm col-span-full md:col-span-1">
                <h4 className="heading-20 font-gilda">Contact</h4>
                <ul className="para text-muted">
                  {contactInfo.map((contact, index) => (
                    <li key={contact.value + index}>
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
          <div>Copyright © 2025 TDCP. All Rights Reserved.</div>
          <div className="space-x-2">
            <span>Designed by</span>
            <SmartLink
              to="https://stashtechnologies.com"
              className=" transition-all duration-300 hover:text-accent"
            >
              Stash Technologies
            </SmartLink>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Footer;
