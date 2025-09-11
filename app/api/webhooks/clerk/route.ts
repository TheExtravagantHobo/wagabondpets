// app/api/webhooks/clerk/route.ts
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, phone_numbers, unsafe_metadata } = evt.data;
    
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    const primaryPhone = phone_numbers?.find(phone => phone.id === evt.data.primary_phone_number_id);
    
    try {
      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatarUrl: image_url || null,
          phone: primaryPhone?.phone_number || null,
          timezone: (unsafe_metadata?.timezone as string) || 'America/New_York',
          location: (unsafe_metadata?.location as string) || null,
          emergencyContact: (unsafe_metadata?.emergencyContact as string) || null,
          preferredVet: (unsafe_metadata?.preferredVet as string) || null,
          updatedAt: new Date(),
        },
        create: {
          clerkId: id,
          email: primaryEmail?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || null,
          avatarUrl: image_url || null,
          phone: primaryPhone?.phone_number || null,
          timezone: (unsafe_metadata?.timezone as string) || 'America/New_York',
          location: (unsafe_metadata?.location as string) || null,
          emergencyContact: (unsafe_metadata?.emergencyContact as string) || null,
          preferredVet: (unsafe_metadata?.preferredVet as string) || null,
          trialStartsAt: null, // Will be set on first record upload
          subscriptionStatus: 'TRIAL_PENDING',
          aiCredits: 0,
        },
      });
      
      console.log(`User ${id} synced successfully`);
    } catch (error) {
      console.error('Error syncing user:', error);
      return new Response('Error syncing user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    try {
      // Soft delete or handle according to your business logic
      await prisma.user.update({
        where: { clerkId: evt.data.id },
        data: { 
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      console.log(`User ${evt.data.id} marked as deleted`);
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}