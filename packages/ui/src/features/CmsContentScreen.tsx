import type { ReactNode } from 'react';
import { ScrollView } from 'tamagui';

import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

type Props = {
  slug: string;
  renderTitle: (title: string) => ReactNode;
};

export function CmsContentScreen(props: Props) {
  const { safeAreaInsets } = useConfig();
  const { slug, renderTitle } = props;
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug,
  });
  if (error) {
    return (
      <>
        {renderTitle('Error')}
        <ErrorView error={error} />
      </>
    );
  }
  if (isLoading || !data) {
    return (
      <>
        {renderTitle('')}
        <LoadingIndicator />
      </>
    );
  }
  return (
    <>
      {renderTitle(data.attributes.title ?? '')}
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: Math.max(safeAreaInsets.bottom, 16),
        }}
      >
        <MarkdownView markdown={data.attributes.content} />
      </ScrollView>
    </>
  );
}
