import { Type } from "class-transformer"
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateDeviDto {
    @IsNotEmpty()
    @IsString()
    numDevis!: string

    @IsNotEmpty()
    @IsString()
    designation!: string

    @IsNotEmpty()
    @IsString()
    unite!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    quantite!: number
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    prixUnitaireRef!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    montant!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAbonne!: number
}
