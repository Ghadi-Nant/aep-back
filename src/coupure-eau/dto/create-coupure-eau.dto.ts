import { IsNotEmpty, IsDateString, IsInt, IsString, IsOptional, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { UniteDuree } from "../../generated/prisma/enums"

export class CreateCoupureEauDto {
    @IsNotEmpty()
    @IsDateString()
    dateDebut!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    duree!: number

    @IsNotEmpty()
    @IsString()
    raison!: string

    @IsOptional()
    @IsEnum(UniteDuree)
    uniteDuree?: UniteDuree

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number
}
