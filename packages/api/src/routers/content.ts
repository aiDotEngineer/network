import { z } from 'zod';

import { getConference } from '../cms/getConference';
import { getExhibitors } from '../cms/getExhibitors';
import { getLocalPlaces } from '../cms/getLocalPlaces';
import { getSession } from '../cms/getSession';
import { getSessions } from '../cms/getSessions';
import { getSinglePage } from '../cms/getSinglePage';
import { getVenues } from '../cms/getVenues';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const contentRouter = createTRPCRouter({
  getConference: publicProcedure.query(() => getConference()),
  getExhibitors: publicProcedure.query(() => getExhibitors()),
  getLocalPlaces: publicProcedure.query(() => getLocalPlaces()),
  getSessions: publicProcedure.query(() => getSessions()),
  getSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getSession(input.id);
    }),
  getSinglePage: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await getSinglePage(input.slug);
    }),
  getVenues: publicProcedure.query(() => getVenues()),
});
