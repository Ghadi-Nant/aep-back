import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator"
import { LibelleStock } from "../../generated/prisma/enums.js"
import { Type } from "class-transformer"

export class CreateStockDto {
    @IsNotEmpty()
    @IsString()
    designation!: string

    @IsNotEmpty()
    @IsEnum(LibelleStock)
    libelleStock!: LibelleStock

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAep!: number
}
