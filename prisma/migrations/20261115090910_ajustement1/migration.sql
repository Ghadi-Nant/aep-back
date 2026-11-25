/*
  Warnings:

  - The `moisFacturation` column on the `Facture` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dateCoupure` to the `Facture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facture" ADD COLUMN     "anneeFacturation" INTEGER,
ADD COLUMN     "dateCoupure" TIMESTAMP(3) NOT NULL,
DROP COLUMN "moisFacturation",
ADD COLUMN     "moisFacturation" INTEGER;

-- AlterTable
ALTER TABLE "Parametre" ADD COLUMN     "delaiCoupure" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "delaiLimite" INTEGER NOT NULL DEFAULT 10;

-- DropEnum
DROP TYPE "MoisFacturation";
