import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MANAGE_ENDPOINTS } from '../constants/api-endpoints';
import { AppRole, EventForm, ManagedMember, NewsForm } from '../models/manage.model';

/**
 * Create / update / delete content through ContentManageController.
 */
@Injectable({ providedIn: 'root' })
export class ManageApiService {
  private readonly http = inject(HttpClient);

  // ---- News ----
  getNews(id: string): Observable<NewsForm> {
    return this.http.get<NewsForm>(MANAGE_ENDPOINTS.newsItem(id));
  }
  createNews(body: NewsForm): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(MANAGE_ENDPOINTS.news, body);
  }
  updateNews(id: string, body: NewsForm): Observable<{ id: string }> {
    return this.http.put<{ id: string }>(MANAGE_ENDPOINTS.newsItem(id), body);
  }
  deleteNews(id: string): Observable<void> {
    return this.http.delete<void>(MANAGE_ENDPOINTS.newsItem(id));
  }

  // ---- Events ----
  getEvent(id: string): Observable<EventForm> {
    return this.http.get<EventForm>(MANAGE_ENDPOINTS.eventItem(id));
  }
  createEvent(body: EventForm): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(MANAGE_ENDPOINTS.events, body);
  }
  updateEvent(id: string, body: EventForm): Observable<{ id: string }> {
    return this.http.put<{ id: string }>(MANAGE_ENDPOINTS.eventItem(id), body);
  }
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(MANAGE_ENDPOINTS.eventItem(id));
  }

  // ---- Members & roles (admin only, MemberRolesController) ----
  getMembers(): Observable<ManagedMember[]> {
    return this.http.get<ManagedMember[]>(MANAGE_ENDPOINTS.members);
  }
  setMemberRole(id: string, role: AppRole): Observable<ManagedMember> {
    return this.http.put<ManagedMember>(MANAGE_ENDPOINTS.memberRole(id), { role });
  }
}
