import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { LogoutButton } from '@/components/auth/logout-button';
import { ThemeTracker } from '@/components/theme-tracker';
import { Book, Building, BuildingIcon, Computer, FlaskConical, FolderGit2 } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeTracker /> 
      <DocsLayout 
        tree={source.getPageTree()} 
        {...baseOptions()}
        sidebar={{
          tabs: [
            {
              title: 'Overview',
              icon: <Building />,
              description: 'Syllabus & Course Info',
              url: '/docs',
            },
            {
              title: 'Core',
              icon: <Book />,
              description: 'Theoretical subjects',
              url: '/docs/core',
            },
            {
              title: 'Labs',
              icon: <FlaskConical />,
              description: 'Practical lab records',
              url: '/docs/labs',
            },
            {
              title: 'Projects',
              icon: <FolderGit2 />,
              description: 'Semester builds',
              url: '/docs/projects',
            }
          ],
          footer: <LogoutButton key="logout-btn" /> 
        }}
      >
        {children}
      </DocsLayout>
    </>
  );
}