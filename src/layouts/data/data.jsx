import {
  CHEVRON_ARROW_DOWN,
  FACEBOOK_ICON,
  INSTAGRAM_ICON,
  LINKEDIN_ICON,
  TIKTOK_ICON,
  YOUTUBE_ICON,
} from "../../assets"

const socialIcons = [
  { icon: FACEBOOK_ICON, link: "https://www.facebook.com/TDCPOfficial/" },
  { icon: INSTAGRAM_ICON, link: "https://www.instagram.com/tdcp_official/" },
  { icon: TWITTER_ICON, link: "https://x.com/TDCPOFFICIAL" },
  { icon: LINKEDIN_ICON, link: "https://www.linkedin.com/company/tourism-development-corporation-of-punjab-pakistan-tdcp" },
  { icon: YOUTUBE_ICON, link: "https://www.youtube.com/@TDCPOfficial" },
  { icon: TIKTOK_ICON, link: "https://www.tiktok.com/@tdcp.official?_r=1&_t=ZS-91YQQpXb4b7" },
]

const links = [
  { title: "Home", path: "/" },
  { title: "About", path: "/about" },
  { title: "Routes", path: "/routes" },
  { title: "Rules", path: "/rules" },
  { title: "Competitor", path: "/competitor" },
  { title: "Ranking", path: "/ranking" },
]

const secondaryLinks = [
  {
    title: "Destinations",
    path: "#",
    icon: CHEVRON_ARROW_DOWN,
    // children: [
    //   { title: "Historical & Archaeological", path: "/attractions/historical-and-archaeological" },
    //   { title: "Religious & Spiritual", path: "/attractions/religious-and-spiritual" },
    //   { title: "Natural & Eco", path: "/attractions/nature-and-eco" },
    //   { title: "Adventure & Sports", path: "/attractions/adventure-and-sports" },
    //   { title: "Culture & Artistic", path: "/attractions/cultural-and-artistic" },
    //   { title: "Culinary Tourism", path: "/attractions/culinary-tourism" },
    // ],
    children: [
      {
        col: "Top Region",
        items: [
          { title: "Patriata", path: "#" },
          { title: "Kallar Kahar", path: "#" },
          { title: "Bahawalpur", path: "#" },
          { title: "Lahore", path: "#" },
          { title: "Fort Munro", path: "#" },
          { title: "Taxila", path: "#" },
        ],
      },
      {
        col: "By Interests",
        items: [
          {
            title: "Historical & Archaeological",
            path: "/attractions/historical-and-archaeological",
          },
          {
            title: "Religious & Spiritual",
            path: "/attractions/religious-and-spiritual",
          },
          { title: "Natural & Eco", path: "/attractions/nature-and-eco" },
          {
            title: "Adventure & Sports",
            path: "/attractions/adventure-and-sports",
          },
          {
            title: "Culture & Artistic",
            path: "/attractions/cultural-and-artistic",
          },
          { title: "Culinary Tourism", path: "/attractions/culinary-tourism" },
        ],
      },
    ],
  },
  {
    title: "Things To Do",
    path: "#",
    icon: CHEVRON_ARROW_DOWN,
    children: [
      {
        title: "Chairlift & Cable Car",
        path: "http://chairlift.tdcp.gop.pk",
      },
      { title: "Sightseeing", path: "http://sightseeing.tdcp.gop.pk" },
      { title: "Boating Facilities", path: "http://boating.tdcp.gop.pk" },
      { title: "Cholistan Desert Rally", path: "http://cdr.tdcp.gop.pk" },
      // { title: "SoftWheel Train", path: "#" },
    ],
  },
  {
    title: "Plan A Trip",
    path: "#",
    icon: CHEVRON_ARROW_DOWN,
    children: [
      { title: "Resort Booking", path: "http://resorts.tdcp.gop.pk" },
      // { title: "Transport Services", path: "#" },
      {
        title: "Tour Guides & Packages",
        path: "/tours",
      },
      // {
      //   title: "Tourist Facilitation Center",
      //   path: "#",
      // },
      // { title: "Souvenirs & Shops", path: "#" },
    ],
  },
  {
    title: "Events & Festivals",
    path: "/events",
    children: [],
  },
]

export { socialIcons, links, secondaryLinks }
