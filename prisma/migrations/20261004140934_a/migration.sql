-- CreateTable
CREATE TABLE "Forage" (
    "idForage" SERIAL NOT NULL,
    "profondeur" DOUBLE PRECISION NOT NULL,
    "debit" DOUBLE PRECISION NOT NULL,
    "statut" "StatutEquipement" NOT NULL DEFAULT 'EN_SERVICE',
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forage_pkey" PRIMARY KEY ("idForage")
);

-- CreateTable
CREATE TABLE "Reservoir" (
    "idReservoir" SERIAL NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "idForage" INTEGER NOT NULL,
    "idAep" INTEGER NOT NULL,
    "creeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "misAJourLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservoir_pkey" PRIMARY KEY ("idReservoir")
);

-- AddForeignKey
ALTER TABLE "Forage" ADD CONSTRAINT "Forage_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservoir" ADD CONSTRAINT "Reservoir_idForage_fkey" FOREIGN KEY ("idForage") REFERENCES "Forage"("idForage") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservoir" ADD CONSTRAINT "Reservoir_idAep_fkey" FOREIGN KEY ("idAep") REFERENCES "Aep"("idAep") ON DELETE CASCADE ON UPDATE CASCADE;
