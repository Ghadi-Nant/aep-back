import { StatutFacture } from "../../generated/prisma/enums.js"
import { Type } from "class-transformer"
import {IsDateString, IsInt, IsNumber, IsNotEmpty, IsEnum, IsOptional } from "class-validator"

export class CreateFactureDto {
/*    @IsNotEmpty()
    @IsDateString()
    dateFacture!: string

    @IsNotEmpty()
    @IsInt()
    limite!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    montantFacture!: number

    @IsNotEmpty()
    @IsEnum(StatutFacture)
    statut!: StatutFacture*/

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idReleve!: number

    @IsOptional()
    @IsDateString()
    dateEdition?: string
}
