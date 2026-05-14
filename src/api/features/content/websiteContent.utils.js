export function getWebsiteContentPage(content, pageId) {
  return content?.pages?.find((page) => page.id === pageId) ?? null;
}

export function getWebsiteContentSection(page, sectionId) {
  return page?.sections?.find((section) => section.id === sectionId) ?? null;
}

export function getWebsiteNestedSection(section, nestedId) {
  return section?.sections?.find((item) => item.id === nestedId) ?? null;
}

export function getWebsiteSectionItems(section, key = "items") {
  return Array.isArray(section?.[key]) ? section[key] : [];
}

export function ensureExternalUrl(url) {
  if (!url) return "#";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function shouldShowWebsiteLoader({
  isPending = false,
  isFetching = false,
  content = null,
} = {}) {
  return !content && (isPending || isFetching);
}
