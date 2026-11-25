import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsInt, IsNumber } from "class-validator";

export class CreatePompeDto {
    @IsString()
    @IsNotEmpty()
    position! : string

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    debit! : number

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    puissance! : number

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    HMT!: number
    
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    idForage! : number
    
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    idReservoir! : number
    
}
