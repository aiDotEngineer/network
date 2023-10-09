import type { UserEmail } from '@prisma/client';
import { z } from 'zod';

import { env } from '../../env.mjs';
import { createTRPCRouter, publicProcedure } from '../trpc';

const inputSchema = z.object({
  emailAddress: z.string().email(),
});

export const subscriptionRouter = createTRPCRouter({
  subscribe: publicProcedure
    .input(inputSchema)
    .mutation(async ({ input, ctx }) => {
      const emailAddress = input.emailAddress.toLowerCase();
      const existing = await ctx.prisma.userEmail.findFirst({
        where: { emailAddress },
      });
      if (existing) {
        return {
          success: true,
          id: existing.id,
        };
      }
      const result = await ctx.prisma.userEmail.create({
        data: {
          emailAddress,
          subscribed: true,
        },
      });
      void notify(result);
      return {
        success: true,
        id: result.id,
      };
    }),
});

async function notify(email: UserEmail) {
  try {
    await addUpstreamContact(email);
  } catch (e) {
    console.log(
      '[addUpstreamContact] Error communicating with upstream provider:',
    );
    console.error(e);
  }
}

type CreateContactResponse = {
  success: boolean;
  id: string;
};

async function addUpstreamContact(email: UserEmail) {
  const apiKey = env.LOOPS_API_KEY ?? '';
  if (!apiKey) {
    console.warn('Environment variable LOOPS_API_KEY not found.');
    return;
  }
  const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      email: email.emailAddress,
      userId: email.id,
      userGroup: 'Subscribers',
      source: 'Early Landing Page Subscribe',
    }),
  });
  if (!response.ok) {
    throw new Error(`Unexpected upstream response status: ${response.status}`);
  }
  const result: unknown = await response.json();
  return result as CreateContactResponse;
}
