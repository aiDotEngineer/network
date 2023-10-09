import { Fragment, useMemo } from 'react';
import { ArrowUpRight } from '@tamagui/lucide-icons';
import {
  Anchor,
  Image,
  Paragraph,
  ScrollView,
  View,
  XStack,
  YStack,
} from 'tamagui';

import { useTranslation } from '@pkg/support';

import { Divider } from '../components/Divider';
import { ErrorView } from '../components/ErrorView';
import { getBestPhoto } from '../components/getBestPhoto';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { PageHeader } from '../components/PageHeader';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

export function ExpoScreen() {
  const { safeAreaInsets } = useConfig();
  const t = useTranslation();
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getExhibitors.useQuery();

  const levels = {
    PRESENTING_SPONSOR: {
      order: 1,
      labelSingular: t('Presenting Sponsor'),
      labelPlural: t('Presenting Sponsors'),
    },
    DIAMOND_SPONSOR: {
      order: 2,
      labelSingular: t('Diamond Sponsor'),
      labelPlural: t('Diamond Sponsors'),
    },
    GOLD_SPONSOR: {
      order: 3,
      labelSingular: t('Gold Sponsor'),
      labelPlural: t('Gold Sponsors'),
    },
    SILVER_SPONSOR: {
      order: 4,
      labelSingular: t('Silver Sponsor'),
      labelPlural: t('Silver Sponsors'),
    },
    NONE: {
      order: 4,
      labelSingular: t('Exhibitor'),
      labelPlural: t('Exhibitors'),
    },
  };
  type Level = keyof typeof levels;

  const groups = useMemo(() => {
    const array = data ?? [];
    const byLevel: Partial<Record<Level, typeof array>> = {};
    for (const exhibitor of array) {
      const level = exhibitor.attributes.sponsorLevel ?? 'NONE';
      const array = byLevel[level] ?? (byLevel[level] = []);
      array.push(exhibitor);
    }
    return Object.entries(byLevel).sort(
      ([a], [b]) => levels[a].order - levels[b].order,
    );
  }, [data]);

  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: Math.max(16, safeAreaInsets.bottom),
      }}
    >
      <PageHeader pb={0}>{t('Expo')}</PageHeader>
      <YStack py={16}>
        <ExpoIntro />
      </YStack>
      {groups.map(([level, exhibitors]) => {
        const { labelSingular, labelPlural } = levels[level];
        return (
          <Fragment key={level}>
            <PageHeader pt={0}>
              {exhibitors.length === 1 ? labelSingular : labelPlural}
            </PageHeader>
            {exhibitors.map((exhibitor, index) => {
              const { id, attributes } = exhibitor;
              const { name, description, link, logoBgColor } = attributes;
              const logoUrl = getBestPhoto(attributes.logo.data.attributes);
              return (
                <Fragment key={id}>
                  {index === 0 ? null : <Divider />}
                  <YStack px={16} gap={8}>
                    <View p={16} backgroundColor={logoBgColor || 'white'}>
                      <Image
                        aspectRatio={2}
                        resizeMode="contain"
                        source={{ uri: logoUrl }}
                      />
                    </View>
                    <View height={4} />
                    <YStack gap={4}>
                      <Paragraph fos={16} fow="600" lh={22}>
                        {name}
                      </Paragraph>
                      <Paragraph
                        fos={14}
                        lh={20}
                        col="#CFCFCF"
                        numberOfLines={4}
                      >
                        {description}
                      </Paragraph>
                    </YStack>
                    <Anchor href={link} target="_blank">
                      <XStack ai="center" gap={4}>
                        <ArrowUpRight size={20} color="#436EFF" />
                        <Paragraph fos={14} lh={20} fow="600" color="#436EFF">
                          Learn More
                        </Paragraph>
                      </XStack>
                    </Anchor>
                  </YStack>
                </Fragment>
              );
            })}
            <View h={16} />
          </Fragment>
        );
      })}
    </ScrollView>
  );
}

function ExpoIntro() {
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug: 'expo-intro',
  });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return <MarkdownView markdown={data.attributes.content} />;
}
