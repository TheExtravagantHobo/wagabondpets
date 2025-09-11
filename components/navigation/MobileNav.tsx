// components/navigation/MobileNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  Heart,
  User,
  PawPrint
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Records', href: '/dashboard/records', icon: FileText },
  { name: 'Share', href: '/dashboard/share', icon: PawPrint, isSpecial: true },
  { name: 'Health', href: '/dashboard/health', icon: Heart },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            if (item.isSpecial) {
              // Special center button (Share/QR)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative -top-2"
                >
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex items-center justify-center",
                      "w-14 h-14 rounded-full",
                      "bg-gradient-to-r from-blue-500 to-purple-600",
                      "shadow-lg transform transition-transform",
                      "hover:scale-105 active:scale-95"
                    )}>
                      <item.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs mt-1 text-gray-600 font-medium">
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            }
  
            // Keep the regular button code exactly as it was
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "w-16 h-full",
                  "transition-colors",
                  isActive 
                    ? "text-blue-600" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <item.icon 
                  className="h-5 w-5" 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn(
                  "text-xs mt-1",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}