/*
  Warnings:

  - You are about to drop the column `dateLimite` on the `Facture` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('UTILISATEUR', 'ADMIN', 'GERANT', 'TECHNICIEN');

-- CreateEnum
CREATE TYPE "FournisseurAuth" AS ENUM ('MOT_DE_PASSE', 'GOOGLE', 'APPLE', 'TELEPHONE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "Facture" DROP COLUMN "dateLimite";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "idUtilisateur" SERIAL NOT NULL,
    "nom" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "estActif" BOOLEAN NOT NULL DEFAULT true,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,
    "roleUtilisateur" "RoleUtilisateur" NOT NULL DEFAULT 'UTILISATEUR',

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("idUtilisateur")
);

-- CreateTable
CREATE TABLE "IdentiteAuth" (
    "idIdentite" SERIAL NOT NULL,
    "idUtilisateur" INTEGER NOT NULL,
    "fournisseur" "FournisseurAuth" NOT NULL,
    "idFournisseur" TEXT NOT NULL,
    "hashMotDePasse" TEXT,
    "jetonReinitialisationMotDePasse" TEXT,
    "expirationReinitialisationMotDePasse" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdentiteAuth_pkey" PRIMARY KEY ("idIdentite")
);

-- CreateTable
CREATE TABLE "SessionUtilisateur" (
    "idSession" SERIAL NOT NULL,
    "idUtilisateur" INTEGER NOT NULL,
    "hashJetonRafraichissement" TEXT NOT NULL,
    "expireLe" TIMESTAMP(3) NOT NULL,
    "revoqueLe" TIMESTAMP(3),
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionUtilisateur_pkey" PRIMARY KEY ("idSession")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_telephone_key" ON "Utilisateur"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "IdentiteAuth_jetonReinitialisationMotDePasse_key" ON "IdentiteAuth"("jetonReinitialisationMotDePasse");

-- CreateIndex
CREATE INDEX "IdentiteAuth_idUtilisateur_idx" ON "IdentiteAuth"("idUtilisateur");

-- CreateIndex
CREATE UNIQUE INDEX "IdentiteAuth_fournisseur_idFournisseur_key" ON "IdentiteAuth"("fournisseur", "idFournisseur");

-- CreateIndex
CREATE INDEX "SessionUtilisateur_idUtilisateur_idx" ON "SessionUtilisateur"("idUtilisateur");

-- CreateIndex
CREATE INDEX "SessionUtilisateur_expireLe_idx" ON "SessionUtilisateur"("expireLe");

-- AddForeignKey
ALTER TABLE "IdentiteAuth" ADD CONSTRAINT "IdentiteAuth_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionUtilisateur" ADD CONSTRAINT "SessionUtilisateur_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("idUtilisateur") ON DELETE CASCADE ON UPDATE CASCADE;
