/*
  Warnings:

  - You are about to drop the `AbrintLeads` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "origin" TEXT DEFAULT 'site',
ADD COLUMN     "wants_heimdall" BOOLEAN DEFAULT false,
ADD COLUMN     "wants_zeus_vision" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "AbrintLeads";
