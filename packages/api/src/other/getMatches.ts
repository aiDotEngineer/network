import { getPrisma } from '@pkg/db';

import { getTicketByEmail } from '../tito/getTicketByEmail';

// This is the user data from Descope (which was populated from Tito)
type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type Profile = {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  career: string;
  profilePhoto: string;
};

type MatchResult = {
  userProfileId: string;
};

async function getMatchingProfiles(
  userProfileId: string,
): Promise<Array<MatchResult>> {
  const prisma = getPrisma();
  // idiomatic Prisma gets confused because vectors
  const embeddings: Array<{
    embedding_building_what: string | null;
    embedding_want_to_learn: string | null;
    embedding_technologies: string | null;
    embedding_ask_problem_solve: string | null;
    embedding_give_provide_others: string | null;
  }> = await prisma.$queryRaw`
    select 
      embedding_building_what::text, 
      embedding_want_to_learn::text, 
      embedding_technologies::text,
      embedding_ask_problem_solve::text,
      embedding_give_provide_others::text
    from "UserEmbedding"
    where "userProfileId"=${userProfileId}
  limit 1`;

  if (!embeddings?.[0]) {
    return [];
  }

  // Someone who can solve your problem is either:
  // - giving that to others
  // - currently building something similar
  // - building what you'd like to learn
  // - using technologies you'd like to learn
  if (
    embeddings[0].embedding_ask_problem_solve &&
    embeddings[0].embedding_want_to_learn
  ) {
    const matches: Array<MatchResult> = await prisma.$queryRaw`
      select "userProfileId" from "UserEmbedding"
      order by 
        embedding_give_provide_others <-> ${JSON.parse(
          embeddings[0].embedding_ask_problem_solve,
        )}::vector,
        embedding_building_what <-> ${JSON.parse(
          embeddings[0].embedding_ask_problem_solve,
        )}::vector,
        embedding_building_what <-> ${JSON.parse(
          embeddings[0].embedding_want_to_learn,
        )}::vector,
        embedding_technologies <-> ${JSON.parse(
          embeddings[0].embedding_want_to_learn,
        )}::vector
    limit 10`;

    return matches;
  }
  // If you don't have an ask, then we can help you learn
  else if (embeddings[0].embedding_want_to_learn) {
    const matches: Array<MatchResult> = await prisma.$queryRaw`
      select "userProfileId" from "UserEmbedding"
      order by
        embedding_building_what <-> ${JSON.parse(
          embeddings[0].embedding_want_to_learn,
        )}::vector,
        embedding_technologies <-> ${JSON.parse(
          embeddings[0].embedding_want_to_learn,
        )}::vector
    limit 10`;

    return matches;
  }
  // If you don't seek to learn, we can help with your ask
  else if (embeddings[0].embedding_ask_problem_solve) {
    const matches: Array<MatchResult> = await prisma.$queryRaw`
      select "userProfileId" from "UserEmbedding"
      order by
        embedding_give_provide_others <-> ${JSON.parse(
          embeddings[0].embedding_ask_problem_solve,
        )}::vector,
        embedding_building_what <-> ${JSON.parse(
          embeddings[0].embedding_ask_problem_solve,
        )}::vector,
    limit 10`;

    return matches;
  }

  return [];
}

export async function getMatches(user: SessionUser): Promise<Array<Profile>> {
  const prisma = getPrisma();
  const emailAddress = user.email;
  const email = await prisma.userEmail.findFirst({ where: { emailAddress } });
  const emailId = email?.id ?? '';
  const userProfile = await prisma.userProfile.findFirst({
    where: { emailId },
  });
  if (!userProfile) {
    return [];
  }
  const userProfileId = userProfile.id;
  const results: Array<Profile> = [];
  const matchingProfiles = await getMatchingProfiles(userProfileId);
  for (const { userProfileId: id } of matchingProfiles) {
    // Don't include myself in my matches
    if (id === userProfileId) {
      continue;
    }
    const userProfile = await prisma.userProfile.findFirst({
      where: { id },
      include: { email: true },
    });
    if (userProfile) {
      const attendee = await getTicketByEmail(userProfile.email.emailAddress);
      const { id, firstName, lastName, company, jobTitle, career } =
        userProfile;
      results.push({
        id,
        name: combine(firstName, lastName),
        company,
        jobTitle,
        career: career ?? '',
        profilePhoto: attendee?.avatar_url ?? '',
      });
    }
  }
  return results;
}

function combine(firstName: string, lastName: string) {
  return (firstName.trim() + ' ' + lastName.trim()).trim();
}
