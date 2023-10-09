import { get } from './helpers/get';
import type { Entity, ListResult, Photo } from './types';

export type Job = Entity<{
  title: string;
  company: string;
  location: string;
  about: string | null;
  link: string;
  workMode: string | null;
  commitmentLevel: string | null;
  salaryRange: string | null;
  experienceLevel: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  logo: {
    data: Photo;
  };
}>;

export async function getJobs() {
  const result = await get<ListResult<Job>>('/api/jobs', {
    sort: 'displayOrder',
    populate: '*',
    'pagination[pageSize]': 100,
  });
  return result.data;
}
