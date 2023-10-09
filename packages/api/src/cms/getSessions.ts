import { get } from './helpers/get';
import type { Entity, ListResult, Photo } from './types';

type Presenter = Entity<{
  name: string;
  tagline: string;
  profilePhoto: {
    data: Photo;
  };
  about: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}>;

type Session = Entity<{
  title: string;
  date: string;
  timeSlot: string;
  displayOrder: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  typeDescription: string;
  description: string;
  about: string | null;
  presenters: {
    data: Array<Presenter>;
  };
}>;

export async function getSessions() {
  const result = await get<ListResult<Session>>('/api/sessions', {
    'sort[0]': 'date',
    'sort[1]': 'displayOrder',
    'populate[presenters][populate][0]': 'profilePhoto',
    'pagination[pageSize]': 100,
  });
  const sessions = result.data;
  sessions.sort(
    (a, b) =>
      toDate(a.attributes.date, a.attributes.timeSlot) -
      toDate(b.attributes.date, b.attributes.timeSlot),
  );
  return sessions;
}

function toDate(date: string, timeSlot: string) {
  const time = (timeSlot.split('-')[0] ?? '')
    .toLowerCase()
    .replace(/\s/g, '')
    .replace('am', ' am')
    .replace('pm', ' pm');
  return Date.parse(`${date} ${time}`);
}
