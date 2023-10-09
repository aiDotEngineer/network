import { MoreVertical } from '@tamagui/lucide-icons';
import { Button, Paragraph, Popover, View, YStack } from 'tamagui';

type Item = {
  key: string;
  label: string;
  onClick: () => void;
};

export function DropdownMenu(props: { items: Array<Item | null> }) {
  const items = props.items.filter((item): item is Item => item !== null);
  if (items.length === 0) {
    return <View width={42} />;
  }
  return (
    <Popover size="$5" allowFlip>
      <Popover.Trigger asChild>
        <Button size="$3" icon={MoreVertical} chromeless />
      </Popover.Trigger>
      <Popover.Content
        py={10}
        px={14}
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YStack>
          {items.map((item) => {
            return (
              <Popover.Close key={item.key} asChild>
                <Paragraph onPress={item.onClick}>{item.label}</Paragraph>
              </Popover.Close>
            );
          })}
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
