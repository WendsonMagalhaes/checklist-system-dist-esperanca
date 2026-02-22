/*
  Warnings:

  - You are about to drop the column `fotoUrl` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Checklist` table. All the data in the column will be lost.
  - You are about to drop the column `pedido` on the `Checklist` table. All the data in the column will be lost.
  - The `status` column on the `Checklist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[pedidoId]` on the table `Checklist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pedidoId` to the `Checklist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('AGUARDANDO_CONFERENCIA', 'EM_CONFERENCIA', 'CONFERIDO', 'CARREGADO');

-- CreateEnum
CREATE TYPE "StatusChecklist" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO');

-- AlterTable
ALTER TABLE "Checklist" DROP COLUMN "fotoUrl",
DROP COLUMN "hora",
DROP COLUMN "pedido",
ADD COLUMN     "pedidoId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusChecklist" NOT NULL DEFAULT 'PENDENTE';

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'AGUARDANDO_CONFERENCIA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "marcado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FotoChecklist" (
    "id" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FotoChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "pedidoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_numero_key" ON "Pedido"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Checklist_pedidoId_key" ON "Checklist"("pedidoId");

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistItem" ADD CONSTRAINT "ChecklistItem_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FotoChecklist" ADD CONSTRAINT "FotoChecklist_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "Checklist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
