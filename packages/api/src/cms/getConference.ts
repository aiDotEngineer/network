import { get } from './helpers/get';
import type { Entity, SingleResult } from './types';

type Conference = Entity<{
  title: string;
  startDate: string;
  numberOfDays: number;
  location: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}>;

export async function getConference() {
  const result = await get<SingleResult<Conference>>('/api/conferences/1', {
    populate: '*',
  });
  return result.data;
}
