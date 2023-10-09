import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Globe as IconGlobe,
  Instagram as IconInstagram,
  Link as IconLink,
  Linkedin as IconLinkedin,
  Slack as IconSlack,
  Twitter as IconTwitter,
  Youtube as IconYoutube,
} from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import type * as Ast from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { Anchor, Image, Paragraph, View, XStack, YStack } from 'tamagui';

const supportedIcons: Record<string, ComponentType<IconProps>> = {
  globe: IconGlobe,
  instagram: IconInstagram,
  link: IconLink,
  linkedin: IconLinkedin,
  slack: IconSlack,
  twitter: IconTwitter,
  youtube: IconYoutube,
};

export function MarkdownView(props: { markdown: string }) {
  const { markdown } = props;
  const parsed = useMemo(() => fromMarkdown(markdown), [markdown]);
  return (
    <YStack gap={12}>
      {parsed.children.map((node, index) => (
        <Block key={index} node={node} />
      ))}
    </YStack>
  );
}

function MdParagraph(props: { node: Ast.Paragraph }) {
  const { node } = props;
  return (
    <Paragraph px={16}>
      {node.children.map((node, index) => (
        <Inline key={index} node={node} />
      ))}
    </Paragraph>
  );
}

function MdHeading1(props: { node: Ast.Heading }) {
  const { node } = props;
  return (
    <Paragraph
      px={16}
      fontWeight="600"
      fontSize={12}
      lineHeight={18}
      letterSpacing={1.2}
      color="white"
      opacity={0.6}
      textTransform="uppercase"
    >
      {node.children.map((node, index) => (
        <Inline key={index} node={node} />
      ))}
    </Paragraph>
  );
}

function MdHeading2(props: { node: Ast.Heading }) {
  const { node } = props;
  return (
    <Paragraph px={16} fontWeight="600" fontSize={24} lineHeight={32}>
      {node.children.map((node, index) => (
        <Inline key={index} node={node} />
      ))}
    </Paragraph>
  );
}

function MdFullWidthImage(props: { node: Ast.Image }) {
  const { node } = props;
  const sourceUri = node.url;
  const [imageRatio, setImageRatio] = useState<number | null>(null);
  useEffect(() => {
    if (sourceUri) {
      Image.getSize(sourceUri, (width, height) => {
        setImageRatio(width / height);
      });
    }
  }, [sourceUri]);
  if (imageRatio === null) {
    return null;
  }
  return <Image aspectRatio={imageRatio} source={{ uri: sourceUri }} />;
}

function MdLinkList(props: { links: Array<Ast.Link> }) {
  const { links } = props;
  return (
    <XStack px={16} gap={12}>
      {links.map((link, index) => {
        const Icon = getIconForLink(link.title ?? '');
        return (
          <Anchor key={index} href={link.url}>
            <View bg="#212121" w={48} h={48} br={24} ai="center" jc="center">
              <Icon />
            </View>
          </Anchor>
        );
      })}
    </XStack>
  );
}

function Block(props: { node: Ast.RootContent }): ReactNode {
  const { node } = props;
  switch (node.type) {
    case 'paragraph': {
      const onlyChild = getOnlyChild(node.children);
      if (onlyChild?.type === 'image') {
        return <MdFullWidthImage node={onlyChild} />;
      }
      return <MdParagraph node={node} />;
    }
    case 'heading': {
      return node.depth === 1 ? (
        <MdHeading1 node={node} />
      ) : (
        <MdHeading2 node={node} />
      );
    }
    case 'blockquote': {
      // TODO: better styling
      return (
        <YStack
          ml={16}
          borderLeftColor="rgb(208, 215, 222)"
          borderLeftWidth={3.5}
          opacity={0.7}
        >
          {node.children.map((node, index) => (
            <Block key={index} node={node} />
          ))}
        </YStack>
      );
    }
    case 'list': {
      const links = onlyIconLinks(node.children);
      if (links) {
        return <MdLinkList links={links} />;
      }
      // TODO: Better styling
      return (
        <YStack px={16}>
          {node.children.map((node, index) => (
            <XStack key={index}>
              <Paragraph>•</Paragraph>
              <YStack key={index}>
                {node.children.map((node, index) => (
                  <Block key={index} node={node} />
                ))}
              </YStack>
            </XStack>
          ))}
        </YStack>
      );
    }
  }
  return null;
}

function Inline(props: { node: Ast.PhrasingContent }): ReactNode {
  const { node } = props;
  const parseLinkNode = (link: Ast.Link) => {
    const { url } = link;
    if (url.startsWith('/pages/')) {
      return {
        url: undefined,
        onPress: () => {
          router.push(url);
        },
      };
    }
    return { url, onPress: undefined };
  };
  switch (node.type) {
    case 'text': {
      return node.value;
    }
    case 'emphasis': {
      return (
        <Paragraph fontStyle="italic">
          {node.children.map((node, index) => (
            <Inline key={index} node={node} />
          ))}
        </Paragraph>
      );
    }
    case 'strong': {
      return (
        <Paragraph fontWeight="700">
          {node.children.map((node, index) => (
            <Inline key={index} node={node} />
          ))}
        </Paragraph>
      );
    }
    case 'link': {
      const { url, onPress } = parseLinkNode(node);
      return (
        <Anchor href={url} onPress={onPress} color="#436EFF">
          {node.children.map((node, index) => (
            <Inline key={index} node={node} />
          ))}
        </Anchor>
      );
    }
  }
  return null;
}

function onlyIconLinks(
  items: Array<Ast.ListItem>,
): Array<Ast.Link> | undefined {
  const iconLinks: Array<Ast.Link> = [];
  for (const item of items) {
    const maybeParagraph = getOnlyChild(item.children);
    if (maybeParagraph?.type !== 'paragraph') {
      return undefined;
    }
    const maybeLink = getOnlyChild(maybeParagraph.children);
    if (maybeLink?.type !== 'link') {
      return undefined;
    }
    const title = maybeLink.title ?? '';
    if (title.startsWith('icon:')) {
      iconLinks.push(maybeLink);
    } else {
      return undefined;
    }
  }
  return iconLinks;
}

function getOnlyChild<T>(children: Array<T>): T | undefined {
  return children.length === 1 ? children[0] : undefined;
}

function getIconForLink(title: string): ComponentType<IconProps> {
  const iconName = title.replace(/^icon:/, '');
  return supportedIcons[iconName] ?? IconLink;
}
