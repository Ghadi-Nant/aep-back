/*
  Warnings:

  - You are about to alter the column `montantFacture` on the `Facture` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `montantPaye` on the `Paiement` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Facture" ALTER COLUMN "montantFacture" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Paiement" ALTER COLUMN "montantPaye" SET DATA TYPE DECIMAL(12,2);
