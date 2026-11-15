/**
 * Every Umbraco URL the app calls lives here, so there is one place to change them.
 */
const DELIVERY_API = '/umbraco/delivery/api/v2';

export const API_ENDPOINTS = {
  /** List/query published content: ?filter=, ?sort=, ?take= */
  content: `${DELIVERY_API}/content`,

  /** One published item by its URL path, e.g. "/" or "news/new-office-opened". */
  contentByPath: (path: string) => `${DELIVERY_API}/content/item/${encodePath(path)}`,
  /** One published item by its ID (the same in every language). */
  contentById: (id: string) => `${DELIVERY_API}/content/item/${id}`,
} as const;

/** Our own member auth controller in Umbraco (MemberAuthController). */
export const AUTH_ENDPOINTS = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  me: '/api/auth/me',
} as const;

/** Our own content management controller in Umbraco (ContentManageController). */
export const MANAGE_ENDPOINTS = {
  news: '/api/manage/news',
  newsItem: (id: string) => `/api/manage/news/${id}`,
  events: '/api/manage/events',
  eventItem: (id: string) => `/api/manage/events/${id}`,
  /** Admin only (MemberRolesController). */
  members: '/api/manage/members',
  memberRole: (id: string) => `/api/manage/members/${id}/role`,
} as const;

/** Umbraco content type aliases used in queries. */
export const CONTENT_TYPES = {
  home: 'home',
  news: 'news',
  newsItem: 'newsItem',
  events: 'events',
  eventItem: 'eventItem',
} as const;

function encodePath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  // The root page ("/") has no segments; the API expects it encoded.
  return segments.length ? segments.map(encodeURIComponent).join('/') : encodeURIComponent('/');
}
