/*
  Warnings:

  - Added the required column `email_enc` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_enc" TEXT NOT NULL;
