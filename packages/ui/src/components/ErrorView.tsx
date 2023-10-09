import { Paragraph, YStack } from 'tamagui';

export function ErrorView(props: { error: unknown }) {
  const maybeError = props.error;
  const error =
    maybeError instanceof Error ? maybeError : new Error(String(maybeError));
  return (
    <YStack flex={1} p={16} justifyContent="center" alignItems="center">
      <Paragraph>{String(error)}</Paragraph>
    </YStack>
  );
}
