// app/api/test-user/route.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        timezone: true,
        location: true,
        createdAt: true,
        updatedAt: true,
        subscriptionStatus: true,
        aiCredits: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        clerkId: userId,
        message: 'Webhook may not have synced yet. Try updating your Clerk profile.'
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      user,
      message: 'User successfully synced from Clerk!'
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}