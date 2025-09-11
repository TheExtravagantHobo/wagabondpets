// components/navigation/TopBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { ChevronDown, Plus, Dog, Cat, PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePets } from '@/contexts/PetContext';
import Link from 'next/link';

const getPageTitle = (pathname: string) => {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.includes('/records')) return 'Health Records';
  if (pathname.includes('/share')) return 'Share Records';
  if (pathname.includes('/health')) return 'Health Insights';
  if (pathname.includes('/profile')) return 'Profile';
  if (pathname.includes('/pets')) return 'My Pets';
  return 'Wagabond';
};

const getPetIcon = (species: string) => {
  switch (species) {
    case 'DOG': return Dog;
    case 'CAT': return Cat;
    default: return PawPrint;
  }
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { pets, selectedPet, selectPet, isLoading } = usePets();
  const [showPetMenu, setShowPetMenu] = useState(false);
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = () => setShowPetMenu(false);
    if (showPetMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showPetMenu]);

  const PetIcon = selectedPet ? getPetIcon(selectedPet.species) : PawPrint;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo/Title on Desktop, Pet Switcher on Mobile */}
          <div className="flex items-center space-x-4">
            {/* Desktop Logo */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Wagabond</span>
            </div>

            {/* Mobile Pet Switcher */}
            <div className="md:hidden">
              {pets.length > 0 ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPetMenu(!showPetMenu);
                    }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <PetIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium">
                      {isLoading ? 'Loading...' : selectedPet?.name || 'Select Pet'}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-gray-500 transition-transform",
                      showPetMenu && "rotate-180"
                    )} />
                  </button>

                  {/* Pet Dropdown Menu */}
                  {showPetMenu && (
                    <div className="absolute top-14 left-4 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] max-h-[400px] overflow-y-auto">
                      {pets.map((pet) => {
                        const Icon = getPetIcon(pet.species);
                        return (
                          <button
                            key={pet.id}
                            onClick={() => {
                              selectPet(pet);
                              setShowPetMenu(false);
                            }}
                            className={cn(
                              "w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50",
                              selectedPet?.id === pet.id && "bg-blue-50"
                            )}
                          >
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{pet.name}</div>
                              {pet.breed && (
                                <div className="text-xs text-gray-500">{pet.breed}</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setShowPetMenu(false);
                          router.push('/dashboard/pets');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-gray-600"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                          <PawPrint className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Manage Pets</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPetMenu(false);
                          router.push('/dashboard/pets/new');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-blue-600"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">Add Pet</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push('/dashboard/pets/new')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Add Pet</span>
                </button>
              )}
            </div>
          </div>

          {/* Center: Page Title on Mobile */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <h1 className="font-semibold text-gray-900">{pageTitle}</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className={cn(
              "text-sm font-medium transition-colors",
              pathname === '/dashboard' ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            )}>
              Dashboard
            </Link>
            <Link href="/dashboard/records" className={cn(
              "text-sm font-medium transition-colors",
              pathname.includes('/records') ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            )}>
              Records
            </Link>
            <Link href="/dashboard/share" className={cn(
              "text-sm font-medium transition-colors",
              pathname.includes('/share') ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            )}>
              Share
            </Link>
            <Link href="/dashboard/health" className={cn(
              "text-sm font-medium transition-colors",
              pathname.includes('/health') ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            )}>
              Health
            </Link>
            <Link href="/dashboard/pets" className={cn(
              "text-sm font-medium transition-colors",
              pathname.includes('/pets') ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            )}>
              Pets
            </Link>
          </nav>

          {/* Right: User Button and Desktop Pet Switcher */}
          <div className="flex items-center space-x-4">
            {/* Desktop Pet Switcher */}
            <div className="hidden md:block">
              {pets.length > 0 ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPetMenu(!showPetMenu);
                    }}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <PetIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium">
                      {isLoading ? 'Loading...' : selectedPet?.name || 'Select Pet'}
                    </span>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-gray-500 transition-transform",
                      showPetMenu && "rotate-180"
                    )} />
                  </button>

                  {/* Desktop Pet Dropdown */}
                  {showPetMenu && (
                    <div className="absolute top-14 right-20 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] max-h-[400px] overflow-y-auto">
                      {pets.map((pet) => {
                        const Icon = getPetIcon(pet.species);
                        return (
                          <button
                            key={pet.id}
                            onClick={() => {
                              selectPet(pet);
                              setShowPetMenu(false);
                            }}
                            className={cn(
                              "w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50",
                              selectedPet?.id === pet.id && "bg-blue-50"
                            )}
                          >
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{pet.name}</div>
                              {pet.breed && (
                                <div className="text-xs text-gray-500">{pet.breed}</div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setShowPetMenu(false);
                          router.push('/dashboard/pets');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-gray-600"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                          <PawPrint className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Manage Pets</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowPetMenu(false);
                          router.push('/dashboard/pets/new');
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-blue-600"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">Add Pet</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push('/dashboard/pets/new')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Add Pet</span>
                </button>
              )}
            </div>

            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}