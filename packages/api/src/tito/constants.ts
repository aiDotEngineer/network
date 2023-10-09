import { env } from '../../env.mjs';

export const TITO_BASE_URL = 'https://api.tito.io/v3';
export const TITO_ORG_SLUG = 'software-3';
export const TITO_EVENT_SLUG = 'ai-engineer-summit-2023';
export const TITO_API_KEY = env.TITO_API_KEY ?? '';

export const questions = [
  {
    id: 1162127,
    title: 'How would you best-classify your job role?',
    slug: 'how-would-you-best-classify-your-job-rol',
  },
  {
    id: 1162128,
    title: 'How would you classify your experience level?',
    slug: 'how-would-you-classify-your-experience-l',
  },
  {
    id: 1162130,
    title: 'In which city are you based?',
    slug: 'in-which-city-are-you-based',
  },
  {
    id: 1162129,
    title: 'In which country are you based?',
    slug: 'in-which-country-are-you-based',
  },
  {
    id: 1162134,
    title: 'Job title',
    slug: 'job-title',
  },
  {
    id: 1162133,
    title: 'What are your current favorite tech tools?',
    slug: 'what-is-one-thing-you-re-passionate-abou',
  },
  {
    id: 1162132,
    title: "What is one thing you're seeking to learn?",
    slug: 'what-is-one-thing-you-re-seeking-to-lear',
  },
] as const;
