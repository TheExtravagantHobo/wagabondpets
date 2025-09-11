-- CreateEnum
CREATE TYPE "public"."Species" AS ENUM ('DOG', 'CAT', 'BIRD', 'RABBIT', 'HAMSTER', 'GUINEA_PIG', 'FISH', 'REPTILE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."PetSex" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."RecordType" AS ENUM ('VACCINATION', 'MEDICAL_EXAM', 'LAB_RESULT', 'PRESCRIPTION', 'SURGERY', 'DENTAL', 'GROOMING', 'TRAINING', 'FEEDING', 'WEIGHT', 'INCIDENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ShareScope" AS ENUM ('FULL', 'MEDICAL', 'VACCINATION', 'RECENT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('VACCINATION', 'MEDICATION', 'APPOINTMENT', 'GROOMING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('TRIAL_PENDING', 'TRIAL_ACTIVE', 'TRIAL_EXPIRED', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'PAUSED');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
    "location" TEXT,
    "emergencyContact" TEXT,
    "preferredVet" TEXT,
    "notificationEmail" BOOLEAN NOT NULL DEFAULT true,
    "notificationSms" BOOLEAN NOT NULL DEFAULT false,
    "notificationPush" BOOLEAN NOT NULL DEFAULT true,
    "trialStartsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionId" TEXT,
    "subscriptionStatus" "public"."SubscriptionStatus" NOT NULL DEFAULT 'TRIAL_PENDING',
    "subscriptionEndsAt" TIMESTAMP(3),
    "aiCredits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" "public"."Species" NOT NULL,
    "breed" TEXT,
    "birthDate" TIMESTAMP(3),
    "weight" DOUBLE PRECISION,
    "color" TEXT,
    "microchipId" TEXT,
    "photoUrl" TEXT,
    "sex" "public"."PetSex",
    "isNeutered" BOOLEAN NOT NULL DEFAULT false,
    "specialNeeds" TEXT,
    "insuranceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Record" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "type" "public"."RecordType" NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "originalFileUrl" TEXT,
    "ocrText" TEXT,
    "ocrConfidence" DOUBLE PRECISION,
    "vetName" TEXT,
    "vetClinic" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "medications" JSONB,
    "nextAppointment" TIMESTAMP(3),
    "vaccineName" TEXT,
    "vaccineExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Share" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "scope" "public"."ShareScope" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "accessCode" TEXT,
    "maxViews" INTEGER,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SharedRecord" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "SharedRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShareAccessLog" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reminder" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "type" "public"."ReminderType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "recordIds" TEXT[],
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "public"."User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "public"."User"("clerkId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "Pet_userId_idx" ON "public"."Pet"("userId");

-- CreateIndex
CREATE INDEX "Record_petId_idx" ON "public"."Record"("petId");

-- CreateIndex
CREATE INDEX "Record_type_idx" ON "public"."Record"("type");

-- CreateIndex
CREATE INDEX "Record_date_idx" ON "public"."Record"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Share_token_key" ON "public"."Share"("token");

-- CreateIndex
CREATE INDEX "Share_token_idx" ON "public"."Share"("token");

-- CreateIndex
CREATE INDEX "Share_userId_idx" ON "public"."Share"("userId");

-- CreateIndex
CREATE INDEX "Share_petId_idx" ON "public"."Share"("petId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedRecord_shareId_recordId_key" ON "public"."SharedRecord"("shareId", "recordId");

-- CreateIndex
CREATE INDEX "ShareAccessLog_shareId_idx" ON "public"."ShareAccessLog"("shareId");

-- CreateIndex
CREATE INDEX "Reminder_petId_idx" ON "public"."Reminder"("petId");

-- CreateIndex
CREATE INDEX "Reminder_dueDate_idx" ON "public"."Reminder"("dueDate");

-- CreateIndex
CREATE INDEX "AIAnalysis_userId_idx" ON "public"."AIAnalysis"("userId");

-- CreateIndex
CREATE INDEX "AIAnalysis_petId_idx" ON "public"."AIAnalysis"("petId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "public"."ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "public"."ActivityLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "public"."Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Record" ADD CONSTRAINT "Record_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Share" ADD CONSTRAINT "Share_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedRecord" ADD CONSTRAINT "SharedRecord_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "public"."Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SharedRecord" ADD CONSTRAINT "SharedRecord_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "public"."Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShareAccessLog" ADD CONSTRAINT "ShareAccessLog_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "public"."Share"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_petId_fkey" FOREIGN KEY ("petId") REFERENCES "public"."Pet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIAnalysis" ADD CONSTRAINT "AIAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
