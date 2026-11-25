import{StatutEquipement} from "../../generated/prisma/enums.js"//chemin tsy mzv
import {IsInt, IsEnum, IsNotEmpty, IsNumber } from 'class-validator'//tokon hisy IsEnum
import { Type } from "class-transformer"

export class CreateForageDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    profondeur!: number

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    debit!: number

    @IsNotEmpty()
    @IsEnum(StatutEquipement)
    statut!: StatutEquipement

    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    idAep!: number
}
