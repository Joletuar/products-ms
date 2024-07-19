import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Type(() => Number)
  public page?: number;

  @IsOptional()
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @Min(1)
  @Type(() => Number)
  public limit?: number;

  @IsOptional()
  @IsString()
  public sort?: string;

  @IsOptional()
  @IsString()
  public filter?: string;
}
