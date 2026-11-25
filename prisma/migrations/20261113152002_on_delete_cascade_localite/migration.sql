-- DropForeignKey
ALTER TABLE "Localite" DROP CONSTRAINT "Localite_aepId_fkey";

-- AddForeignKey
ALTER TABLE "Localite" ADD CONSTRAINT "Localite_aepId_fkey" FOREIGN KEY ("aepId") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;
