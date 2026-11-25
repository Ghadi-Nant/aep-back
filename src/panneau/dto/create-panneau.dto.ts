import { Type } from 'class-transformer';
import{ IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreatePanneauDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  puissanceTotal!: number;
  
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  nombrePanneau!: number;
  
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  idReservoir!: number;
  
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  idAep!: number;

}
