import { get } from './helpers/get';
import type { Entity, ListResult, Photo } from './types';

type Venue = Entity<{
  name: string;
  type: string;
  date: string;
  address: string;
  link: string;
  about: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  displayOrder: number;
  photo: {
    data: Photo;
  };
}>;

export async function getVenues() {
  const result = await get<ListResult<Venue>>('/api/venues', {
    sort: 'displayOrder',
    populate: '*',
    'pagination[pageSize]': 100,
  });
  return result.data;
}
