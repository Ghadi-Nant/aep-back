import { TypeIntervation } from "../../generated/prisma/enums.js";
import { IsEnum, IsString, IsDateString, IsNotEmpty, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateMaintenanceDto {
    @IsNotEmpty()
    @IsEnum(TypeIntervation)
    typeIntervation!: TypeIntervation

    @IsNotEmpty()
    @IsDateString()
    dateIntervation!: string

    @IsNotEmpty()
    @IsString()
    nomReparateur!: string

    /*@IsNotEmpty()
    @IsString()
    photo!: string*/

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number
}
