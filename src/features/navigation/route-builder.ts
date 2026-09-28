export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';

  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          search.append(key, String(item));
        }
      });
      return;
    }

    search.set(key, String(value));
  });

  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function buildAppRoute(
  routePath: string,
  params?: Record<string, unknown>
): string {
  return `${routePath}${buildQueryString(params)}`;
}
