import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserInfo> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId?.trim()) {
      console.error(
        'GOOGLE_CLIENT_ID is not set. Set it to the same value as the frontend (e.g. NEXT_PUBLIC_GOOGLE_CLIENT_ID).',
      );
      throw new UnauthorizedException('Google sign-in is not configured');
    }

    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: clientId.trim(),
      });

      const payload = ticket.getPayload();
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid Google token payload');
      }
      if (payload.email_verified === false) {
        throw new UnauthorizedException('Google email not verified');
      }

      return {
        sub: payload.sub,
        email: payload.email ?? `google_${payload.sub}`,
        email_verified: payload.email_verified ?? true,
        name: payload.name ?? '',
        given_name: payload.given_name ?? '',
        family_name: payload.family_name ?? '',
        picture: payload.picture ?? '',
        locale: payload.locale ?? '',
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      const message = error instanceof Error ? error.message : String(error);
      console.error('Google token verification error:', message);
      if (message.includes('audience') || message.includes('aud')) {
        throw new UnauthorizedException(
          'Invalid Google token: audience mismatch. Set GOOGLE_CLIENT_ID on the backend to the same value as NEXT_PUBLIC_GOOGLE_CLIENT_ID on the frontend.',
        );
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
