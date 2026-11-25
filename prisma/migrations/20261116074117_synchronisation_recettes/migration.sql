/*
  Warnings:

  - A unique constraint covering the columns `[idPaiement]` on the table `Recete` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idVersement]` on the table `Recete` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Recete" ADD COLUMN     "idPaiement" INTEGER,
ADD COLUMN     "idVersement" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Recete_idPaiement_key" ON "Recete"("idPaiement");

-- CreateIndex
CREATE UNIQUE INDEX "Recete_idVersement_key" ON "Recete"("idVersement");

-- AddForeignKey
ALTER TABLE "Recete" ADD CONSTRAINT "Recete_idPaiement_fkey" FOREIGN KEY ("idPaiement") REFERENCES "Paiement"("idPaiement") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recete" ADD CONSTRAINT "Recete_idVersement_fkey" FOREIGN KEY ("idVersement") REFERENCES "VersementKiosque"("idVersement") ON DELETE CASCADE ON UPDATE CASCADE;
