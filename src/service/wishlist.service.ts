import { BadRequestException, Injectable } from '@nestjs/common';
import { WishlistCodesRepo, WishlistRepo } from '../repo/wishlist.repo';
import {
  CreateWishlistDto,
  DeleteWishlistDto,
  GetWishlistListDto,
  UpdateWishlistDto,
} from '../dto/wishlist.dto';
import { OneByIdDto } from '../shared/dtos';
import { generateRandomCode } from '../shared/utils';

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepo: WishlistRepo,
    private readonly wishlistCodesRepo: WishlistCodesRepo,
  ) {}

  private static readonly FREE_PLAN_GIFT_LIMIT = 5;

  async create(payload: CreateWishlistDto) {
    const countResult = await this.wishlistRepo.knex
      .count('id as count')
      .from(this.wishlistRepo.tableName)
      .where('owner_id', payload.owner_id)
      .first();
    const count = Number((countResult as { count?: string })?.count ?? 0);
    if (count >= WishlistService.FREE_PLAN_GIFT_LIMIT) {
      throw new BadRequestException(
        `Free plan limit: maximum ${WishlistService.FREE_PLAN_GIFT_LIMIT} gifts. Upgrade to add more.`,
      );
    }

    const existingCode = await this.wishlistCodesRepo.getOne({
      owner_id: payload.owner_id,
    });

    if (existingCode) {
      return this.wishlistRepo.insert({
        owner_id: payload.owner_id,
        title: payload.title,
        imageurl: payload.imageUrl,
        producturl: payload.productUrl,
        code: existingCode.code,
      });
    }

    return this.wishlistCodesRepo.knex.transaction(async (trx) => {
      const code = generateRandomCode(6);
      await this.wishlistCodesRepo.insertWithTransaction(trx, {
        name: payload.title,
        owner_id: payload.owner_id,
        code: code,
      });
      return this.wishlistRepo.insertWithTransaction(trx, {
        owner_id: payload.owner_id,
        title: payload.title,
        imageurl: payload.imageUrl,
        producturl: payload.productUrl,
        code: code,
      });
    });
  }

  async findAll(params: GetWishlistListDto) {
    const { limit = 10, offset = 0, search, code } = params;
    const query = this.wishlistRepo.knex
      .select(['id', 'title', 'imageurl', 'producturl'])
      .from(this.wishlistRepo.tableName)
      .where('code', code)
      .offset(offset);

    if (search) {
      query.where('title', 'ilike', `%${search}%`);
    }

    const data = await query;
    const totalRow = await this.wishlistRepo.knex
      .count('id as count')
      .from(this.wishlistRepo.tableName)
      .modify((qb) => {
        if (search) qb.where('title', 'ilike', `%${search}%`);
        if (code) qb.where('code', code);
      })
      .first();

    return {
      data,
      total: totalRow ? Number((totalRow as { count?: string }).count ?? 0) : 0,
      offset,
    };
  }

  async findOne(payload: OneByIdDto) {
    return this.wishlistRepo.getById(payload.id);
  }

  async update(payload: UpdateWishlistDto) {
    const { id } = payload;
    return this.wishlistRepo.updateById(id, {
      imageurl: payload.imageUrl,
      producturl: payload.productUrl,
      owner_id: payload.owner_id,
    });
  }

  async remove(payload: DeleteWishlistDto) {
    return this.wishlistRepo.delete({
      id: payload.id,
      owner_id: payload.owner_id,
    });
  }
}
