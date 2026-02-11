import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class OneByIdDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class PaginationDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  offset?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
