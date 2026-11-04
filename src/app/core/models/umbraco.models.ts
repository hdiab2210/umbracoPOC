/** Shapes returned by the Umbraco Content Delivery API (v2). */

export interface UmbracoRoute {
  path: string;
}

export interface UmbracoRichText {
  markup: string;
  blocks: unknown[];
}

export interface UmbracoImage {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

export interface UmbracoContent<TProperties> {
  id: string;
  name: string;
  contentType: string;
  createDate: string;
  updateDate: string;
  route: UmbracoRoute;
  properties: TProperties;
}

export interface UmbracoPagedResult<T> {
  total: number;
  items: T[];
}

/** Document type "home" (aliases: title, bodyText). */
export interface HomeProperties {
  title?: string;
  bodyText?: UmbracoRichText;
}

/** Document type "news" (aliases: title). */
export interface NewsProperties {
  title?: string;
}

/** Document type "newsItem" (aliases: title, description, image). */
export interface NewsItemProperties {
  title?: string;
  description?: UmbracoRichText;
  image?: UmbracoImage[];
}

export type HomeContent = UmbracoContent<HomeProperties>;
export type NewsPageContent = UmbracoContent<NewsProperties>;
export type NewsItemContent = UmbracoContent<NewsItemProperties>;

/** Document type "events" (aliases: title). */
export interface EventsProperties {
  title?: string;
}

/** Document type "eventItem" (aliases: title, description, image, startDate, endDate, location). */
export interface EventItemProperties {
  title?: string;
  description?: UmbracoRichText;
  image?: UmbracoImage[];
  /** ISO date string, e.g. "2026-11-18T09:00:00Z". */
  startDate?: string | null;
  endDate?: string | null;
  location?: string;
}

export type EventsPageContent = UmbracoContent<EventsProperties>;
export type EventItemContent = UmbracoContent<EventItemProperties>;
