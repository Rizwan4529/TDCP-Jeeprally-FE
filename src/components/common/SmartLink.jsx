import { Link } from "react-router";

const SmartLink = ({ to, children, ...props }) => {
  const isExternal = /^https?:\/\//.test(to);
  if (isExternal) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} {...props}>
      {children}
    </Link>
  );
};

export default SmartLink;