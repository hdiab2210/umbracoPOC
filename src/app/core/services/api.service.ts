import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_ENDPOINTS, AUTH_ENDPOINTS, CONTENT_TYPES } from '../constants/api-endpoints';
import {
  EventItemContent,
  EventItemProperties,
  EventsPageContent,
  EventsProperties,
  HomeContent,
  HomeProperties,
  NewsItemContent,
  NewsItemProperties,
  NewsPageContent,
  NewsProperties,
  UmbracoContent,
  UmbracoPagedResult,
} from '../models/umbraco.models';
import { LoginRequest, Member, RegisterRequest } from '../models/auth.model';
import { byStartDate } from '../utils/event.utils';

/** The single place the app talks to the Umbraco Delivery API. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  // ---- Home ----------------------------------------------------------------

  getHome(): Observable<HomeContent> {
    return this.getContentByPath<HomeProperties>('/');
  }

  // ---- News ----------------------------------------------------------------

  /** Newest first. Pass `take` to get only the latest few (e.g. for the home page). */
  getNewsItems(take = 100): Observable<NewsItemContent[]> {
    return this.getContentByType<NewsItemProperties>(CONTENT_TYPES.newsItem, 'createDate:desc', take).pipe(
      map((result) => result.items),
    );
  }

  getNewsItem(id: string): Observable<NewsItemContent> {
    return this.getContentById<NewsItemProperties>(id);
  }

  getNewsPage(): Observable<NewsPageContent | null> {
    return this.getFirstOfType<NewsProperties>(CONTENT_TYPES.news);
  }

  // ---- Events --------------------------------------------------------------

  /**
   * All events, ordered by start date.
   * The Delivery API can only sort by built-in fields (name, createDate, sortOrder…),
   * not by our own "startDate" property, so we sort here.
   */
  getEventItems(): Observable<EventItemContent[]> {
    return this.getContentByType<EventItemProperties>(CONTENT_TYPES.eventItem, 'sortOrder:asc').pipe(
      map((result) => [...result.items].sort(byStartDate)),
    );
  }

  getEventItem(id: string): Observable<EventItemContent> {
    return this.getContentById<EventItemProperties>(id);
  }

  getEventsPage(): Observable<EventsPageContent | null> {
    return this.getFirstOfType<EventsProperties>(CONTENT_TYPES.events);
  }

  // ---- Auth ----------------------------------------------------------------

  register(registerBody: RegisterRequest): Observable<Member> {
    return this.http.post<Member>(AUTH_ENDPOINTS.register, registerBody);
  }

  login(loginBody: LoginRequest): Observable<Member> {
    return this.http.post<Member>(AUTH_ENDPOINTS.login, loginBody);
  }

  logout(): Observable<void> {
    return this.http.post<void>(AUTH_ENDPOINTS.logout, {});
  }

  getCurrentMember(): Observable<Member> {
    return this.http.get<Member>(AUTH_ENDPOINTS.me);
  }

  // ---- Generic building blocks ----------------------------------------------

  private getContentByPath<T>(path: string): Observable<UmbracoContent<T>> {
    return this.http.get<UmbracoContent<T>>(API_ENDPOINTS.contentByPath(path));
  }

  private getContentById<T>(id: string): Observable<UmbracoContent<T>> {
    return this.http.get<UmbracoContent<T>>(API_ENDPOINTS.contentById(id));
  }

  /** For "list" pages like News/Events: there is only one of each, so take the first. */
  private getFirstOfType<T>(contentType: string): Observable<UmbracoContent<T> | null> {
    return this.getContentByType<T>(contentType, 'sortOrder:asc', 1).pipe(map((result) => result.items[0] ?? null));
  }

  private getContentByType<T>(
    contentType: string,
    sort: string,
    take = 100,
  ): Observable<UmbracoPagedResult<UmbracoContent<T>>> {
    const params = new HttpParams()
      .set('filter', `contentType:${contentType}`)
      .set('sort', sort)
      .set('take', take);

    return this.http.get<UmbracoPagedResult<UmbracoContent<T>>>(API_ENDPOINTS.content, { params });
  }
}
