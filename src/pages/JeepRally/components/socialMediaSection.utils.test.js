import { describe, expect, it } from "vitest";
import {
  getSocialMediaLayoutPosts,
  isDisplayableSocialImageUrl,
  mapSocialFeedPostsToCards,
} from "./socialMediaSection.utils.js";

describe("socialMediaSection utils", () => {
  it("accepts image urls and rejects mp4 media", () => {
    expect(isDisplayableSocialImageUrl("https://cdn.example/photo.webp")).toBe(
      true,
    );
    expect(
      isDisplayableSocialImageUrl(
        "https://cdn.example/video.mp4?token=abc",
      ),
    ).toBe(false);
  });

  it("maps instagram feed posts to card fields", () => {
    const cards = mapSocialFeedPostsToCards([
      {
        _id: "post-1",
        caption: "Hogaya comeback bois",
        mediaUrl: "https://cdn.example/one.webp",
        permalink: "https://www.instagram.com/p/ABC/",
      },
      {
        _id: "post-2",
        mediaUrl: "https://cdn.example/two.mp4",
        permalink: "https://www.instagram.com/p/DEF/",
      },
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      image: "https://cdn.example/one.webp",
      description: "Hogaya comeback bois",
      socialLink: "https://www.instagram.com/p/ABC/",
    });
  });

  it("builds layout slots without repeating the same post", () => {
    const cards = mapSocialFeedPostsToCards([
      { _id: "1", mediaUrl: "https://a/1.jpg", caption: "One" },
      { _id: "2", mediaUrl: "https://a/2.jpg", caption: "Two" },
      { _id: "3", mediaUrl: "https://a/3.jpg", caption: "Three" },
      { _id: "4", mediaUrl: "https://a/4.jpg", caption: "Four" },
    ]);

    const layout = getSocialMediaLayoutPosts(cards);
    const shownIds = [
      ...layout.leftPosts.map((post) => post.id),
      layout.featuredPost?.id,
      layout.rightPost?.id,
    ].filter(Boolean);

    expect(new Set(shownIds).size).toBe(shownIds.length);
    expect(layout.leftPosts.map((post) => post.id)).toEqual(["1", "2"]);
    expect(layout.featuredPost?.id).toBe("3");
    expect(layout.rightPost?.id).toBe("4");
  });
});
