import { Type } from 'class-transformer';
import{ IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreateReservoirDto {
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    volume! : number
    
    @Type(() => Number)
    @IsNotEmpty()
    @IsInt()
    idForage! : number
    
    @Type(() => Number)
    @IsInt()
    @IsNotEmpty()
    idAep! : number

}
