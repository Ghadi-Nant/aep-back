import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateParametreDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  fraisFixeFacture: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  delaiPresentation: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  delaiLimite: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  delaiCoupure: number;
}