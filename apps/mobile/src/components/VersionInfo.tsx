import { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import * as Updates from 'expo-updates';

import { VersionInfoView } from '@pkg/ui';
import type { UpdateState } from '@pkg/ui';

import { appVersion } from '~/support/constants';

const MIN_CHECK_INTERVAL = 1000 * 60 * 2;

async function updateAndReload() {
  await Updates.fetchUpdateAsync();
  await Updates.reloadAsync();
}

export function VersionInfo() {
  const navigation = useNavigation();
  const [state, setState] = useState<UpdateState>({ type: 'IDLE' });
  // Keep a copy of the state in a ref for use below
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const lastCheckedRef = useRef(0);

  useEffect(() => {
    const check = () => {
      const state = stateRef.current;
      if (state.type === 'CHECKING' || state.type === 'DOWNLOADING') {
        return;
      }
      if (Date.now() - lastCheckedRef.current < MIN_CHECK_INTERVAL) {
        return;
      }
      lastCheckedRef.current = Date.now();
      Updates.checkForUpdateAsync()
        .then((update) => {
          if (update.isAvailable) {
            setState({ type: 'DOWNLOADING' });
            // Returning this promise ensures we will catch any error below
            return updateAndReload();
          } else {
            setState({ type: 'IDLE' });
          }
        })
        .catch((ex) => {
          const error = ex instanceof Error ? ex : new Error(String(ex));
          setState({ type: 'ERROR', error });
        });
    };

    if (__DEV__) {
      return;
    }

    check();

    return navigation.addListener('focus', () => check());
  }, [navigation]);

  return (
    <VersionInfoView
      version={appVersion}
      state={state}
      onPress={() => {
        if (state.type !== 'IDLE') {
          return;
        }
        Updates.checkForUpdateAsync()
          .then((update) => {
            Alert.alert('Update Check', JSON.stringify(update, null, 2));
            if (update.isAvailable) {
              setState({ type: 'DOWNLOADING' });
              // Returning this promise ensures we will catch any error below
              return updateAndReload();
            } else {
              setState({ type: 'IDLE' });
            }
          })
          .catch((ex) => {
            const error = ex instanceof Error ? ex : new Error(String(ex));
            setState({ type: 'ERROR', error });
          });
      }}
    />
  );
}
