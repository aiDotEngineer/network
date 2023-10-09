import { get } from './helpers/get';
import type { Entity, Photo, SingleResult } from './types';

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

export async function getSession(id: string) {
  const result = await get<SingleResult<Session>>(`/api/sessions/${id}`, {
    'populate[presenters][populate][0]': 'profilePhoto',
  });
  return result.data;
}
