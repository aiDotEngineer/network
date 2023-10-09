import * as z from 'zod';

import { ProfileBooleanQuestion } from '@pkg/db';
import type { ProfileBooleanQuestion as ProfileBooleanQuestionType } from '@pkg/db';

type QuestionDefinition = {
  label: string;
};

// The satisfies below ensures that we cover each item in the enum
export const profileBooleanQuestions = {
  OPEN_TO_OPPORTUNITIES: {
    label: 'open to considering new AI engineer opportunities',
  },
  INTERESTED_IN_HIRING: {
    label: 'interested in hiring AI engineers',
  },
  SEEKING_CO_FOUNDERS: {
    label: 'seeking co-founders',
  },
  INTERESTED_IN_DEMOING: {
    label: 'interested in demoing one of my projects listed above',
  },
  SEEKING_CUSTOMERS: {
    label: 'seeking customers for my product or service',
  },
} satisfies Record<ProfileBooleanQuestionType, QuestionDefinition>;

// Create a Zod schema for use in validators
export const zodSchema = z.nativeEnum(ProfileBooleanQuestion);
