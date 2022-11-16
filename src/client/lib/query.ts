

export function getQuery(key: string) {
  const url = new window.URL(window.location.href);
  return url.searchParams.get(key);
}
