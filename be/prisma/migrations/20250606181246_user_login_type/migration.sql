-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('GOOGLE', 'EMAIL_PASSWORD');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "login_type" "LoginType" NOT NULL DEFAULT 'EMAIL_PASSWORD',
ALTER COLUMN "password" DROP NOT NULL;
