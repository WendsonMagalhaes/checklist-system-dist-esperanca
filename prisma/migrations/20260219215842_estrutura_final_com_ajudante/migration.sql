/*
  Warnings:

  - You are about to drop the column `ajudante` on the `Checklist` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'AJUDANTE';

-- AlterTable
ALTER TABLE "Checklist" DROP COLUMN "ajudante",
ADD COLUMN     "ajudanteId" TEXT;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_ajudanteId_fkey" FOREIGN KEY ("ajudanteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
