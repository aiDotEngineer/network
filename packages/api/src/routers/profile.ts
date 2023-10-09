import type { UserEmail, UserProfile } from '@prisma/client';
import { z } from 'zod';

import { profileBooleanQuestionsSchema as profileQuestionSchema } from '@pkg/support';
import {
  socialBlog,
  socialLinkedIn,
  socialOther,
  socialTwitter,
} from '@pkg/support/validators';

import { env } from '../../env.mjs';
import { createTRPCRouter, publicProcedure } from '../trpc';

const inputSchema = z.object({
  firstName: z.string().nonempty({ message: 'First name is required' }),
  lastName: z.string().nonempty({ message: 'Last name is required' }),
  emailId: z.string(),
  company: z.string().nonempty({ message: 'Company name is required' }),
  jobTitle: z.string().nonempty({ message: 'Job title is required' }),
  socialLinkedIn,
  socialTwitter,
  socialBlog,
  socialOther,
  career: z.string(),
  projects: z.string(),
  interests: z.string(),
  events: z.string(),
  booleanQuestions: z.array(profileQuestionSchema),
});

export const profileRouter = createTRPCRouter({
  getEmail: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const email = await ctx.prisma.userEmail.findFirst({
      where: { id: input },
    });
    if (!email) {
      return null;
    }
    const { id, emailAddress } = email;
    return { id, emailAddress };
  }),
  signup: publicProcedure
    .input(inputSchema)
    .mutation(async ({ input, ctx }) => {
      const {
        firstName,
        lastName,
        emailId,
        company,
        jobTitle,
        socialLinkedIn,
        socialTwitter,
        socialBlog,
        socialOther,
        career,
        projects,
        interests,
        events,
      } = input;
      const email = await ctx.prisma.userEmail.findFirst({
        where: { id: emailId },
      });
      if (!email) {
        throw new Error('Invalid Email ID');
      }
      const existingUser = await ctx.prisma.userProfile.findUnique({
        where: {
          emailId: email.id,
        },
      });
      let userProfile;
      if (existingUser) {
        userProfile = await ctx.prisma.userProfile.update({
          where: {
            id: existingUser.id,
          },
          data: {
            firstName,
            lastName,
            company,
            jobTitle,
            socialLinkedIn,
            socialTwitter,
            socialBlog,
            socialOther,
            career,
          },
        });
        // Delete the previous survey answers since they will be re-created below
        await ctx.prisma.surveyAnswer.deleteMany({
          where: { userProfileId: userProfile.id },
        });
        await ctx.prisma.profileBooleanAnswer.deleteMany({
          where: { userProfileId: userProfile.id },
        });
      } else {
        userProfile = await ctx.prisma.userProfile.create({
          data: {
            firstName,
            lastName,
            emailId: email.id,
            company,
            jobTitle,
            socialLinkedIn,
            socialTwitter,
            socialBlog,
            socialOther,
            career,
          },
        });
      }
      await ctx.prisma.surveyAnswer.createMany({
        data: [
          {
            userProfileId: userProfile.id,
            question: 'BUILDING_WHAT',
            answer: projects ?? '',
          },
          {
            userProfileId: userProfile.id,
            question: 'WANT_TO_LEARN',
            answer: interests ?? '',
          },
          {
            userProfileId: userProfile.id,
            question: 'WANT_TO_HEAR',
            answer: events ?? '',
          },
        ],
      });
      const userProfileId = userProfile.id;
      // Using a Set() here helps ensure no duplicates
      const booleanQuestions = new Set(input.booleanQuestions);
      if (booleanQuestions.size) {
        await ctx.prisma.profileBooleanAnswer.createMany({
          data: Array.from(booleanQuestions).map((question) => ({
            userProfileId,
            question,
            answer: true,
          })),
        });
      }
      void notify(email, userProfile);
      return {
        success: true,
        id: userProfile.id,
      };
    }),
});

async function notify(email: UserEmail, profile: UserProfile) {
  try {
    await updateUpstreamContact(email, profile);
  } catch (e) {
    console.log(
      '[updateUpstreamContact] Error communicating with upstream provider:',
    );
    console.error(e);
    return;
  }
  try {
    await sendUpstreamEvent(email.emailAddress);
  } catch (e) {
    console.log(
      '[sendUpstreamEvent] Error communicating with upstream provider:',
    );
    console.error(e);
  }
}

type UpdateContactResponse = {
  success: boolean;
  id: string;
};

async function updateUpstreamContact(email: UserEmail, profile: UserProfile) {
  const apiKey = env.LOOPS_API_KEY ?? '';
  if (!apiKey) {
    console.warn('Environment variable LOOPS_API_KEY not found.');
    return;
  }
  const response = await fetch('https://app.loops.so/api/v1/contacts/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email: email.emailAddress,
      firstName: profile.firstName,
      lastName: profile.lastName,
    }),
  });
  if (!response.ok) {
    throw new Error(`Unexpected upstream response status: ${response.status}`);
  }
  const result: unknown = await response.json();
  console.log(result);
  return result as UpdateContactResponse;
}

type SendEventResponse = {
  success: boolean;
  id: string;
};

async function sendUpstreamEvent(emailAddress: string) {
  const apiKey = env.LOOPS_API_KEY ?? '';
  if (!apiKey) {
    console.warn('Environment variable LOOPS_API_KEY not found.');
    return;
  }
  const response = await fetch('https://app.loops.so/api/v1/events/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email: emailAddress,
      eventName: 'profile-created',
    }),
  });
  if (!response.ok) {
    throw new Error(`Unexpected upstream response status: ${response.status}`);
  }
  const result: unknown = await response.json();
  console.log(result);
  return result as SendEventResponse;
}
