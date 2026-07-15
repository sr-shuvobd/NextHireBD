'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DashboardRouter() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        const u = session.user as any;
        const role = u.role || 'seeker';
        router.push(`/dashboard/${role}`);
      } else {
        router.push('/login');
      }
    }
  }, [session, isPending, router]);

  return (
    <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
      <span>Redirecting to your dashboard...</span>
    </div>
  );
}
