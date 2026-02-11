import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { OneByIdDto, PaginationDto } from '../shared/dtos';

export class CreateWishlistDto {
  @ApiProperty({ description: 'Owner of the wishlist item' })
  @IsString()
  @IsNotEmpty()
  owner_id: string;

  @ApiProperty({ description: 'Title of the wishlist item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Image URL for the wishlist item' })
  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Product URL for the wishlist item' })
  @IsString()
  @IsOptional()
  @IsUrl()
  productUrl?: string;
}

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class GetWishlistListDto extends PaginationDto {
  @ApiProperty({ description: 'Wishlist code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ description: 'Search wishlist items by title' })
  @IsString()
  @IsOptional()
  search?: string;
}

export class DeleteWishlistDto extends OneByIdDto {
  @ApiProperty({ description: 'Owner ID of the wishlist item' })
  @IsString()
  @IsNotEmpty()
  owner_id: string;
}
