// app/page.tsx

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Heart, Shield, Share2, Brain } from "lucide-react";

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Wagabond Pets</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/sign-in" 
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Sign In
            </Link>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Your Pet's Health Records,<br />Organized & Secure
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Store, manage, and share your pet's medical records with vets and caregivers. 
          Get AI-powered health insights to keep your furry friend healthy.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/sign-up" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>
          <Link 
            href="#features" 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Pet Health Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Shield className="h-12 w-12 text-blue-600" />}
            title="Secure Storage"
            description="Your pet's records are encrypted and securely stored in the cloud"
          />
          <FeatureCard 
            icon={<Share2 className="h-12 w-12 text-blue-600" />}
            title="Easy Sharing"
            description="Share records with vets or pet sitters via QR codes"
          />
          <FeatureCard 
            icon={<Brain className="h-12 w-12 text-blue-600" />}
            title="AI Insights"
            description="Get intelligent health insights and reminders for your pet"
          />
          <FeatureCard 
            icon={<Heart className="h-12 w-12 text-blue-600" />}
            title="Complete Care"
            description="Track vaccinations, medications, appointments, and more"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of pet parents who trust Wagabond Pets with their pet&apos;s health records.
          </p>
          <Link 
            href="/sign-up" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Start Your Free Trial
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            14-day free trial • No credit card required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 Wagabond Pets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}