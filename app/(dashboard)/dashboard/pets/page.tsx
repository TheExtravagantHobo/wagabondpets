// app/(dashboard)/dashboard/pets/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Dog, Cat, PawPrint, Edit2, Calendar, Weight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePets } from '@/contexts/PetContext';

const getPetIcon = (species: string) => {
  switch (species) {
    case 'DOG': return Dog;
    case 'CAT': return Cat;
    default: return PawPrint;
  }
};

const calculateAge = (birthDate: string | null) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  } else if (years === 1 && months < 0) {
    return `${12 + months} month${12 + months !== 1 ? 's' : ''} old`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} old`;
  }
};

export default function PetsPage() {
  const router = useRouter();
  const { pets, selectedPet, selectPet, refreshPets, isLoading } = usePets();

  useEffect(() => {
    refreshPets();
  }, []);

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-gray-600 mt-1">
            {pets.length === 0 
              ? "Add your first pet to get started"
              : `Managing ${pets.length} pet${pets.length > 1 ? 's' : ''}`
            }
          </p>
        </div>
        <Link
          href="/dashboard/pets/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Link>
      </div>

      {/* Pet Cards */}
      {pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => {
            const Icon = getPetIcon(pet.species);
            const age = calculateAge(pet.birthDate || null);
            const isSelected = selectedPet?.id === pet.id;
            
            return (
              <div
                key={pet.id}
                className={cn(
                  "bg-white rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer",
                  isSelected 
                    ? "border-blue-500 bg-blue-50/30" 
                    : "border-gray-100 hover:border-gray-300"
                )}
                onClick={() => selectPet(pet)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      isSelected ? "bg-blue-200" : "bg-gray-200"
                    )}>
                      <Icon className={cn(
                        "w-8 h-8",
                        isSelected ? "text-blue-700" : "text-gray-600"
                      )} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                      <p className="text-sm text-gray-600">
                        {pet.species.charAt(0) + pet.species.slice(1).toLowerCase()}
                        {pet.breed && ` • ${pet.breed}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/pets/${pet.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </Link>
                </div>

                {/* Pet Details */}
                <div className="space-y-2">
                  {age && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {age}
                    </div>
                  )}
                  {pet.weight && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Weight className="w-4 h-4 mr-2" />
                      {pet.weight} lbs
                    </div>
                  )}
                  {pet.microchipId && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      Microchipped
                    </div>
                  )}
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                      Currently Selected
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Pets Yet</h2>
            <p className="text-gray-600 mb-6">
              Add your first pet to start managing their health records
            </p>
            <Link
              href="/dashboard/pets/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Pet
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Add the cn utility import
import { cn } from '@/lib/utils';