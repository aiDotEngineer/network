import { questions } from './constants';
import { getTicketByEmail } from './getTicketByEmail';

const questionIds = new Set<number>(questions.map(({ id }) => id));

export async function getAttendeeAnswers(searchEmail: string) {
  const ticket = await getTicketByEmail(searchEmail);
  const answers = [];
  for (const answer of ticket?.answers ?? []) {
    const { question_id: id, response } = answer;
    if (questionIds.has(id)) {
      answers.push({ id, response });
    }
  }
  return answers;
}
