/*
  Warnings:

  - Added the required column `limite` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoupureEau" ALTER COLUMN "dateFin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "limite" INTEGER NOT NULL;
