/*
  Warnings:

  - You are about to drop the column `entre` on the `Depense` table. All the data in the column will be lost.
  - You are about to drop the column `solde` on the `Depense` table. All the data in the column will be lost.
  - You are about to drop the column `sortie` on the `Depense` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Depense` table. All the data in the column will be lost.
  - You are about to drop the column `prixUnitaireRef` on the `DevisBP` table. All the data in the column will be lost.
  - You are about to drop the column `quantite` on the `DevisBP` table. All the data in the column will be lost.
  - You are about to drop the column `unite` on the `DevisBP` table. All the data in the column will be lost.
  - You are about to alter the column `montant` on the `DevisBP` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.
  - You are about to alter the column `volumeDistribue` on the `DistributionEau` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,3)`.
  - You are about to drop the column `dateFacture` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `limite` on the `Facture` table. All the data in the column will be lost.
  - You are about to drop the column `montantFacture` on the `Facture` table. All the data in the column will be lost.
  - You are about to alter the column `volumeProduit` on the `ProductionEau` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(13,3)`.
  - You are about to drop the column `entre` on the `Recete` table. All the data in the column will be lost.
  - You are about to drop the column `solde` on the `Recete` table. All the data in the column will be lost.
  - You are about to drop the column `sortie` on the `Recete` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Recete` table. All the data in the column will be lost.
  - Added the required column `montant` to the `Depense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datePresentation` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fraisFixe` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moisFacturation` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montantConsommation` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montantTotal` to the `Facture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montant` to the `Recete` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatutDevis" AS ENUM ('EN_ATTENTE', 'PAYE', 'ANNULE');

-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('ACTIF', 'SUSPENDU', 'RESILE');

-- CreateEnum
CREATE TYPE "MoisFacturation" AS ENUM ('JANVIER', 'FEVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOUT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DECEMBRE');

-- AlterTable
ALTER TABLE "Abonne" ADD COLUMN     "statut" "StatutAbonnement" NOT NULL DEFAULT 'ACTIF';

-- AlterTable
ALTER TABLE "Aep" ALTER COLUMN "prixEauBf" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "prixEauBp" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "Depense" DROP COLUMN "entre",
DROP COLUMN "solde",
DROP COLUMN "sortie",
DROP COLUMN "total",
ADD COLUMN     "montant" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "DevisBP" DROP COLUMN "prixUnitaireRef",
DROP COLUMN "quantite",
DROP COLUMN "unite",
ADD COLUMN     "statut" "StatutDevis" NOT NULL DEFAULT 'EN_ATTENTE',
ALTER COLUMN "montant" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "DistributionEau" ALTER COLUMN "volumeDistribue" SET DATA TYPE DECIMAL(13,3);

-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "dateFacture",
DROP COLUMN "limite",
DROP COLUMN "montantFacture",
ADD COLUMN     "dateEdition" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "datePresentation" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fraisFixe" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "moisFacturation" "MoisFacturation" NOT NULL,
ADD COLUMN     "montantConsommation" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "montantTotal" DECIMAL(12,2) NOT NULL;

-- AlterTable
ALTER TABLE "ProductionEau" ALTER COLUMN "volumeProduit" SET DATA TYPE DECIMAL(13,3);

-- AlterTable
ALTER TABLE "Recete" DROP COLUMN "entre",
DROP COLUMN "solde",
DROP COLUMN "sortie",
DROP COLUMN "total",
ADD COLUMN     "montant" DECIMAL(12,2) NOT NULL;

-- CreateTable
CREATE TABLE "Parametre" (
    "idParametre" SERIAL NOT NULL,
    "fraisFixeFacture" DECIMAL(10,2) NOT NULL,
    "delaiPresentation" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "Parametre_pkey" PRIMARY KEY ("idParametre")
);
