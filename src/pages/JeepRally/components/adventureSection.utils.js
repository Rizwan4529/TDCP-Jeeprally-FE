export const ADVENTURE_VIDEO_SLOT_COUNT = 5;

export function chunkAdventureVideos(videos = []) {
  if (!Array.isArray(videos) || videos.length === 0) return [[]];

  const chunks = [];
  for (let index = 0; index < videos.length; index += ADVENTURE_VIDEO_SLOT_COUNT) {
    chunks.push(videos.slice(index, index + ADVENTURE_VIDEO_SLOT_COUNT));
  }
  return chunks;
}

export function shouldShowAdventureCarouselControls(videos = []) {
  return Array.isArray(videos) && videos.length > ADVENTURE_VIDEO_SLOT_COUNT;
}

export function getAdventureVideoColumns(slideVideos = []) {
  return {
    main: slideVideos[0] ?? null,
    firstStack: [slideVideos[1], slideVideos[2]].filter(Boolean),
    secondStack: [slideVideos[3], slideVideos[4]].filter(Boolean),
  };
}
