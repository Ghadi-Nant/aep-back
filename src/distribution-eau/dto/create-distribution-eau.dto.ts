import { Type } from "class-transformer"
import { IsNotEmpty, IsDateString, IsNumber, IsInt } from "class-validator"

export class CreateDistributionEauDto {
    @IsNotEmpty()
    @IsDateString()
    dateHeure!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    indexCompteur!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    volumeDistribue!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idReservoir!: number
}
