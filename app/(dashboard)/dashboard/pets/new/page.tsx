// app/(dashboard)/dashboard/pets/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { usePets } from '@/contexts/PetContext';

const SPECIES_OPTIONS = [
    { value: 'DOG', label: 'Dog', emoji: '🐕' },
    { value: 'CAT', label: 'Cat', emoji: '🐈' },
    { value: 'OTHER', label: 'Other', emoji: '🐾' },
  ];

export default function AddPetPage() {
  const router = useRouter();
  const { refreshPets } = usePets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    birthDate: '',
    weight: '',
    sex: '',
    isNeutered: false,
    microchipId: '',
    color: '',
    specialNeeds: '',
    insuranceInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.species) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
        const response = await fetch('/api/pets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            birthDate: formData.birthDate || null,
          }),
        });
      
        if (!response.ok) {
          const error = await response.json();
          console.error('API Error:', error);
          throw new Error(error.error || 'Failed to add pet');
        }
      
        const pet = await response.json();
        toast.success(`${pet.name} has been added!`);
        await refreshPets();  // Add this if not already there
        router.push('/dashboard');
      } catch (error) {
        console.error('Error adding pet:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to add pet');
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Pet</h1>
        <p className="text-gray-600 mt-1">Create a profile for your furry friend</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload (placeholder for now) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Pet Photo
          </label>
          <div className="flex justify-center">
            <button
              type="button"
              className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Camera className="w-8 h-8 text-gray-400" />
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Photo upload coming soon
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Max"
              />
            </div>

            {/* Species */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Species <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SPECIES_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, species: option.value })}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.species === option.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-1">{option.emoji}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breed
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Golden Retriever"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 25.5"
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <div className="flex gap-2">
                {['MALE', 'FEMALE', 'UNKNOWN'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData({ ...formData, sex: option })}
                    className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                      formData.sex === option
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Neutered/Spayed */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isNeutered}
                  onChange={(e) => setFormData({ ...formData, isNeutered: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Neutered/Spayed
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          
          <div className="space-y-4">
            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color/Markings
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Brown with white chest"
              />
            </div>

            {/* Microchip */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Microchip ID
              </label>
              <input
                type="text"
                value={formData.microchipId}
                onChange={(e) => setFormData({ ...formData, microchipId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 985112000123456"
              />
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance Information
              </label>
              <input
                type="text"
                value={formData.insuranceInfo}
                onChange={(e) => setFormData({ ...formData, insuranceInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., PetPlan Policy #12345"
              />
            </div>

            {/* Special Needs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Needs or Notes
              </label>
              <textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Allergic to chicken, needs daily medication..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Pet'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}