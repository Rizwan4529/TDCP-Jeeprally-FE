import { useEffect } from "react";

const DEFAULT_TITLE = "TDCP - Tourism Development Corporation Punjab";
const DEFAULT_DESCRIPTION = "Tourism Development Corporation of Punjab (TDCP) is dedicated to promoting tourism in Punjab, Pakistan.";

const SEO = ({ title, description }) => {
  useEffect(() => {
    // Use provided values or fall back to defaults
    const pageTitle = title?.length > 0 ? `${title}` : DEFAULT_TITLE;
    const pageDescription = description?.length > 0 ? description : DEFAULT_DESCRIPTION;

    // Set title
    document.title = pageTitle;

    // Find or create meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", pageDescription);

    // Find or create OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", pageDescription);

    // Cleanup: Reset to defaults when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
      
      const descTag = document.querySelector('meta[name="description"]');
      if (descTag) descTag.setAttribute("content", DEFAULT_DESCRIPTION);
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute("content", DEFAULT_TITLE);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute("content", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);

  return null;
};

export default SEO;
