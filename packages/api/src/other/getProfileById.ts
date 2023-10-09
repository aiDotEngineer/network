import { getPrisma } from '@pkg/db';

import { getTicketByEmail } from '../tito/getTicketByEmail';

export async function getProfileById(id: string) {
  const prisma = getPrisma();
  const userProfile = await prisma.userProfile.findFirst({
    where: { id },
    include: { email: true },
  });
  if (!userProfile) {
    return null;
  }
  const {
    email: { emailAddress: email },
    firstName,
    lastName,
    company,
    jobTitle,
    socialLinkedIn,
    socialTwitter,
    socialBlog,
    socialOther,
    career,
  } = userProfile;
  const attendee = await getTicketByEmail(email);
  return {
    id,
    name: combine(firstName, lastName),
    email,
    profilePhoto: attendee?.avatar_url ?? '',
    company,
    jobTitle,
    socialLinkedIn,
    socialTwitter,
    socialBlog,
    socialOther,
    sections: [
      {
        key: 'career',
        title: 'Professional career and work',
        content: career ?? '',
      },
    ],
  };
}

function combine(firstName: string, lastName: string) {
  return (firstName.trim() + ' ' + lastName.trim()).trim();
}
