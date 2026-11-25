import { Type } from "class-transformer";
import { TypeSysteme, TypePompage, StatutEquipement } from "../../generated/prisma/enums.js"
import { IsString, IsNotEmpty, IsDateString, IsArray, ArrayNotEmpty, ValidateNested, IsInt, IsOptional } from 'class-validator'

export class CreateLocaliteDto {
  @IsOptional()
  @IsInt()
  idLocalite?: number;
    
  @IsString()
  @IsNotEmpty()
  nom!: string;
}

export class CreateAepDto {
    @IsString()
    @IsNotEmpty()
    nomAep!: string

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateLocaliteDto)
    localites!: CreateLocaliteDto[];

    @IsNotEmpty()
    typeSysteme!: TypeSysteme

    @IsNotEmpty()
    typePompage!: TypePompage

    @IsNotEmpty()
    statut!: StatutEquipement

    @IsNotEmpty()
    @IsDateString()
    dateService!: string

    @IsNotEmpty()
    nombrePopulation!: number

    @IsNotEmpty()
    nombreBeneficiaires!: number

    @IsNotEmpty()
    prixEauBf!: number

    @IsNotEmpty()
    prixEauBp!: number
}
