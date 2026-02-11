import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class WishlistSignUpDto {
  @ApiProperty({ description: 'Unique login for wishlist user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  login: string;

  @ApiProperty({ description: 'Password for wishlist user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}

export class WishlistSignInDto {
  @ApiProperty({ description: 'User login' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  login: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;
}

export class WishlistTelegramAuthDto {
  @ApiProperty({ description: 'Telegram user ID' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Telegram first name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  photo_url?: string;

  @ApiProperty({ description: 'Telegram auth date (Unix timestamp)' })
  @IsNumber()
  auth_date: number;

  @ApiProperty({ description: 'Telegram hash for verification' })
  @IsString()
  @IsNotEmpty()
  hash: string;
}

export class WishlistGoogleAuthDto {
  @ApiProperty({ description: 'Google ID token (JWT) from the client' })
  @IsString()
  @IsNotEmpty()
  id_token: string;
}
