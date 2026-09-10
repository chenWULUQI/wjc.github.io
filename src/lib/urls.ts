import { SITE } from '../config';

export function withBase(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  const root = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const cleanPath = path.replace(/^\/+/, '');
  return cleanPath ? `${root}${cleanPath}` : root;
}

export function absoluteUrl(path = '/') {
  return new URL(withBase(path), SITE.origin).toString();
}
