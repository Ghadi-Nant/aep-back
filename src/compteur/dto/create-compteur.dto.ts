import { IsString, IsInt, IsNotEmpty } from "class-validator"
import { Type } from "class-transformer"

export class CreateCompteurDto {
    @IsNotEmpty()
    @IsString()
    numCompteur!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idAbonne!: number
}
