// app/api/pets/[id]/route.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
    
    // Get the specific pet
    const pet = await prisma.pet.findFirst({
      where: { 
        id: id,
        userId: user.id 
      },
    });
    
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
    }
    
    return NextResponse.json(pet);
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pet' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
    
    // Update the pet
    const pet = await prisma.pet.update({
      where: { 
        id: id,
        userId: user.id // Ensure user owns this pet
      },
      data: {
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
        action: 'pet.updated',
        entityType: 'pet',
        entityId: pet.id,
        metadata: { petName: pet.name },
      },
    });
    
    return NextResponse.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json(
      { error: 'Failed to update pet' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
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
    
    // Delete the pet (cascade will handle related records)
    const pet = await prisma.pet.delete({
      where: { 
        id: id,
        userId: user.id // Ensure user owns this pet
      },
    });
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'pet.deleted',
        entityType: 'pet',
        entityId: pet.id,
        metadata: { petName: pet.name },
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pet:', error);
    return NextResponse.json(
      { error: 'Failed to delete pet' },
      { status: 500 }
    );
  }
}