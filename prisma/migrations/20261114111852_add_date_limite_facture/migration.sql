/*
  Warnings:

  - A unique constraint covering the columns `[numFacture]` on the table `Facture` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateLimite` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numFacture` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "dateLimite" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "numFacture" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Facture_numFacture_key" ON "Facture"("numFacture");
