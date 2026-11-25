/*
  Warnings:

  - The values [AEPPp] on the enum `TypeSysteme` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TypeMateriau" AS ENUM ('PVC', 'PEHD');

-- CreateEnum
CREATE TYPE "Dn" AS ENUM ('DN125', 'DN110', 'DN90', 'DN63', 'DN50', 'DN40', 'DN32');

-- CreateEnum
CREATE TYPE "Adresse" AS ENUM ('VILLAGE', 'QUARTIER');

-- CreateEnum
CREATE TYPE "TypeAboService" AS ENUM ('BF', 'BP', 'BA', 'BS');

-- CreateEnum
CREATE TYPE "TypeIntervation" AS ENUM ('PREVENTIVE', 'CURATIVE');

-- CreateEnum
CREATE TYPE "LibelleDepense" AS ENUM ('CARBURANT', 'SALAIRES_GERANT', 'SALAIRES_FONTANIERS', 'SALAIRES_GARDIENS', 'SALAIRES_TECHNICIENS', 'LOYER', 'DEPLACEMENT', 'TRANSPORT', 'COMMUNICATION', 'ENTRETIEN_PERIODIQUE', 'FOURNITURES', 'ACCESOIRES_BF', 'ACCESOIRES_BP', 'ELECTRICITE', 'REPARATION', 'TAXES_COMMUNALES', 'FRAIS_RENOUVELLEMENT_ET_EXTENSIONS_FRE', 'AUTRES');

-- CreateEnum
CREATE TYPE "LibelleRecete" AS ENUM ('VERSEMENT_KIOSQUE', 'VERSEMENT_BP', 'VERSEMENT_NON_PAYE_BP', 'NOUVEAU_BRANCHEMENT', 'RETOUR_A_LA_CAISSE', 'AUTRES');

-- CreateEnum
CREATE TYPE "LibelleStock" AS ENUM ('FOURNITURES_DE_BUREAU', 'MATERIEL_ET_EQUIPEMENT_GROUPE', 'MATERIEL_ET_EQUIPEMENT_MOTO_POMPE', 'MATERIEL_ET_EQUIPEMENT_POMPE_IMMERGEE', 'MATERIEL_ET_EQUIPEMENT_PANNEAUX_SOLAIRES', 'MATERIEL_ET_EQUIPEMENT_AUTRES', 'MATERIEL_DEFECTUEUX', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_ROBINET', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_VANNE', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_MANCHON', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_TE', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_TUYAU', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_COMPTEUR', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_EMBOUT_TARAUDE', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_EMBOUT_FILETE', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_COUDE', 'ACCESOIRES_PLOMBERIE_ET_TUYAUTERIE_AUTRES');

-- AlterEnum
ALTER TYPE "TypePompage" ADD VALUE 'ELECTRIQUE';

-- AlterEnum
BEGIN;
CREATE TYPE "TypeSysteme_new" AS ENUM ('AEPP', 'AEPG', 'Autres');
ALTER TABLE "Aep" ALTER COLUMN "typeSysteme" TYPE "TypeSysteme_new" USING ("typeSysteme"::text::"TypeSysteme_new");
ALTER TYPE "TypeSysteme" RENAME TO "TypeSysteme_old";
ALTER TYPE "TypeSysteme_new" RENAME TO "TypeSysteme";
DROP TYPE "public"."TypeSysteme_old";
COMMIT;

-- CreateTable
CREATE TABLE "Pompe" (
    "idPompe" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "puissance" DOUBLE PRECISION NOT NULL,
    "HMT" DOUBLE PRECISION NOT NULL,
    "idForage" INTEGER NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pompe_pkey" PRIMARY KEY ("idPompe")
);

-- CreateTable
CREATE TABLE "Panneau" (
    "idPanneau" SERIAL NOT NULL,
    "puissanceTotal" DOUBLE PRECISION NOT NULL,
    "nombrePanneau" INTEGER NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Panneau_pkey" PRIMARY KEY ("idPanneau")
);

-- CreateTable
CREATE TABLE "Conduite" (
    "idConduite" SERIAL NOT NULL,
    "typeMateriau" "TypeMateriau" NOT NULL,
    "dn" "Dn" NOT NULL,
    "longueur" DOUBLE PRECISION NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conduite_pkey" PRIMARY KEY ("idConduite")
);

-- CreateTable
CREATE TABLE "ProductionEau" (
    "idProduction" SERIAL NOT NULL,
    "dateHeure" TIMESTAMP(3) NOT NULL,
    "IndexReservoir" DOUBLE PRECISION NOT NULL,
    "volumeProduit" DOUBLE PRECISION NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "idPompe" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionEau_pkey" PRIMARY KEY ("idProduction")
);

-- CreateTable
CREATE TABLE "DistributionEau" (
    "idDistribution" SERIAL NOT NULL,
    "dateHeure" TIMESTAMP(3) NOT NULL,
    "indexCompteur" INTEGER NOT NULL,
    "volumeDistribue" DOUBLE PRECISION NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributionEau_pkey" PRIMARY KEY ("idDistribution")
);

-- CreateTable
CREATE TABLE "Kiosque" (
    "idKiosque" SERIAL NOT NULL,
    "numKiosque" TEXT NOT NULL,
    "idReservoir" INTEGER NOT NULL,
    "idaep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kiosque_pkey" PRIMARY KEY ("idKiosque")
);

-- CreateTable
CREATE TABLE "VersementKiosque" (
    "idVersement" SERIAL NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL,
    "nomFontainier" TEXT NOT NULL,
    "telephoneFontainier" TEXT NOT NULL,
    "acienIndex" DOUBLE PRECISION NOT NULL,
    "nouvelIndex" DOUBLE PRECISION NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "recetteTheorique" DOUBLE PRECISION NOT NULL,
    "recetteVersee" DOUBLE PRECISION NOT NULL,
    "restePayer" DOUBLE PRECISION NOT NULL,
    "idKiosque" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VersementKiosque_pkey" PRIMARY KEY ("idVersement")
);

-- CreateTable
CREATE TABLE "Abonne" (
    "idAbonne" SERIAL NOT NULL,
    "refClient" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "typeAbonne" "TypeAboService" NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abonne_pkey" PRIMARY KEY ("idAbonne")
);

-- CreateTable
CREATE TABLE "Compteur" (
    "idCompteur" SERIAL NOT NULL,
    "numCompteur" INTEGER NOT NULL,
    "ancienIndex" DOUBLE PRECISION NOT NULL,
    "nouvelIndex" DOUBLE PRECISION NOT NULL,
    "idAbonne" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Compteur_pkey" PRIMARY KEY ("idCompteur")
);

-- CreateTable
CREATE TABLE "Releve" (
    "idReleve" SERIAL NOT NULL,
    "dateReleve" TIMESTAMP(3) NOT NULL,
    "ancienIndex" DOUBLE PRECISION NOT NULL,
    "nouvelIndex" DOUBLE PRECISION NOT NULL,
    "consommation" INTEGER NOT NULL,
    "idCompteur" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Releve_pkey" PRIMARY KEY ("idReleve")
);

-- CreateTable
CREATE TABLE "Facture" (
    "idFacture" SERIAL NOT NULL,
    "dateFacture" TIMESTAMP(3) NOT NULL,
    "dateLimite" TIMESTAMP(3) NOT NULL,
    "montantFacture" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL,
    "idReleve" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facture_pkey" PRIMARY KEY ("idFacture")
);

-- CreateTable
CREATE TABLE "paiement" (
    "idPaiement" SERIAL NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL,
    "montantPaye" DOUBLE PRECISION NOT NULL,
    "idFacture" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiement_pkey" PRIMARY KEY ("idPaiement")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "idMaintenance" SERIAL NOT NULL,
    "typeIntervation" "TypeIntervation" NOT NULL,
    "dateIntervation" TIMESTAMP(3) NOT NULL,
    "nomReparateur" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("idMaintenance")
);

-- CreateTable
CREATE TABLE "CoupureEau" (
    "idCoupure" SERIAL NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "duree" TIMESTAMP(3) NOT NULL,
    "raison" TEXT NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoupureEau_pkey" PRIMARY KEY ("idCoupure")
);

-- CreateTable
CREATE TABLE "Depense" (
    "idDepense" SERIAL NOT NULL,
    "dateDepense" TIMESTAMP(3) NOT NULL,
    "typeService" "TypeAboService" NOT NULL,
    "libelleDepense" "LibelleDepense" NOT NULL,
    "entre" DOUBLE PRECISION NOT NULL,
    "sortie" DOUBLE PRECISION NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("idDepense")
);

-- CreateTable
CREATE TABLE "Recete" (
    "idRecete" SERIAL NOT NULL,
    "dateRecete" TIMESTAMP(3) NOT NULL,
    "typeService" "TypeAboService" NOT NULL,
    "libelleRecete" "LibelleRecete" NOT NULL,
    "entre" DOUBLE PRECISION NOT NULL,
    "sortie" DOUBLE PRECISION NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recete_pkey" PRIMARY KEY ("idRecete")
);

-- CreateTable
CREATE TABLE "Stock" (
    "idStock" SERIAL NOT NULL,
    "designation" TEXT NOT NULL,
    "libelleStock" "LibelleStock" NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("idStock")
);

-- CreateTable
CREATE TABLE "DevisBP" (
    "idDevis" SERIAL NOT NULL,
    "numDevis" INTEGER NOT NULL,
    "designation" TEXT NOT NULL,
    "unite" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaireRef" DOUBLE PRECISION NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "idAbonne" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevisBP_pkey" PRIMARY KEY ("idDevis")
);

-- CreateIndex
CREATE UNIQUE INDEX "Compteur_idAbonne_key" ON "Compteur"("idAbonne");

-- AddForeignKey
ALTER TABLE "Pompe" ADD CONSTRAINT "Pompe_idForage_fkey" FOREIGN KEY ("idForage") REFERENCES "Forage"("idForage") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pompe" ADD CONSTRAINT "Pompe_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panneau" ADD CONSTRAINT "Panneau_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Panneau" ADD CONSTRAINT "Panneau_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conduite" ADD CONSTRAINT "Conduite_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conduite" ADD CONSTRAINT "Conduite_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEau" ADD CONSTRAINT "ProductionEau_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEau" ADD CONSTRAINT "ProductionEau_idPompe_fkey" FOREIGN KEY ("idPompe") REFERENCES "Pompe"("idPompe") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionEau" ADD CONSTRAINT "DistributionEau_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kiosque" ADD CONSTRAINT "Kiosque_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kiosque" ADD CONSTRAINT "Kiosque_idaep_fkey" FOREIGN KEY ("idaep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VersementKiosque" ADD CONSTRAINT "VersementKiosque_idKiosque_fkey" FOREIGN KEY ("idKiosque") REFERENCES "Kiosque"("idKiosque") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abonne" ADD CONSTRAINT "Abonne_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compteur" ADD CONSTRAINT "Compteur_idAbonne_fkey" FOREIGN KEY ("idAbonne") REFERENCES "Abonne"("idAbonne") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Releve" ADD CONSTRAINT "Releve_idCompteur_fkey" FOREIGN KEY ("idCompteur") REFERENCES "Compteur"("idCompteur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facture" ADD CONSTRAINT "Facture_idReleve_fkey" FOREIGN KEY ("idReleve") REFERENCES "Releve"("idReleve") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiement" ADD CONSTRAINT "paiement_idFacture_fkey" FOREIGN KEY ("idFacture") REFERENCES "Facture"("idFacture") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoupureEau" ADD CONSTRAINT "CoupureEau_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recete" ADD CONSTRAINT "Recete_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevisBP" ADD CONSTRAINT "DevisBP_idAbonne_fkey" FOREIGN KEY ("idAbonne") REFERENCES "Abonne"("idAbonne") ON DELETE CASCADE ON UPDATE CASCADE;
