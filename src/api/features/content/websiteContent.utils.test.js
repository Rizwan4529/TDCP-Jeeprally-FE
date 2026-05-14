import { describe, expect, it } from "vitest";
import {
  ensureExternalUrl,
  getWebsiteContentPage,
  getWebsiteContentSection,
  getWebsiteNestedSection,
  getWebsiteSectionItems,
  shouldShowWebsiteLoader,
} from "./websiteContent.utils.js";

const websiteContent = {
  pages: [
    {
      id: "home",
      sections: [
        { id: "hero", title: "Hero title" },
        { id: "champions", title: "Champions of the Rally" },
      ],
    },
    {
      id: "about",
      sections: [
        {
          id: "intro",
          sections: [
            { id: "vision", title: "Our Vision" },
            { id: "main", title: "Our Story of Speed & Adventure" },
          ],
        },
      ],
    },
  ],
};

describe("websiteContent utils", () => {
  it("finds pages and sections by id", () => {
    const homePage = getWebsiteContentPage(websiteContent, "home");
    expect(homePage?.id).toBe("home");
    expect(getWebsiteContentSection(homePage, "champions")?.title).toBe(
      "Champions of the Rally"
    );
  });

  it("finds nested sections by id", () => {
    const aboutPage = getWebsiteContentPage(websiteContent, "about");
    const introSection = getWebsiteContentSection(aboutPage, "intro");

    expect(getWebsiteNestedSection(introSection, "vision")?.title).toBe(
      "Our Vision"
    );
  });

  it("normalizes website links to fully qualified urls", () => {
    expect(ensureExternalUrl("instagram.com/TDCP")).toBe(
      "https://instagram.com/TDCP"
    );
    expect(ensureExternalUrl("https://facebook.com/TDCP")).toBe(
      "https://facebook.com/TDCP"
    );
  });

  it("returns section items arrays safely", () => {
    expect(
      getWebsiteSectionItems({
        id: "quickLinks",
        items: [{ title: "Home" }, { title: "Profile" }],
      })
    ).toEqual([{ title: "Home" }, { title: "Profile" }]);

    expect(getWebsiteSectionItems({ id: "contact" })).toEqual([]);
  });

  it("shows the full page loader only while content is still missing", () => {
    expect(
      shouldShowWebsiteLoader({ isPending: true, isFetching: false, content: null })
    ).toBe(true);

    expect(
      shouldShowWebsiteLoader({
        isPending: false,
        isFetching: true,
        content: { pages: [] },
      })
    ).toBe(false);
  });
});
