import { IsDateString, IsNotEmpty, IsInt, IsNumber } from "class-validator"
import { Type } from "class-transformer"

export class CreatePaimentDto {
    @IsNotEmpty()
    @IsDateString()
    datePaiement!: string

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    montantPaye!: number
   
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    idFacture!: number
}
