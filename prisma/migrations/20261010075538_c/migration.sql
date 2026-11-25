-- CreateEnum
CREATE TYPE "TypeSaveur" AS ENUM ('DOUCHE', 'SALE', 'SAUMATRE');

-- CreateTable
CREATE TABLE "PointEau" (
    "idPointEau" SERIAL NOT NULL,
    "nbKiosque" INTEGER NOT NULL,
    "nbBP" INTEGER NOT NULL,
    "saveur" "TypeSaveur" NOT NULL,
    "idReservoir" INTEGER NOT NULL,

    CONSTRAINT "PointEau_pkey" PRIMARY KEY ("idPointEau")
);

-- AddForeignKey
ALTER TABLE "PointEau" ADD CONSTRAINT "PointEau_idReservoir_fkey" FOREIGN KEY ("idReservoir") REFERENCES "Reservoir"("idReservoir") ON DELETE CASCADE ON UPDATE CASCADE;
