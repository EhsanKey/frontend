const BACKEND_PROXY_PREFIX = '/api/backend';

export const toBackendProxyHref = (href: string): string => {
  if (!href || href.startsWith(`${BACKEND_PROXY_PREFIX}/`)) {
    return href;
  }

  if (href.startsWith('/')) {
    return `${BACKEND_PROXY_PREFIX}${href}`;
  }

  return `${BACKEND_PROXY_PREFIX}/${href.replace(/^\/+/, '')}`;
};
