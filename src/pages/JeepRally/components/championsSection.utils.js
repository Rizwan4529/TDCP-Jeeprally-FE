export function shouldShowChampionsEmpty({
  eventId,
  activeCategoryKey,
  champions = [],
  championsSuccess = false,
} = {}) {
  return (
    Boolean(eventId) &&
    Boolean(activeCategoryKey) &&
    championsSuccess &&
    Array.isArray(champions) &&
    champions.length === 0
  );
}
