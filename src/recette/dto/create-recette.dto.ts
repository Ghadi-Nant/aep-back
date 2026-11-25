import { Type } from "class-transformer"
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber } from "class-validator"
import { LibelleRecete, TypeAboService } from "../../generated/prisma/enums.js"

export class CreateRecetteDto {
    @IsNotEmpty()
    @IsDateString()
    dateRecete!: string

    @IsNotEmpty()
    @IsEnum(TypeAboService)
    typeService!: TypeAboService
    
    @IsNotEmpty()
    @IsEnum(LibelleRecete)
    libelleRecete!: LibelleRecete

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    montant!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number    
}
