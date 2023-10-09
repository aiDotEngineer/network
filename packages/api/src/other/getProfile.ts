import { getPrisma } from '@pkg/db';

import { questions } from './constants';

// This is the user data from Descope (which was populated from Tito)
type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type FieldType = 'SHORT_TEXT' | 'LONG_TEXT';
type ViewState = 'EDITABLE' | 'READ_ONLY' | 'HIDDEN';

type Answer = {
  key: string;
  type: FieldType;
  label: string;
  answer: string;
  viewState: ViewState;
};

export async function getProfile(user: SessionUser) {
  const prisma = getPrisma();
  const emailAddress = user.email;
  const email = await prisma.userEmail.findFirst({ where: { emailAddress } });
  const emailId = email?.id ?? '';
  const userProfile = await prisma.userProfile.findFirst({
    where: { emailId },
  });
  const surveyAnswers: Array<Answer> = [];
  for (const [key, { label }] of Object.entries(questions)) {
    const answerRecord = await prisma.surveyAnswer.findFirst({
      where: {
        userProfileId: userProfile?.id ?? '',
        question: key,
      },
    });
    surveyAnswers.push({
      key,
      type: 'LONG_TEXT',
      label,
      answer: answerRecord?.answer ?? '',
      viewState: 'EDITABLE',
    });
  }
  const profileFields: Array<Answer> = [
    {
      key: 'name',
      type: 'SHORT_TEXT',
      label: 'Name',
      answer: userProfile
        ? combine(userProfile.firstName, userProfile.lastName)
        : user.name,
      viewState: 'EDITABLE',
    },
    {
      key: 'company',
      type: 'SHORT_TEXT',
      label: 'Company',
      answer: userProfile?.company ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'jobTitle',
      type: 'SHORT_TEXT',
      label: 'Job Title',
      answer: userProfile?.jobTitle ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'career',
      type: 'LONG_TEXT',
      label: 'Brief summary of your professional career and work',
      answer: userProfile?.career ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'socialLinkedIn',
      type: 'SHORT_TEXT',
      label: 'LinkedIn URL',
      answer: userProfile?.socialLinkedIn ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'socialTwitter',
      type: 'SHORT_TEXT',
      label: 'Twitter URL',
      answer: userProfile?.socialTwitter ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'socialBlog',
      type: 'SHORT_TEXT',
      label: 'Blog URL',
      answer: userProfile?.socialBlog ?? '',
      viewState: 'EDITABLE',
    },
    {
      key: 'socialOther',
      type: 'SHORT_TEXT',
      label: 'Other URL',
      answer: userProfile?.socialOther ?? '',
      viewState: 'EDITABLE',
    },
  ];
  return {
    id: user.id,
    email: user.email,
    profileFields,
    surveyAnswers,
  };
}

function combine(firstName: string, lastName: string) {
  return (firstName.trim() + ' ' + lastName.trim()).trim();
}
