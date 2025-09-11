// app/(dashboard)/layout.tsx
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import MobileNav from '@/components/navigation/MobileNav';
import TopBar from '@/components/navigation/TopBar';
import { PetProvider } from '@/contexts/PetContext';
import { Toaster } from 'sonner';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <PetProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - Mobile and Desktop */}
        <TopBar />
        
        {/* Main Content */}
        <main className="pb-20 md:pb-0 pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        {/* Bottom Navigation - Mobile Only */}
        <MobileNav />
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: 'font-medium',
          }}
        />
      </div>
    </PetProvider>
  );
}