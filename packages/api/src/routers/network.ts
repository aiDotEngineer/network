import { z } from 'zod';

import { completeLogin } from '../descope/completeLogin';
import { getUserByToken } from '../descope/getUserByToken';
import { initLogin } from '../descope/initLogin';
import { getMatches } from '../other/getMatches';
import { getProfile } from '../other/getProfile';
import { getProfileById } from '../other/getProfileById';
import { saveProfile } from '../other/saveProfile';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const answerSchema = z.object({
  key: z.string(),
  answer: z.string(),
});

export const networkRouter = createTRPCRouter({
  getUserByToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => getUserByToken(input.token)),
  initLogin: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(({ input }) => initLogin(input.email)),
  completeLogin: publicProcedure
    .input(z.object({ id: z.string(), code: z.string() }))
    .mutation(({ input }) => completeLogin(input.id, input.code)),
  getUserProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getProfileById(input.id)),
  getProfile: protectedProcedure.query(({ ctx }) =>
    getProfile(ctx.session.user),
  ),

  saveProfile: protectedProcedure
    .input(
      z.object({
        profileFields: z.array(answerSchema),
        surveyAnswers: z.array(answerSchema),
      }),
    )
    .mutation(({ ctx, input }) => saveProfile(ctx.session.user, input)),

  getMatches: protectedProcedure.query(({ ctx }) =>
    getMatches(ctx.session.user),
  ),
});
