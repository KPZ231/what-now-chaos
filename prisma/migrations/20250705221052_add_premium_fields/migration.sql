-- AlterTable
ALTER TABLE "User" ADD COLUMN     "hasPremium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "premiumExpiry" TIMESTAMP(3),
ADD COLUMN     "premiumPlan" TEXT;
