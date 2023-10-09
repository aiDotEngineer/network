import OpenAI from 'openai';

import { getPrisma } from '@pkg/db';
import type { SurveyQuestion } from '@pkg/db';

import { env } from '../../env.mjs';
import { getPgClient } from '../support/pg';

type Answer = {
  key: SurveyQuestion;
  question: string;
  answer: string;
};

type Result =
  | {
      status: 'success';
      key: SurveyQuestion;
    }
  | {
      status: 'error';
      key: SurveyQuestion;
      error: Error;
    };

const questions: Partial<Record<SurveyQuestion, { label: string }>> = {
  BUILDING_WHAT: {
    label: 'What have you been building with AI technologies?',
  },
  WANT_TO_LEARN: {
    label: 'What are you most interested in learning?',
  },
  TECHNOLOGIES: {
    label: 'What technologies are you most interested in?',
  },
  ASK_PROBLEM_SOLVE: {
    label:
      'What ask would you have for another attendee, or what problem could they help you solve?',
  },
  GIVE_PROVIDE_OTHERS: {
    label: 'In what way could you potentially help another attendee?',
  },
};

async function createEmbedding(answer: string) {
  if (env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: answer,
    });

    return embedding.data[0]?.embedding;
  }
}

export async function storeEmbeddings(userProfileId: string) {
  const prisma = getPrisma();
  const pgClient = getPgClient();
  const profile = await prisma.userProfile.findUnique({
    where: {
      id: userProfileId,
    },
  });
  if (!profile) {
    throw new Error('Invalid user profile ID');
  }

  const answeredQuestions: Array<Answer> = [];
  for (const [key, { label }] of Object.entries(questions)) {
    const answerRecord = await prisma.surveyAnswer.findFirst({
      where: {
        userProfileId,
        question: key,
      },
    });
    if (answerRecord) {
      answeredQuestions.push({
        key,
        question: label,
        answer: answerRecord.answer,
      });
    }
  }

  const results: Array<Result> = [];
  const embeddings = new Map<SurveyQuestion, Array<number>>();
  for (const answer of answeredQuestions) {
    try {
      const embedding = await createEmbedding(answer.answer);
      if (embedding) {
        embeddings.set(answer.key, embedding);
        results.push({
          status: 'success',
          key: answer.key,
        });
      } else {
        throw new Error('no embedding');
      }
    } catch (e) {
      results.push({
        status: 'error',
        key: answer.key,
        error: e instanceof Error ? e : new Error(String(e)),
      });
    }
  }

  const userEmbedding = await prisma.userEmbedding.upsert({
    where: { userProfileId },
    update: {},
    create: { userProfileId },
  });

  const query = `
    UPDATE "UserEmbedding"
    SET 
      embedding_building_what = $2,
      embedding_want_to_learn = $3,
      embedding_technologies = $4,
      embedding_ask_problem_solve = $5,
      embedding_give_provide_others = $6
    WHERE id = $1
  `;

  await pgClient.query(query, [
    userEmbedding.id,
    encodeVector(embeddings.get('BUILDING_WHAT')),
    encodeVector(embeddings.get('WANT_TO_LEARN')),
    encodeVector(embeddings.get('TECHNOLOGIES')),
    encodeVector(embeddings.get('ASK_PROBLEM_SOLVE')),
    encodeVector(embeddings.get('GIVE_PROVIDE_OTHERS')),
  ]);

  return { success: true, results };
}

function encodeVector(vector: Array<number> | undefined) {
  if (!vector) {
    return null;
  }
  return JSON.stringify(vector);
}
