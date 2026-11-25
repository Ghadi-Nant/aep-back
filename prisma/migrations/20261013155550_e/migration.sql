/*
  Warnings:

  - The `duree` column on the `CoupureEau` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statut` column on the `Facture` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `paiement` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idReleve]` on the table `Facture` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatutFacture" AS ENUM ('EN_ATTENTE', 'PAYEE', 'EN_RETARD', 'ANNULEE');

-- DropForeignKey
ALTER TABLE "Facture" DROP CONSTRAINT "Facture_idReleve_fkey";

-- DropForeignKey
ALTER TABLE "paiement" DROP CONSTRAINT "paiement_idFacture_fkey";

-- AlterTable
ALTER TABLE "CoupureEau" DROP COLUMN "duree",
ADD COLUMN     "duree" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "DevisBP" ALTER COLUMN "numDevis" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Facture" ALTER COLUMN "dateFacture" SET DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "statut",
ADD COLUMN     "statut" "StatutFacture" NOT NULL DEFAULT 'EN_ATTENTE';

-- AlterTable
ALTER TABLE "Releve" ALTER COLUMN "consommation" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "paiement";

-- CreateTable
CREATE TABLE "Paiement" (
    "idPaiement" SERIAL NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL,
    "montantPaye" DOUBLE PRECISION NOT NULL,
    "idFacture" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("idPaiement")
);

-- CreateIndex
CREATE UNIQUE INDEX "Facture_idReleve_key" ON "Facture"("idReleve");

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_idReleve_fkey" FOREIGN KEY ("idReleve") REFERENCES "Releve"("idReleve") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_idFacture_fkey" FOREIGN KEY ("idFacture") REFERENCES "Facture"("idFacture") ON DELETE CASCADE ON UPDATE CASCADE;
