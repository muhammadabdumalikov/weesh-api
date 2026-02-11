import { Injectable } from '@nestjs/common';
import { BaseRepo } from '@shared/providers/base-dao';
import { WishlistCodesEntity, WishlistEntity } from './entity';

@Injectable()
export class WishlistRepo extends BaseRepo<WishlistEntity> {
  constructor() {
    super('wishlist');
  }
}

@Injectable()
export class WishlistCodesRepo extends BaseRepo<WishlistCodesEntity> {
  constructor() {
    super('wishlist_codes');
  }
}
