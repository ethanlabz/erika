import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: LayoutProps<'/docs'>) {
  // 1. Initialize Supabase securely on the server
  const supabase = await createClient();

  // 2. Read the cookie and check the active session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. If no session exists, forcefully kick them out
  if (!user) {
    redirect('/login');
  }

  return (
      <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
        {children}
      </DocsLayout>
  );
}