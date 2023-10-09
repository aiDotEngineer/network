import { User } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { Avatar, Paragraph, ScrollView, XStack, YStack } from 'tamagui';

import { useTranslation } from '@pkg/support';

import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';

export function MyMatches() {
  const t = useTranslation();
  const api = useApiClient();
  const { data, isLoading, error } = api.network.getMatches.useQuery();
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return (
    <ScrollView>
      <YStack py={16} gap={16}>
        <MyMatchesIntro />
        <YStack px={16} gap={16}>
          {data.map((attendee) => {
            const { id, name, company, jobTitle, career, profilePhoto } =
              attendee;
            return (
              <XStack
                key={id}
                gap={12}
                onPress={() => router.push(`/attendees/${id}`)}
              >
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
                  <Paragraph fos={14} lh={20} col="#cfcfcf" numberOfLines={2}>
                    {career}
                  </Paragraph>
                </YStack>
              </XStack>
            );
          })}
        </YStack>
      </YStack>
    </ScrollView>
  );
}

function MyMatchesIntro() {
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug: 'my-matches-intro',
  });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return <MarkdownView markdown={data.attributes.content} />;
}
