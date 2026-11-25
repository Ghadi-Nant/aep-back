import { Type } from "class-transformer"
import { TypeSaveur } from "../../generated/prisma/enums.js"
import { IsNotEmpty, IsEnum, IsNumber, IsInt } from "class-validator"

export class CreatePointEauDto {
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    nbKiosque!: number
    
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    nbBP!: number
    
    @IsNotEmpty()
    @IsEnum(TypeSaveur)
    saveur!: TypeSaveur
    
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    idReservoir!: number
}
