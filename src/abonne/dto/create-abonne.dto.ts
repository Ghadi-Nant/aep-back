import { Type } from "class-transformer";
import { TypeAboService } from "../../generated/prisma/enums.js";
import { IsNotEmpty, IsInt, IsString, IsEnum } from "class-validator";

export class CreateAbonneDto {
    @IsNotEmpty()
    @IsString()
    refClient!: string

    @IsNotEmpty()
    @IsString()
    nom!: string

    @IsNotEmpty()
    @IsString()
    prenom!: string

    @IsNotEmpty()
    @IsString()
    adresse!: string

    @IsNotEmpty()
    @IsEnum(TypeAboService)
    typeAbonne!: TypeAboService

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number
}
