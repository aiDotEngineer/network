import type { ComponentType } from 'react';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Flame as IconExpo,
  Info as IconInfo,
  Navigation as IconNearby,
  UserPlus as IconNetwork,
  Calendar as IconSchedule,
} from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';

import { useTranslation } from '@pkg/support';

function TabIcon(props: {
  isFocused: boolean;
  icon: ComponentType<IconProps>;
}) {
  const { isFocused, icon: Icon } = props;
  return <Icon color={isFocused ? '#fff' : '#777'} />;
}

export default function TabLayout() {
  const t = useTranslation();
  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('Info'),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon isFocused={focused} icon={IconInfo} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t('Schedule'),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon isFocused={focused} icon={IconSchedule} />
          ),
        }}
      />
      <Tabs.Screen
        name="expo"
        options={{
          title: t('Expo'),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon isFocused={focused} icon={IconExpo} />
          ),
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: t('Nearby'),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon isFocused={focused} icon={IconNearby} />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: t('Network'),
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon isFocused={focused} icon={IconNetwork} />
          ),
        }}
      />
    </Tabs>
  );
}
