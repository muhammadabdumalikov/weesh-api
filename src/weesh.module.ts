import { Module } from '@nestjs/common';
import { WishlistController } from './controller/wishlist.controller';
import { WishlistAuthController } from './controller/wishlist-auth.controller';
import { WishlistService } from './service/wishlist.service';
import { WishlistAuthService } from './service/wishlist-auth.service';
import { WishlistRepo, WishlistCodesRepo } from './repo/wishlist.repo';
import { WishlistUserRepo } from './repo/wishlist-user.repo';
import { GoogleOAuthService } from './auth/google-oauth.service';

@Module({
  controllers: [WishlistController, WishlistAuthController],
  providers: [
    WishlistRepo,
    WishlistCodesRepo,
    WishlistUserRepo,
    GoogleOAuthService,
    WishlistAuthService,
    WishlistService,
  ],
})
export class WeeshModule {}
