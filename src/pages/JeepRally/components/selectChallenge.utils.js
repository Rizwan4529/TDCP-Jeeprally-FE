export const SELECT_CHALLENGE_SLIDE_SIZE = 3;

export function chunkSelectChallenges(challenges = []) {
  if (!Array.isArray(challenges) || challenges.length === 0) return [[]];

  const chunks = [];
  for (
    let index = 0;
    index < challenges.length;
    index += SELECT_CHALLENGE_SLIDE_SIZE
  ) {
    chunks.push(challenges.slice(index, index + SELECT_CHALLENGE_SLIDE_SIZE));
  }
  return chunks;
}

export function shouldShowSelectChallengeCarouselControls(challenges = []) {
  return (
    Array.isArray(challenges) && challenges.length > SELECT_CHALLENGE_SLIDE_SIZE
  );
}

export function getSelectChallengeColumns(slideChallenges = []) {
  return {
    smallCards: [slideChallenges[0], slideChallenges[1]].filter(Boolean),
    largeCard: slideChallenges[2] ?? null,
  };
}
