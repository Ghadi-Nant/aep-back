/*
  Warnings:

  - You are about to drop the column `localite` on the `Aep` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Aep" DROP COLUMN "localite";

-- CreateTable
CREATE TABLE "Localite" (
    "idLocalite" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "aepId" INTEGER NOT NULL,

    CONSTRAINT "Localite_pkey" PRIMARY KEY ("idLocalite")
);

-- AddForeignKey
ALTER TABLE "Localite" ADD CONSTRAINT "Localite_aepId_fkey" FOREIGN KEY ("aepId") REFERENCES "Aep"("idAep") ON DELETE RESTRICT ON UPDATE CASCADE;
