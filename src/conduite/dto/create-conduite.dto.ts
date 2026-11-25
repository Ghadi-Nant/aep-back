import { Type } from "class-transformer";
import{TypeMateriau, Dn} from "../../generated/prisma/enums.js"
import { IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateConduiteDto {
  @IsNotEmpty()
  @IsEnum(TypeMateriau)
  typeMateriau!: TypeMateriau;

  @IsNotEmpty()
  @IsEnum(Dn)
  dn!: Dn;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  longueur!: number;
  
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  idReservoir!: number;
  
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  idAep!: number;
    
}
