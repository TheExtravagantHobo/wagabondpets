// app/api/pets/route.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get all pets for the user
    const pets = await prisma.pet.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const body = await request.json();
    
    // Create the pet
    const pet = await prisma.pet.create({
      data: {
        userId: user.id,
        name: body.name,
        species: body.species,
        breed: body.breed || null,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        weight: body.weight || null,
        sex: body.sex || null,
        isNeutered: body.isNeutered || false,
        microchipId: body.microchipId || null,
        color: body.color || null,
        specialNeeds: body.specialNeeds || null,
        insuranceInfo: body.insuranceInfo || null,
        photoUrl: body.photoUrl || null,
      },
    });
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'pet.created',
        entityType: 'pet',
        entityId: pet.id,
        metadata: { petName: pet.name, species: pet.species },
      },
    });
    
    return NextResponse.json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    );
  }
}