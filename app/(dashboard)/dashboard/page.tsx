// app/(dashboard)/dashboard/page.tsx
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { 
  FileText, 
  Heart, 
  AlertCircle,
  Upload,
  Share2,
  TrendingUp,
  Clock
} from 'lucide-react';
import Link from 'next/link';

async function getUserData(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      pets: {
        take: 5,
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          pets: true,
        }
      }
    }
  });
  
  return user;
}

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const user = await getUserData(userId);
  const hasPets = user?.pets && user.pets.length > 0;

  // Quick stats (will be real data later)
  const stats = {
    totalRecords: 0,
    upcomingReminders: 0,
    activeShares: 0,
    aiCredits: user?.aiCredits || 0,
  };

  return (
    <div className="py-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {hasPets 
            ? `Managing health records for ${user._count.pets} pet${user._count.pets > 1 ? 's' : ''}`
            : "Let's get started by adding your first pet"
          }
        </p>
      </div>

      {/* Quick Actions */}
      {hasPets ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRecords}</p>
                  <p className="text-xs text-gray-600">Records</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingReminders}</p>
                  <p className="text-xs text-gray-600">Reminders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeShares}</p>
                  <p className="text-xs text-gray-600">Active Shares</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.aiCredits}</p>
                  <p className="text-xs text-gray-600">AI Credits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/records/upload" className="group">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Upload Record</h3>
                    <p className="text-blue-100 text-sm mt-1">Add new health records with OCR</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/share" className="group">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Share Records</h3>
                    <p className="text-purple-100 text-sm mt-1">Generate secure QR codes</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Share2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity (placeholder) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm mt-1">Upload your first record to get started</p>
            </div>
          </div>
        </>
      ) : (
        /* Empty State - No Pets */
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Add Your First Pet</h2>
            <p className="text-gray-600 mb-6">
              Start managing your pet's health records by adding their profile
            </p>
            <Link
              href="/dashboard/pets/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Pet Profile
            </Link>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      {user?.subscriptionStatus === 'TRIAL_PENDING' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                14-Day Free Trial
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Your trial will begin when you upload your first record. Enjoy full access to all features!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}