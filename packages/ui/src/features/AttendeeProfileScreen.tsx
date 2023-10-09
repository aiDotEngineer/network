import {
  Globe as IconGlobe,
  Link as IconLink,
  Linkedin as IconLinkedin,
  Twitter as IconTwitter,
  User,
} from '@tamagui/lucide-icons';
import { Anchor, Avatar, Paragraph, ScrollView, XStack, YStack } from 'tamagui';

import { useTranslation } from '@pkg/support';

import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { useApiClient } from '../providers/TRPCApiClientProvider';

export function AttendeeProfileScreen(props: { id: string }) {
  const { id } = props;
  const t = useTranslation();
  const api = useApiClient();
  const {
    data: profile,
    isLoading,
    error,
  } = api.network.getUserProfile.useQuery({ id });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !profile) {
    return <LoadingIndicator />;
  }
  const { name, profilePhoto, company, jobTitle, sections } = profile;
  const social = {
    socialLinkedIn: { label: 'LinkedIn', icon: IconLinkedin },
    socialTwitter: { label: 'Twitter', icon: IconTwitter },
    socialBlog: { label: 'Blog', icon: IconGlobe },
    socialOther: { label: 'Other', icon: IconLink },
  };
  return (
    <ScrollView>
      <YStack p={16} gap={16}>
        <XStack gap={12}>
          <Avatar circular size="$6">
            <Avatar.Image src={profilePhoto} />
            <Avatar.Fallback bg="#999" jc="center" ai="center">
              <User />
            </Avatar.Fallback>
          </Avatar>
          <YStack flex={1} gap={4}>
            <Paragraph fos={16} fow="600" lh={22}>
              {name}
            </Paragraph>
            <Paragraph fos={14} lh={20} numberOfLines={1}>
              {t('{jobTitle} @ {company}', { jobTitle, company })}
            </Paragraph>
            <XStack py={4} gap={10}>
              {Object.entries(social).map(([key, { icon: Icon }]) => {
                const url = profile[key];
                return url ? (
                  <Anchor href={url} asChild>
                    <Icon />
                  </Anchor>
                ) : null;
              })}
            </XStack>
          </YStack>
        </XStack>
        {sections.map(({ key, title, content }) => {
          return content ? (
            <YStack key={key} gap={8}>
              <Paragraph>{title}</Paragraph>
              <Paragraph fos={14} lh={20} col="#cfcfcf">
                {content}
              </Paragraph>
            </YStack>
          ) : null;
        })}
      </YStack>
    </ScrollView>
  );
}
