import { z } from 'zod';

const linkedInRegEx =
  /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|pub)\/[a-z0-9_-]{1,100}\/?$/i;

const linkedInProfileLink = z
  .string()
  .refine((value) => linkedInRegEx.test(value), {
    message: 'Invalid LinkedIn profile link',
  });

const twitterRegEx = /^(https?:\/\/)?(www\.)?twitter\.com\/[a-z0-9_]{1,15}$/i;

const twitterProfileLink = z
  .string()
  .refine((value) => twitterRegEx.test(value), {
    message: 'Invalid Twitter profile link',
  });

const urlRegEx = /^(https?:\/\/)?(www\.)?[\w-]+(\.[a-z]{2,})+([/\w-]*)*$/i;

const generalLink = z.string().refine((value) => urlRegEx.test(value), {
  message: 'Invalid URL',
});

export const socialLinkedIn = z.union([z.literal(''), linkedInProfileLink]);
export const socialTwitter = z.union([z.literal(''), twitterProfileLink]);
export const socialBlog = z.union([z.literal(''), generalLink]);
export const socialOther = z.union([z.literal(''), generalLink]);
