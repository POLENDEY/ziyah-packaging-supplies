'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for admin session
    const session = localStorage.getItem('admin_session');
    
    if (session === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // Redirect to login if not authenticated and not already on the login page
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  // Prevent flicker of protected content
  if (isAuthenticated === null && pathname !== '/admin/login') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans)',
        color: 'var(--gray-500)'
      }}>
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}
