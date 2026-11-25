/*
  Warnings:

  - You are about to drop the column `ancienIndex` on the `Compteur` table. All the data in the column will be lost.
  - You are about to drop the column `nouvelIndex` on the `Compteur` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Compteur" DROP COLUMN "ancienIndex",
DROP COLUMN "nouvelIndex",
ALTER COLUMN "numCompteur" SET DATA TYPE TEXT;
