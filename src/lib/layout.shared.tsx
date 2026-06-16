import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { BrandIcon } from '@/components/BrandIcon';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,

    links: [
      {
        type: 'icon',
        text: 'Discord',
        label: 'Join our Discord',
        icon: <BrandIcon iconName="siDiscord" />,
        url: 'https://discord.gg/dicord-invite-link',
      }
    ]
  };
}
