-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
