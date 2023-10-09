import { Paragraph } from 'tamagui';

import { useTranslation } from '@pkg/support';

export type UpdateState =
  | { type: 'IDLE' }
  | { type: 'CHECKING' }
  | { type: 'ERROR'; error: Error }
  | { type: 'DOWNLOADING' };

export function VersionInfoView(props: {
  version: string;
  state: UpdateState;
  onPress?: () => void;
}) {
  const { version, state, onPress } = props;
  const t = useTranslation();
  const getText = () => {
    switch (state.type) {
      case 'IDLE': {
        return t('Version {version}', { version });
      }
      case 'CHECKING': {
        return t('Checking for updates...');
      }
      case 'DOWNLOADING': {
        return t('Downloading update...');
      }
      case 'ERROR': {
        return String(state.error);
      }
    }
  };
  return (
    <Paragraph px={16} py={12} onPress={onPress}>
      {getText()}
    </Paragraph>
  );
}
