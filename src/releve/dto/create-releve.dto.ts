import { Type } from "class-transformer"
import { IsInt, IsNumber, IsNotEmpty, IsDateString } from "class-validator"

export class CreateReleveDto {
    @IsNotEmpty()
    @IsDateString()
    dateReleve!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    ancienIndex!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    nouvelIndex!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    consommation!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idCompteur!: number
}
