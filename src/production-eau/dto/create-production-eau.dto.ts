import { Type } from "class-transformer"
import { IsNotEmpty, IsDateString, IsNumber, IsInt } from "class-validator"

export class CreateProductionEauDto {
    @IsNotEmpty()
    @IsDateString()
    dateHeure!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    IndexReservoir!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    volumeProduit!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idReservoir!: number

    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    idPompe!: number
}
