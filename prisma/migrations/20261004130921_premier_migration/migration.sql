-- CreateEnum
CREATE TYPE "StatutEquipement" AS ENUM ('EN_SERVICE', 'EN_PANNE', 'MAINTENANCE', 'HORS_SERVICE');

-- CreateEnum
CREATE TYPE "TypeSysteme" AS ENUM ('AEPP', 'AEPG', 'AEPPp');

-- CreateEnum
CREATE TYPE "TypePompage" AS ENUM ('SOLAIRE', 'THERMIQUE', 'GRAVITEUR', 'THERMISOLAIRE');

-- CreateTable
CREATE TABLE "Aep" (
    "idAep" SERIAL NOT NULL,
    "nomAep" TEXT NOT NULL,
    "localite" TEXT NOT NULL,
    "typeSysteme" "TypeSysteme" NOT NULL,
    "typePompage" "TypePompage" NOT NULL,
    "statut" "StatutEquipement" NOT NULL DEFAULT 'EN_SERVICE',
    "dateService" TIMESTAMP(3) NOT NULL,
    "nombrePopulation" INTEGER NOT NULL,
    "nombreBeneficiaires" INTEGER NOT NULL,
    "prixEauBf" INTEGER NOT NULL,
    "prixEauBp" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aep_pkey" PRIMARY KEY ("idAep")
);
