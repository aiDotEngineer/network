import { getPrisma } from '@pkg/db';

export async function getProfileByEmail(emailAddress: string) {
  const prisma = getPrisma();
  const email = await prisma.userEmail.findFirst({ where: { emailAddress } });
  const emailId = email?.id ?? '';
  return await prisma.userProfile.findFirst({
    where: { emailId },
  });
}
