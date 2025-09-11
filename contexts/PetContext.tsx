// contexts/PetContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Pet {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    photoUrl?: string | null;
    birthDate?: string | null;
    weight?: number | null;
    microchipId?: string | null;
    color?: string | null;
    sex?: string | null;
    isNeutered?: boolean;
    specialNeeds?: string | null;
    insuranceInfo?: string | null;
  }

interface PetContextType {
  pets: Pet[];
  selectedPet: Pet | null;
  isLoading: boolean;
  selectPet: (pet: Pet) => void;
  refreshPets: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchPets = async () => {
    try {
      const response = await fetch('/api/pets');
      if (response.ok) {
        const data = await response.json();
        setPets(data);
        
        // Auto-select first pet if none selected
        if (data.length > 0 && !selectedPet) {
          setSelectedPet(data[0]);
        }
        // Update selected pet if it exists in new data
        else if (selectedPet) {
          const updatedPet = data.find((p: Pet) => p.id === selectedPet.id);
          if (updatedPet) {
            setSelectedPet(updatedPet);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet);
    // Store in localStorage for persistence
    localStorage.setItem('selectedPetId', pet.id);
  };

  const refreshPets = async () => {
    await fetchPets();
  };

  // Load selected pet from localStorage on mount
  useEffect(() => {
    const savedPetId = localStorage.getItem('selectedPetId');
    if (savedPetId && pets.length > 0) {
      const savedPet = pets.find(p => p.id === savedPetId);
      if (savedPet) {
        setSelectedPet(savedPet);
      }
    }
  }, [pets]);

  return (
    <PetContext.Provider value={{ 
      pets, 
      selectedPet, 
      isLoading, 
      selectPet, 
      refreshPets 
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}