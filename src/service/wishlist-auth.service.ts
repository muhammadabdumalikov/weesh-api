import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { WishlistUserRepo } from '../repo/wishlist-user.repo';
import {
  WishlistSignInDto,
  WishlistSignUpDto,
  WishlistTelegramAuthDto,
} from '../dto/wishlist-auth.dto';
import { verifyTelegramAuthData } from '@shared/utils/telegram-hash';
import { WishlistCodesRepo } from '../repo/wishlist.repo';
import { generateRandomCode } from '../shared/utils';
import { GoogleOAuthService } from '../auth/google-oauth.service';

@Injectable()
export class WishlistAuthService {
  private readonly botToken: string;

  constructor(
    private readonly wishlistUserRepo: WishlistUserRepo,
    private readonly wishlistCodesRepo: WishlistCodesRepo,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!this.botToken) {
      console.warn(
        'TELEGRAM_BOT_TOKEN is not set. Telegram authentication will not work.',
      );
    }
  }

  async signUp(payload: WishlistSignUpDto) {
    const existing = await this.wishlistUserRepo.findByLogin(payload.login);
    if (existing) {
      throw new ConflictException('Login already taken');
    }

    return this.wishlistUserRepo.knex.transaction(async (trx) => {
      const password = this.hashPassword(payload.password);
      const user = await this.wishlistUserRepo.insertWithTransaction(trx, {
        login: payload.login,
        password,
      });
      const code = generateRandomCode(6);
      const wishlistCode = await this.wishlistCodesRepo.insertWithTransaction(
        trx,
        {
          owner_id: user.id,
          name: user.login + code,
          code: code,
        },
      );
      return {
        id: user.id,
        login: user.login,
        code: wishlistCode.code,
      };
    });
  }

  async signIn(payload: WishlistSignInDto) {
    const user = await this.wishlistUserRepo.findByLogin(payload.login);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashed = this.hashPassword(payload.password);
    if (user.password !== hashed) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const code = await this.wishlistCodesRepo.getOne({ owner_id: user.id });
    return {
      id: user.id,
      login: user.login,
      code: code.code,
    };
  }

  async signUpWithTelegram(payload: WishlistTelegramAuthDto) {
    if (!this.botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }
    const isValid = verifyTelegramAuthData(payload, this.botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }
    const authDate = new Date(payload.auth_date * 1000);
    const hoursDiff =
      (Date.now() - authDate.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      throw new BadRequestException('Telegram authentication data expired');
    }
    const existing = await this.wishlistUserRepo.findByTelegramId(payload.id);
    if (existing) {
      throw new ConflictException('User already exists with this Telegram ID');
    }
    const user = await this.wishlistUserRepo.insert({
      telegram_id: payload.id,
      first_name: payload.first_name,
      last_name: payload.last_name,
      username: payload.username,
      photo_url: payload.photo_url,
    });
    return {
      id: user.id,
      telegram_id: user.telegram_id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      photo_url: user.photo_url,
    };
  }

  async signInWithTelegram(payload: WishlistTelegramAuthDto) {
    if (!this.botToken) {
      throw new BadRequestException('Telegram bot token not configured');
    }
    const isValid = verifyTelegramAuthData(payload, this.botToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid Telegram authentication data');
    }
    const authDate = new Date(payload.auth_date * 1000);
    const hoursDiff =
      (Date.now() - authDate.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      throw new BadRequestException('Telegram authentication data expired');
    }
    let user = await this.wishlistUserRepo.findByTelegramId(payload.id);
    if (!user) {
      user = await this.wishlistUserRepo.insert({
        telegram_id: payload.id,
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        photo_url: payload.photo_url,
      });
    } else {
      user = await this.wishlistUserRepo.updateById(user.id, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        username: payload.username,
        photo_url: payload.photo_url,
      });
    }
    const codeRow = await this.wishlistCodesRepo.getOne({ owner_id: user.id });
    if (!codeRow) {
      const code = generateRandomCode(6);
      const newCode = await this.wishlistCodesRepo.insert({
        owner_id: user.id,
        name: (user.login || user.id) + code,
        code,
      });
      return {
        id: user.id,
        login: user.login ?? user.first_name,
        code: newCode.code,
      };
    }
    return {
      id: user.id,
      login: user.login ?? user.first_name,
      code: codeRow.code,
    };
  }

  async signInWithGoogle(idToken: string) {
    if (!idToken?.trim()) {
      throw new BadRequestException('Google ID token is required');
    }
    const userInfo = await this.googleOAuthService.verifyIdToken(
      idToken.trim(),
      'weesh',
    );
    const googleId = userInfo.sub;
    const login = userInfo.email ?? `google_${googleId}`;

    let user = await this.wishlistUserRepo.findByGoogleId(googleId);

    if (!user) {
      return this.wishlistUserRepo.knex.transaction(async (trx) => {
        const newUser = await this.wishlistUserRepo.insertWithTransaction(trx, {
          google_id: googleId,
          login,
          first_name: userInfo.given_name,
          last_name: userInfo.family_name,
          photo_url: userInfo.picture,
        });
        const code = generateRandomCode(6);
        const wishlistCode =
          await this.wishlistCodesRepo.insertWithTransaction(trx, {
            owner_id: newUser.id,
            name: `${login}${code}`,
            code,
          });
        return {
          id: newUser.id,
          login: newUser.login,
          code: wishlistCode.code,
        };
      });
    }

    const codeRow = await this.wishlistCodesRepo.getOne({
      owner_id: user.id,
    });
    if (!codeRow) {
      throw new UnauthorizedException('Wishlist code not found for user');
    }
    return {
      id: user.id,
      login: user.login ?? login,
      code: codeRow.code,
    };
  }

  private hashPassword(password: string) {
    return createHash('md5').update(password).digest('hex');
  }
}
