import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WishlistService } from '../service/wishlist.service';
import {
  CreateWishlistDto,
  DeleteWishlistDto,
  GetWishlistListDto,
  UpdateWishlistDto,
} from '../dto/wishlist.dto';
import { OneByIdDto } from '../shared/dtos';

@ApiTags('WISHLIST')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('create')
  create(@Body() body: CreateWishlistDto) {
    return this.wishlistService.create(body);
  }

  @Post('list')
  findAll(@Body() query: GetWishlistListDto) {
    return this.wishlistService.findAll(query);
  }

  @Post('get-by-id')
  findOne(@Body() body: OneByIdDto) {
    return this.wishlistService.findOne(body);
  }

  @Post('update')
  update(@Body() body: UpdateWishlistDto) {
    return this.wishlistService.update(body);
  }

  @Post('delete')
  remove(@Body() body: DeleteWishlistDto) {
    return this.wishlistService.remove(body);
  }
}
