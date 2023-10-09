import { useState } from 'react';

import { useTranslation } from '@pkg/support';

import { TabView } from '../components/TabView';
import { MyMatches } from './MyMatches';
import { MyProfile } from './MyProfile';

export function AuthenticatedNetworkScreen() {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('my-profile');
  return (
    <TabView
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id)}
      tabs={[
        {
          id: 'my-profile',
          title: t('My Profile'),
          content: <MyProfile />,
        },
        {
          id: 'my-matches',
          title: t('My Matches'),
          content: <MyMatches />,
        },
      ]}
    />
  );
}
