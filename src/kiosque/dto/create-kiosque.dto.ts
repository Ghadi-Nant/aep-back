import { Type } from "class-transformer"
import { IsString, IsNotEmpty, IsInt } from "class-validator"

export class CreateKiosqueDto {
    @IsString()
    @IsNotEmpty()
    numKiosque!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idReservoir!: number

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idaep!: number

}
