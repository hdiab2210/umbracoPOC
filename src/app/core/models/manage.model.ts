/** A text in both site languages. Same shape as the C# record LocalizedText. */
export interface LocalizedText {
  en: string;
  ar: string;
}

/** Sent to / received from /api/manage/news (C# NewsRequest). Description is HTML. */
export interface NewsForm {
  title: LocalizedText;
  description: LocalizedText;
}

/** The three roles an admin can give. The server maps them to Umbraco member groups. */
export type AppRole = 'member' | 'editor' | 'admin';

/** One row of the Members tab (C# MemberRoleResponse). */
export interface ManagedMember {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  /** true for the admin who is looking at the list (they can't change their own role). */
  isCurrentUser: boolean;
}

/** Sent to / received from /api/manage/events (C# EventRequest). Dates look like "2026-11-18T09:00". */
export interface EventForm {
  title: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
  startDate: string;
  endDate: string | null;
}
