import { useEffect, useMemo, useState } from 'react';
import { Avatar, Paragraph, ScrollView, View, XStack, YStack } from 'tamagui';

import { useTranslation } from '@pkg/support';

import { ErrorView } from '../components/ErrorView';
import { getBestPhoto } from '../components/getBestPhoto';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { PageHeader } from '../components/PageHeader';
import { PageHeaderSm } from '../components/PageHeaderSm';
import { TabView } from '../components/TabView';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

type Props = {
  onPressSession: (sessionId: number) => void;
};

export function ScheduleScreen(props: Props) {
  const { onPressSession } = props;
  const { safeAreaInsets } = useConfig();
  const t = useTranslation();
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSessions.useQuery();
  const pages = useMemo(() => {
    const array = data ?? [];
    const byDate: Record<string, typeof array> = {};
    for (const session of array) {
      const { date } = session.attributes;
      const array = byDate[date] ?? (byDate[date] = []);
      array.push(session);
    }
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  }, [data]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  useEffect(() => {
    const firstPage = pages[0];
    setActiveTab(firstPage ? firstPage[0] : null);
  }, [pages]);
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return (
    <YStack flex={1} pt={safeAreaInsets.top}>
      <PageHeaderSm pb={0}>{t('Schedule')}</PageHeaderSm>
      <PageHeader pt={0}>{formatDate(activeTab ?? '')}</PageHeader>
      <TabView
        activeTabId={activeTab ?? ''}
        onTabChange={(id) => setActiveTab(id)}
        tabs={pages.map(([date, sessions]) => ({
          id: date,
          title: toDayOfWeek(date),
          content: (
            <ScrollView
              contentContainerStyle={{
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              {sessions.map((session, index) => {
                const { id, attributes } = session;
                const { timeSlot, typeDescription, title, description } =
                  attributes;
                const presenters = attributes.presenters.data;
                const firstPresenter = presenters[0];
                const presenterPhoto = firstPresenter
                  ? getBestPhoto(
                      firstPresenter.attributes.profilePhoto.data.attributes,
                    )
                  : null;
                return (
                  <XStack
                    key={id}
                    px={16}
                    gap={12}
                    onPress={() => onPressSession(id)}
                  >
                    <YStack ai="center" pt={3} gap={8}>
                      <View
                        w={12}
                        h={12}
                        borderRadius={12}
                        borderWidth={2}
                        borderColor="#414141"
                      />
                      {index < sessions.length - 1 ? (
                        <View f={1} width={2} bg="#414141" mb={8} />
                      ) : null}
                    </YStack>
                    <YStack f={1} gap={4}>
                      <Paragraph
                        fos={12}
                        fow="600"
                        lh={18}
                        col="#A0A0A0"
                        tt="uppercase"
                      >
                        {timeSlot}
                      </Paragraph>
                      {typeDescription ? (
                        <Paragraph
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
                      <XStack gap={12}>
                        {presenterPhoto ? (
                          <YStack py={8}>
                            <Avatar circular size={48}>
                              <Avatar.Image src={presenterPhoto} />
                            </Avatar>
                          </YStack>
                        ) : null}
                        <YStack f={1} gap={4}>
                          <Paragraph fos={16} fow="600" lh={22}>
                            {title}
                          </Paragraph>
                          {presenters.length ? (
                            <Paragraph col="#cfcfcf" fos={14} lh={20} mb={24}>
                              {presenters
                                .map((presenter) => presenter.attributes.name)
                                .join(', ')}
                            </Paragraph>
                          ) : (
                            <Paragraph
                              col="#cfcfcf"
                              fos={14}
                              lh={20}
                              mb={24}
                              numberOfLines={2}
                            >
                              {description}
                            </Paragraph>
                          )}
                        </YStack>
                      </XStack>
                    </YStack>
                  </XStack>
                );
              })}
            </ScrollView>
          ),
        }))}
      />
    </YStack>
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

function toDayOfWeek(dateStr: string): string {
  const [year = '', month = '', day = ''] = (dateStr.split('T')[0] ?? '').split(
    '-',
  );
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  return formatter.format(date);
}
