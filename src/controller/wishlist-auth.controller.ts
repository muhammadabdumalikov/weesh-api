import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  WishlistGoogleAuthDto,
  WishlistSignInDto,
  WishlistSignUpDto,
  WishlistTelegramAuthDto,
} from '../dto/wishlist-auth.dto';
import { WishlistAuthService } from '../service/wishlist-auth.service';

@ApiTags('WISHLIST AUTH')
@Controller('wishlist-auth')
export class WishlistAuthController {
  constructor(private readonly wishlistAuthService: WishlistAuthService) {}

  @Post('sign-up')
  signUp(@Body() body: WishlistSignUpDto) {
    return this.wishlistAuthService.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: WishlistSignInDto) {
    return this.wishlistAuthService.signIn(body);
  }

  @Post('telegram/sign-up')
  signUpWithTelegram(@Body() body: WishlistTelegramAuthDto) {
    return this.wishlistAuthService.signUpWithTelegram(body);
  }

  @Post('telegram/sign-in')
  signInWithTelegram(@Body() body: WishlistTelegramAuthDto) {
    return this.wishlistAuthService.signInWithTelegram(body);
  }

  @Post('google')
  signInWithGoogle(@Body() body: WishlistGoogleAuthDto) {
    return this.wishlistAuthService.signInWithGoogle(body.id_token);
  }
}
