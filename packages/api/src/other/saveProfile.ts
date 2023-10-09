import { getPrisma } from '@pkg/db';
import type { SurveyQuestion, UserProfile } from '@pkg/db';

import { questions } from './constants';
import { storeEmbeddings } from './storeEmbeddings';

// This is the user data from Descope (which was populated from Tito)
type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type Answer = {
  key: string;
  answer: string;
};

type ProfileUpdates = {
  profileFields: Array<Answer>;
  surveyAnswers: Array<Answer>;
};

type Result =
  | { success: true }
  | { success: false; errorCode: string; errorMessage: string };

async function getOrCreateEmail(emailAddress: string) {
  const prisma = getPrisma();
  const email = await prisma.userEmail.findFirst({ where: { emailAddress } });
  if (email) {
    return email;
  }
  return await prisma.userEmail.create({
    data: { emailAddress, subscribed: true },
  });
}

async function getOrCreateProfile(user: SessionUser) {
  const prisma = getPrisma();
  const { id: emailId } = await getOrCreateEmail(user.email);
  const userProfile = await prisma.userProfile.findFirst({
    where: { emailId },
  });
  if (userProfile) {
    return userProfile;
  }
  return await prisma.userProfile.create({
    data: {
      firstName: user.name,
      lastName: '',
      emailId,
      company: '',
      jobTitle: '',
    },
  });
}

async function updateSurveyAnswer(
  userProfileId: string,
  question: SurveyQuestion,
  answer: string,
) {
  const prisma = getPrisma();
  const existingRecord = await prisma.surveyAnswer.findFirst({
    where: { userProfileId, question },
    select: {
      id: true,
    },
  });
  return await prisma.surveyAnswer.upsert({
    where: { id: existingRecord?.id ?? '' },
    update: { answer },
    create: {
      userProfileId,
      question,
      answer,
    },
  });
}

const linkedInRegEx =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-z0-9_-]{1,100}\/?$/i;
const twitterRegEx = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-z0-9_]{1,15}$/i;
const urlRegEx = /^(https?:\/\/)?(www\.)?[\w-]+(\.[a-z]{2,})+([/\w-]*)*$/i;

const updatableFields = {
  company: () => true,
  jobTitle: () => true,
  career: () => true,
  socialLinkedIn: (value) => linkedInRegEx.test(value),
  socialTwitter: (value) => twitterRegEx.test(value),
  socialBlog: (value) => urlRegEx.test(value),
  socialOther: (value) => urlRegEx.test(value),
} satisfies Partial<Record<keyof UserProfile, (input: string) => boolean>>;

type UpdatableField = keyof typeof updatableFields | 'firstName' | 'lastName';

export async function saveProfile(
  user: SessionUser,
  updates: ProfileUpdates,
): Promise<Result> {
  const { profileFields, surveyAnswers } = updates;
  const prisma = getPrisma();
  const userProfile = await getOrCreateProfile(user);
  const { firstName, lastName } = userProfile;

  const toUpdate: Partial<Record<UpdatableField, string>> = {};
  for (const [key, isValid] of Object.entries(updatableFields)) {
    const newValue = profileFields.find((a) => a.key === key);
    if (newValue && isValid(newValue.answer)) {
      toUpdate[key] = newValue.answer;
    }
  }
  const newName = profileFields.find((a) => a.key === 'name');
  if (newName && newName.answer !== combine(firstName, lastName)) {
    // TODO: Find a better solution
    toUpdate.firstName = newName.answer;
    toUpdate.lastName = '';
  }

  if (Object.keys(toUpdate).length) {
    await prisma.userProfile.update({
      where: { id: userProfile.id },
      data: toUpdate,
    });
  }

  for (const [key] of Object.entries(questions)) {
    const surveyAnswer = surveyAnswers.find((a) => a.key === key);
    if (surveyAnswer) {
      await updateSurveyAnswer(userProfile.id, key, surveyAnswer.answer);
    }
  }

  await storeEmbeddings(userProfile.id);

  return { success: true };
}

function combine(firstName: string, lastName: string) {
  return (firstName.trim() + ' ' + lastName.trim()).trim();
}
