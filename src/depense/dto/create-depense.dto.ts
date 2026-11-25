import { LibelleDepense, TypeAboService } from "../../generated/prisma/enums.js"
import { Type } from "class-transformer"
import { IsNotEmpty, IsDateString, IsEnum, IsInt, IsNumber } from "class-validator"

export class CreateDepenseDto {
    @IsNotEmpty()
    @IsDateString()
    dateDepense!: string

    @IsNotEmpty()
    @IsEnum(TypeAboService)
    typeService!: TypeAboService
    
    @IsNotEmpty()
    @IsEnum(LibelleDepense)
    libelleDepense!: LibelleDepense

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    montant!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number
}
