import { Fragment } from 'react';
import { ArrowUpRight, Footprints } from '@tamagui/lucide-icons';
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
import { PageHeader } from '../components/PageHeader';
import { PageHeaderSm } from '../components/PageHeaderSm';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

export function NearbyScreen() {
  const { safeAreaInsets } = useConfig();
  const t = useTranslation();
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getLocalPlaces.useQuery();
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  const byCategory: Record<string, typeof data> = {};
  for (const venue of data) {
    const { category } = venue.attributes;
    const array = byCategory[category] ?? (byCategory[category] = []);
    array.push(venue);
  }
  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: Math.max(safeAreaInsets.bottom - 16, 0),
      }}
    >
      <PageHeaderSm pb={0}>{t('Nearby')}</PageHeaderSm>
      {Object.entries(byCategory).map(([category, venues], index) => (
        <Fragment key={index}>
          <PageHeader pt={0}>{category}</PageHeader>
          {venues.map((venue, index) => {
            const { id, attributes } = venue;
            const { name, caption, distance, description, link } = attributes;
            const photoUrl = getBestPhoto(attributes.photo.data.attributes);
            return (
              <Fragment key={id}>
                {index === 0 ? null : <Divider />}
                <YStack px={16} gap={8}>
                  <Image
                    aspectRatio={1.8}
                    resizeMode="cover"
                    source={{ uri: photoUrl }}
                  />
                  <View height={4} />
                  <XStack gap={10}>
                    <Paragraph
                      tt="uppercase"
                      fos={12}
                      fow="600"
                      lh={18}
                      col="#A0A0A0"
                    >
                      {caption}
                    </Paragraph>
                    {distance ? (
                      <XStack gap={4} ai="center">
                        <Footprints size={14} color="#A0A0A0" />
                        <Paragraph
                          tt="uppercase"
                          fos={12}
                          fow="600"
                          lh={18}
                          col="#A0A0A0"
                        >
                          {distance}
                        </Paragraph>
                      </XStack>
                    ) : null}
                  </XStack>
                  <YStack gap={4}>
                    <Paragraph fos={16} fow="600" lh={22}>
                      {name}
                    </Paragraph>
                    <Paragraph fos={14} lh={20} col="#CFCFCF">
                      {description}
                    </Paragraph>
                  </YStack>
                  <Anchor href={link} target="_blank">
                    <XStack ai="center" gap={4}>
                      <ArrowUpRight size={20} color="#436EFF" />
                      <Paragraph fos={14} lh={20} fow="600" color="#436EFF">
                        {t('Open in Maps')}
                      </Paragraph>
                    </XStack>
                  </Anchor>
                </YStack>
              </Fragment>
            );
          })}
          <View h={16} />
        </Fragment>
      ))}
    </ScrollView>
  );
}
