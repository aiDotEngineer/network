import { Calendar, Clock } from '@tamagui/lucide-icons';
import { Avatar, Paragraph, ScrollView, XStack, YStack } from 'tamagui';

import { ErrorView } from '../components/ErrorView';
import { getBestPhoto } from '../components/getBestPhoto';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';

type Props = {
  id: string;
};

export function SessionDetailsScreen(props: Props) {
  const { id } = props;
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSession.useQuery({ id });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  const { title, date, timeSlot, typeDescription, presenters, about } =
    data.attributes;
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <YStack gap={8}>
        {typeDescription ? (
          <Paragraph
            px={16}
            fontWeight="600"
            fontSize={12}
            lineHeight={18}
            letterSpacing={1.2}
            color="white"
            opacity={0.6}
            textTransform="uppercase"
          >
            {typeDescription}
          </Paragraph>
        ) : null}
        <Paragraph px={16} fontWeight="600" fontSize={24} lineHeight={32}>
          {title}
        </Paragraph>
        <YStack px={16} gap={2}>
          <XStack ai="center" gap={8}>
            <Calendar size={18} color="#cfcfcf" />
            <Paragraph col="#cfcfcf">{formatDate(date)}</Paragraph>
          </XStack>
          <XStack ai="center" gap={8}>
            <Clock size={18} color="#cfcfcf" />
            <Paragraph col="#cfcfcf">{timeSlot}</Paragraph>
          </XStack>
        </YStack>
        <MarkdownView markdown={about ?? ''} />
        <YStack p={16} gap={12}>
          {presenters.data.map((presenter) => {
            const photoUrl = getBestPhoto(
              presenter.attributes.profilePhoto.data.attributes,
            );
            return (
              <XStack key={presenter.id} gap={12}>
                <YStack py={8}>
                  <Avatar circular size={48}>
                    <Avatar.Image src={photoUrl} />
                  </Avatar>
                </YStack>
                <YStack f={1} gap={4}>
                  <Paragraph fos={16} fow="600" lh={22}>
                    {presenter.attributes.name}
                  </Paragraph>
                  <Paragraph
                    col="#cfcfcf"
                    fos={14}
                    lh={20}
                    mb={24}
                    numberOfLines={1}
                  >
                    {presenter.attributes.tagline}
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

function formatDate(dateStr: string): string {
  const [year = '', month = '', day = ''] = (dateStr.split('T')[0] ?? '').split(
    '-',
  );
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return formatter.format(date);
}
