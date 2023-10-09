import type { ReactNode } from 'react';
import { Paragraph, Tabs } from 'tamagui';

type Tab = {
  id: string;
  title: string;
  content: ReactNode;
};

export function TabView(props: {
  tabs: Array<Tab>;
  activeTabId: string;
  onTabChange: (id: string) => void;
}) {
  const { tabs, activeTabId, onTabChange } = props;
  return (
    <Tabs
      value={activeTabId}
      onValueChange={(id) => onTabChange(id)}
      flex={1}
      fd="column"
    >
      <Tabs.List px={16} space={8} br={0} pb={8}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            value={tab.id}
            isActive={tab.id === activeTabId}
          >
            {tab.title}
          </TabButton>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Content key={tab.id} flex={1} value={tab.id}>
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs>
  );
}

function TabButton(props: {
  value: string;
  isActive: boolean;
  children: ReactNode;
}) {
  const { value, isActive, children } = props;
  return (
    <Tabs.Tab
      value={value}
      px={16}
      h={36}
      br={18}
      bg={isActive ? 'white' : '#212121'}
    >
      <Paragraph
        fos={14}
        lh={20}
        col={isActive ? '#111111' : 'white'}
        opacity={isActive ? 1 : 0.6}
      >
        {children}
      </Paragraph>
    </Tabs.Tab>
  );
}
