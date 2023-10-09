import { useState } from 'react';
import {
  Button,
  Input,
  Paragraph,
  ScrollView,
  Spinner,
  TextArea,
  YStack,
} from 'tamagui';
import type { InputProps } from 'tamagui';

import type { RouterOutputs } from '@pkg/api';
import { useTranslation } from '@pkg/support';

import { ErrorView } from '../components/ErrorView';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { MarkdownView } from '../components/MarkdownView';
import { useApiClient } from '../providers/TRPCApiClientProvider';
import { useConfig } from '../support/useConfig';

type FromArray<T> = T extends Array<infer U> ? U : never;

type Profile = RouterOutputs['network']['getProfile'];
type Field = FromArray<Profile['profileFields']>;

function MyProfileForm(props: { profile: Profile }) {
  const { profile } = props;
  const [values, setValues] = useState(() => new Map<string, string>());
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const api = useApiClient();
  const { mutate: saveProfile, isLoading } =
    api.network.saveProfile.useMutation({
      onError: (error) => {
        setShowMessage(String(error));
      },
      onSuccess: () => {
        setShowMessage(t('Saved!'));
      },
    });
  const t = useTranslation();
  const save = () => {
    const fromFields = (fields: Array<Field>) => {
      return fields.map((field) => ({
        key: field.key,
        answer: values.get(field.key) ?? field.answer,
      }));
    };
    saveProfile({
      profileFields: fromFields(profile.profileFields),
      surveyAnswers: fromFields(profile.surveyAnswers),
    });
  };
  if (showMessage) {
    return (
      <YStack p={16} gap={16}>
        <Paragraph ta="center">{showMessage}</Paragraph>
        <Button onPress={() => setShowMessage(null)}>{t('OK')}</Button>
      </YStack>
    );
  }
  const renderField = (field: Field) => {
    const { key, type, label, answer, viewState } = field;
    if (viewState === 'HIDDEN') {
      return null;
    }
    return (
      <YStack key={key}>
        <Paragraph>{label}</Paragraph>
        <TextInput
          multiline={type === 'LONG_TEXT'}
          value={values.get(key) ?? answer}
          onChangeText={(newValue) => {
            const newValues = new Map(values);
            newValues.set(key, newValue);
            setValues(newValues);
          }}
          maxHeight={138}
        />
      </YStack>
    );
  };
  return (
    <YStack py={16} gap={16}>
      <MyProfileIntro />
      <YStack px={16} gap={16}>
        {profile.profileFields.map((field) => renderField(field))}
        {profile.surveyAnswers.map((field) => renderField(field))}
        <Button
          icon={isLoading ? () => <Spinner /> : undefined}
          disabled={isLoading}
          onPress={() => save()}
        >
          {t('Save')}
        </Button>
      </YStack>
    </YStack>
  );
}

function MyProfileIntro() {
  const api = useApiClient();
  const { data, isLoading, error } = api.content.getSinglePage.useQuery({
    slug: 'my-profile-intro',
  });
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !data) {
    return <LoadingIndicator />;
  }
  return <MarkdownView markdown={data.attributes.content} />;
}

export function MyProfile() {
  const { os } = useConfig();
  const api = useApiClient();
  const {
    data: profile,
    isLoading,
    error,
  } = api.network.getProfile.useQuery(undefined);
  if (error) {
    return <ErrorView error={error} />;
  }
  if (isLoading || !profile) {
    return <LoadingIndicator />;
  }
  return (
    <ScrollView
      keyboardDismissMode={os === 'ios' ? 'interactive' : 'on-drag'}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingBottom: os === 'ios' ? 300 : 0,
      }}
    >
      <MyProfileForm profile={profile} />
    </ScrollView>
  );
}

function TextInput(props: InputProps & { multiline: boolean }) {
  const { multiline, ...otherProps } = props;
  return multiline ? <TextArea {...otherProps} /> : <Input {...otherProps} />;
}
