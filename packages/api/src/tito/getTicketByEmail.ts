import { get } from './helpers/get';

type Answer = {
  id: number;
  question_id: number;
  ticket_id: number;
  response: string;
  primary_response: Array<string>;
};

type Ticket = {
  id: number;
  slug: string;
  email: string;
  company_name: string;
  first_name: string;
  last_name: string;
  name: string;
  number: number;
  phone_number: string;
  state: string;
  registration_id: number;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  qr_url: string;
  show_qr_code: true;
  // A URL to display a QR code of the VCard
  vcard_url: string;
  vcard_data: string;
  answers: Array<Answer>;
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

export async function getTicketByEmail(searchEmail: string) {
  const result = await get<ListResult<'tickets', Ticket>>('/tickets', {
    'search[q]': searchEmail,
    expand: 'answers',
  });
  for (const ticket of result.tickets) {
    if (
      searchEmail.toLowerCase() === ticket.email.toLowerCase() &&
      ticket.state === 'complete'
    ) {
      return ticket;
    }
  }
  return null;
}
