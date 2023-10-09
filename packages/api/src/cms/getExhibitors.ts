import { get } from './helpers/get';
import type { Entity, ListResult, Photo } from './types';

const levels = {
  PRESENTING_SPONSOR: true,
  DIAMOND_SPONSOR: true,
  GOLD_SPONSOR: true,
  SILVER_SPONSOR: true,
};

type Level = keyof typeof levels;

type Exhibitor = Entity<{
  name: string;
  sponsorLevel: Level | null;
  description: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  displayOrder: number;
  logo: {
    data: Photo;
  };
  logoBgColor: string;
}>;

export async function getExhibitors() {
  const result = await get<ListResult<Exhibitor>>('/api/exhibitors', {
    sort: 'displayOrder',
    populate: '*',
    'pagination[pageSize]': 100,
  });
  return result.data;
}
