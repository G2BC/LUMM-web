export function isPanelRoute(pathname: string) {
  return /^\/(?:(?:pt|en)\/)?painel(?:\/|$)/i.test(pathname);
}
