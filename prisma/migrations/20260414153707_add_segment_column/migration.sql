/*
  Warnings:

  - Added the required column `segment` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "segment" TEXT NOT NULL;
