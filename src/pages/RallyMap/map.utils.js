export function shouldShowRoutesEmpty({
  eventId,
  activeCategory,
  routes = [],
  routesSuccess = false,
} = {}) {
  return (
    Boolean(eventId) &&
    Boolean(activeCategory) &&
    routesSuccess &&
    Array.isArray(routes) &&
    routes.length === 0
  );
}
