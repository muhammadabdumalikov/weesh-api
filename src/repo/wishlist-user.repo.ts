import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { WishlistUserEntity } from './entity';

@Injectable()
export class WishlistUserRepo extends BaseRepo<WishlistUserEntity> {
  constructor() {
    super('wishlist_users');
  }

  findByLogin(login: string) {
    return this.getOne({ login });
  }

  findByTelegramId(telegramId: number) {
    return this.getOne({ telegram_id: telegramId });
  }

  findByGoogleId(googleId: string) {
    return this.getOne({ google_id: googleId });
  }
}
