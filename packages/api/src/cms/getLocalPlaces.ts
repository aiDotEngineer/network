import { get } from './helpers/get';
import type { Entity, ListResult, Photo } from './types';

type LocalPlace = Entity<{
  name: string;
  category: string;
  caption: string;
  distance: string | null;
  description: string;
  link: string;
  about: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  displayOrder: number;
  photo: {
    data: Photo;
  };
}>;

export async function getLocalPlaces() {
  const result = await get<ListResult<LocalPlace>>('/api/local-places', {
    sort: 'displayOrder',
    populate: '*',
    'pagination[pageSize]': 100,
  });
  return result.data;
}
