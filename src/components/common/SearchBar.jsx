import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useGlobalSearchQuery } from "../../api/features/search/search.hooks";
import SmartLink from "./SmartLink";
import { useLocation } from "react-router";

const SearchBar = ({ isExcluded, scrolled }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const { pathname } = useLocation();

  const { data: searchData, isLoading } = useGlobalSearchQuery(debouncedQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
        setDebouncedQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getResultPath = (result) => {
    if (result.type === "service") {
      const serviceType = result.metadata?.serviceType;
      if (["festival", "tour", "event"].includes(serviceType)) {
        return `/services/${result._id}`;
      }
      return `/events/${result.title.toLowerCase().replace(/\s+/g, "-")}`;
    } else if (result.type === "content") {
      const contentType = result.metadata?.contentType;
      if (contentType === "attractions-by-destination") {
        return `/districts/${result.title}`;
      } else if (contentType === "attractions-by-site") {
        return `/sites/${result.title}`;
      } else if (contentType === "content-page") {
        return `/content-page/${result.title}`;
      }
    }
    return "#";
  };

  const getCategoryLabel = (result) => {
    if (result.type === "service") {
      const serviceType = result.metadata?.serviceType;
      return serviceType
        ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
        : "Service";
    } else if (result.type === "content") {
      const contentType = result.metadata?.contentType;
      if (contentType === "attractions-by-destination") {
        return "Destination";
      } else if (contentType === "attractions-by-site") {
        return "Attraction";
      } else {
        return "Content";
      }
    }
    return null;
  };

  const formatTitle = (title) => {
    return title.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Sort results by relevance score (highest first)
  const searchResults = (searchData?.results || []).sort(
    (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
  );
  const totalResults = searchData?.pagination?.totalResults || 0;

  useEffect(() => {
    handleClear();
  }, [pathname]);

  return (
    <div ref={searchRef} className="relative z-50">
      {/* Search Input */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={() => {
            // Small delay to allow click events on results to fire
            setTimeout(() => {
              if (!searchRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
              }
            }, 150);
          }}
          className={`w-full max-w-xs pl-9 pr-8 py-1.5 rounded-full text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent ${
            isExcluded || scrolled
              ? "bg-gray-100 text-black placeholder-gray-500"
              : "bg-white/20 text-white placeholder-white/70"
          }`}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchQuery && (
        <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-[100] w-[450px] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-accent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="p-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
                  <p className="text-xs text-gray-600">
                    Found {totalResults} result
                    {totalResults !== 1 ? "s" : ""} for "
                    <span className="font-semibold">{debouncedQuery}</span>"
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((result) => (
                    <SmartLink
                      key={result._id}
                      to={getResultPath(result)}
                      onClick={handleClose}
                      className="block p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted group-hover:text-accent transition-colors">
                              {getCategoryLabel(result)}
                            </span>
                          </div>
                          <h4
                            className="text-sm font-semibold text-black group-hover:text-accent transition-colors"
                            dangerouslySetInnerHTML={{
                              __html:
                                result.highlightedTitle ||
                                formatTitle(result.title),
                            }}
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          />
                          {result.metadata?.category?.[0]?.subcategories && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1 group-hover:text-accent/70 transition-colors">
                              {result.metadata.category[0].subcategories.join(
                                ", "
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </SmartLink>
                  ))}
                </div>
              </>
            ) : debouncedQuery ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-1">No results found</p>
                <p className="text-xs text-gray-400">
                  Try searching with different keywords
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
