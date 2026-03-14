import { Outlet } from 'react-router';
import { Header } from '@/app/components/header';
import { Toaster } from '@/app/components/ui/sonner';

export function Root() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}
