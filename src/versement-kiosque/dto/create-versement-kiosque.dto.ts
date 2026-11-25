import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsInt } from "class-validator"

export class CreateVersementKiosqueDto {
    @IsNotEmpty()
    @IsDateString()
    dateVersement!: string

    @IsNotEmpty()
    @IsString()
    nomFontainier!: string

    @IsNotEmpty()
    @IsString()
    telephoneFontainier!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    acienIndex!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    nouvelIndex!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    quantite: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    prix: number
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    recetteTheorique!: number
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    recetteVersee!: number
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    restePayer!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idKiosque: number
}
