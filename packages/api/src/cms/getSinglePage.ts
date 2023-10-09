import { get } from './helpers/get';
import type { Entity, ListResult, SingleResult } from './types';

// For legacy reasons, two pages are not in the pages table
const standalonePages = new Set(['privacy-policy', 'support']);

type Page = Entity<{
  slug?: string;
  title?: string;
  content: string;
  internalUseOnly?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}>;

export async function getSinglePage(slug: string) {
  if (standalonePages.has(slug)) {
    const result = await get<SingleResult<Page>>(`/api/${slug}`);
    return result.data;
  }
  const pages = await get<ListResult<Page>>(`/api/pages`, {
    'filters[slug][$eq]': slug,
  });
  const found = pages.data[0];
  return found ?? null;
}
