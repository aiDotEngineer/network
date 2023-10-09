import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  Button,
  Form,
  Input,
  Paragraph,
  ScrollView,
  Spinner,
  View,
  XStack,
  YStack,
} from 'tamagui';

import { useTranslation } from '@pkg/support';

import { DropdownMenu } from '../components/DropdownMenu';
import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { getAuthToken, setAuthToken } from '../support/auth';
import { useConfig } from '../support/useConfig';
import { useLocalStorage } from '../support/useLocalStorage';
import { AuthenticatedNetworkScreen } from './AuthenticatedNetworkScreen';

type User = {
  id: string;
  name: string;
  email: string;
};

type LoginState =
  | { state: 'initializing' }
  | { state: 'init-error'; error: Error }
  | { state: 'logged-out' }
  | { state: 'email-sent' }
  | { state: 'awaiting-otp'; id: string }
  | { state: 'logged-in'; user: User };

function LoginForm(props: {
  onSuccess: (id: string, emailSent?: boolean) => void;
}) {
  const { onSuccess } = props;
  const { os } = useConfig();
  const [emailAddress, setEmailAddress] = useState('');
  const [error, setError] = useState('');
  const t = useTranslation();
  const api = useApiClient();
  const { mutate: initLogin, isLoading } = api.network.initLogin.useMutation({
    onError: (error) => {
      setError(String(error));
    },
    onSuccess: (result) => {
      if (result.success) {
        onSuccess(result.id, result.emailSent);
      } else {
        setError(result.errorMessage);
      }
    },
  });
  const onSubmit = () => {
    initLogin({ email: emailAddress });
  };
  return (
    <ScrollView
      keyboardDismissMode={os === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
    >
      <Form py={16} onSubmit={onSubmit}>
        <CmsContent slug="network-form-intro" />
        <YStack px={16} pt={16} gap={16}>
          <YStack gap={8}>
            {error ? <Paragraph>{String(error)}</Paragraph> : null}
            <Input
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder={t('Enter your email address')}
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={onSubmit}
              autoFocus={true}
              disabled={isLoading}
              autoCapitalize="none"
              autoCorrect={false}
              fos={14}
            />
          </YStack>
          <Button
            icon={isLoading ? () => <Spinner /> : undefined}
            disabled={isLoading}
            onPress={onSubmit}
          >
            {t('Continue')}
          </Button>
        </YStack>
      </Form>
    </ScrollView>
  );
}

function CmsContent(props: { slug: string }) {
  const { slug } = props;
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug,
  });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return <MarkdownView markdown={data.attributes.content} />;
}

function OtpForm(props: {
  id: string;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}) {
  const { os } = useConfig();
  const { id, onSuccess, onCancel } = props;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const t = useTranslation();
  const api = useApiClient();
  const { mutate: completeLogin, isLoading } =
    api.network.completeLogin.useMutation({
      onError: (error) => {
        setError(String(error));
      },
      onSuccess: (result) => {
        if (result.success) {
          const { session } = result;
          setAuthToken(session.token);
          onSuccess(result.session.user);
        } else {
          setError(t('Verification code is invalid'));
        }
      },
    });
  const onSubmit = () => {
    completeLogin({ id, code });
  };
  return (
    <ScrollView
      keyboardDismissMode={os === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
    >
      <Form onSubmit={onSubmit}>
        <YStack p={16} gap={16}>
          <Paragraph>
            {t(
              'A verification code has been sent to your email address. Please enter the code below.',
            )}
          </Paragraph>
          <YStack gap={8}>
            {error ? <Paragraph>{String(error)}</Paragraph> : null}
            <Input
              value={code}
              onChangeText={setCode}
              placeholder={t('Enter verification code')}
              keyboardType="number-pad"
              onSubmitEditing={onSubmit}
              autoFocus={true}
              disabled={isLoading}
              fos={14}
            />
          </YStack>
          <XStack gap={16} jc="flex-end">
            <Button onPress={onCancel}>{t('Cancel')}</Button>
            <Button
              icon={isLoading ? () => <Spinner /> : undefined}
              disabled={isLoading}
              onPress={onSubmit}
            >
              {t('Continue')}
            </Button>
          </XStack>
        </YStack>
      </Form>
    </ScrollView>
  );
}

function NetworkScreenContent() {
  const { safeAreaInsets } = useConfig();
  const token = getAuthToken() ?? '';
  const [loginState, setLoginState] = useState<LoginState>(() => {
    return token ? { state: 'initializing' } : { state: 'logged-out' };
  });
  const api = useApiClient();
  const { refetch } = api.network.getUserByToken.useQuery(
    { token },
    {
      enabled: loginState.state === 'initializing',
      refetchInterval: false,
      onError: (error) => {
        setLoginState({
          state: 'init-error',
          error: error instanceof Error ? error : new Error(String(error)),
        });
      },
      onSuccess(user) {
        if (user === null) {
          setLoginState({ state: 'logged-out' });
        } else {
          setLoginState({ state: 'logged-in', user });
        }
      },
    },
  );
  const t = useTranslation();
  const renderContent = (): ReactElement => {
    switch (loginState.state) {
      case 'initializing': {
        return <LoadingIndicator />;
      }
      case 'init-error': {
        return (
          <YStack p={16} gap={16}>
            <Paragraph>{String(loginState.error)}</Paragraph>
            <Button
              onPress={() => {
                setLoginState({ state: 'initializing' });
                setTimeout(() => {
                  void refetch();
                }, 500);
              }}
            >
              {t('Retry')}
            </Button>
          </YStack>
        );
      }
      case 'logged-out': {
        return (
          <LoginForm
            onSuccess={(id, emailSent) => {
              if (emailSent) {
                setLoginState({ state: 'email-sent' });
              } else {
                setLoginState({ state: 'awaiting-otp', id });
              }
            }}
          />
        );
      }
      case 'email-sent': {
        return (
          <YStack py={16} gap={16}>
            <CmsContent slug="email-sent" />
            <YStack px={16}>
              <Button onPress={() => setLoginState({ state: 'logged-out' })}>
                {t('Continue')}
              </Button>
            </YStack>
          </YStack>
        );
      }
      case 'awaiting-otp': {
        return (
          <OtpForm
            id={loginState.id}
            onSuccess={(user) => {
              setLoginState({ state: 'logged-in', user });
            }}
            onCancel={() => {
              setAuthToken(null);
              setLoginState({ state: 'logged-out' });
            }}
          />
        );
      }
      case 'logged-in': {
        return <AuthenticatedNetworkScreen />;
      }
    }
  };
  return (
    <YStack flex={1} pt={safeAreaInsets.top}>
      <XStack ai="center" px={8}>
        <View width={42} />
        <Paragraph flex={1} fos={16} fow="600" lh={22} p={16} ta="center">
          {t('Network')}
        </Paragraph>
        <DropdownMenu
          items={[
            loginState.state === 'logged-in'
              ? {
                  key: 'logout',
                  label: t('Logout'),
                  onClick: () => {
                    setAuthToken(null);
                    setLoginState({ state: 'logged-out' });
                  },
                }
              : null,
          ]}
        />
      </XStack>
      {renderContent()}
    </YStack>
  );
}

export function AgreementView(props: { onAgree: () => void }) {
  const { onAgree } = props;
  const { safeAreaInsets } = useConfig();
  const t = useTranslation();
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug: 'network-welcome',
  });
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
      <MarkdownView markdown={data.attributes.content} />
      <YStack p={16}>
        <Button onPress={onAgree}>{t('Agree')}</Button>
      </YStack>
    </ScrollView>
  );
}

export function NetworkScreen() {
  const agreeKey = 'hasAgreedToMatching';
  const localStorage = useLocalStorage();
  const [agreed, setAgreed] = useState(() => {
    return localStorage.getItem(agreeKey) === 'true';
  });
  if (agreed) {
    return <NetworkScreenContent />;
  } else {
    return (
      <AgreementView
        onAgree={() => {
          localStorage.setItem(agreeKey, 'true');
          setAgreed(true);
        }}
      />
    );
  }
}
