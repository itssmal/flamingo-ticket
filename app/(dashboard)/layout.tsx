import { createClient } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('error on getuser', userError);
    return null;
  }

  console.log('user', user);

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  if (!profile) {
    console.log('error on getprofile', error);
    return null;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar profile={profile} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar profile={profile} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
