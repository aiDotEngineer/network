import type { ReactNode } from 'react';
import { ScrollView } from 'tamagui';

import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

type Props = {
  children?: ReactNode;
};

export function InfoScreen(props: Props) {
  const { safeAreaInsets } = useConfig();
  const { children } = props;
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getConference.useQuery();
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
        paddingBottom: Math.max(safeAreaInsets.bottom, 16),
      }}
    >
      <MarkdownView markdown={data.attributes.about} />
      {children}
    </ScrollView>
  );
}
