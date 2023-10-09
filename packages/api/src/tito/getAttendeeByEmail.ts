import { get } from './helpers/get';

type State = 'paid' | 'unpaid' | 'complete' | 'confirmed' | 'incomplete';

type Event = {
  id: number;
  title: string;
  slug: string;
};

type Registration = {
  id: number;
  slug: string;
  name: string;
  email: string;
  company_name: string;
  receipt_number: string;
  receipt_id: number;
  event: Event;
  state: State;
  created_at: string;
  updated_at: string;
  completed_at: string;
};

type ListResult<N extends string, T> = {
  [K in N]: Array<T>;
} & {
  meta: {
    current_page: number;
    next_page: number | null;
    prev_page: number | null;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
};

export async function getAttendeeByEmail(searchEmail: string) {
  const result = await get<ListResult<'registrations', Registration>>(
    '/registrations',
    {
      'search[q]': searchEmail,
    },
  );
  for (const item of result.registrations) {
    const { id, name, email, state } = item;
    if (
      searchEmail.toLowerCase() === email.toLowerCase() &&
      state !== 'incomplete'
    ) {
      return { id: String(id), name, email };
    }
  }
  return null;
}
