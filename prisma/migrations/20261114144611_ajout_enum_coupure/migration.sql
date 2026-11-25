-- CreateEnum
CREATE TYPE "UniteDuree" AS ENUM ('SECONDE', 'MINUTE', 'HEURE', 'JOUR', 'MOIS', 'ANNEE');

-- AlterTable
ALTER TABLE "CoupureEau" ADD COLUMN     "uniteDuree" "UniteDuree";
