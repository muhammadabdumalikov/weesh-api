import { createHmac } from 'crypto';

export function verifyTelegramAuthData(
  authData: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  },
  botToken: string,
): boolean {
  try {
    const dataCheckArray: string[] = [];
    if (authData.id) dataCheckArray.push(`id=${authData.id}`);
    if (authData.first_name)
      dataCheckArray.push(`first_name=${authData.first_name}`);
    if (authData.last_name)
      dataCheckArray.push(`last_name=${authData.last_name}`);
    if (authData.username) dataCheckArray.push(`username=${authData.username}`);
    if (authData.photo_url)
      dataCheckArray.push(`photo_url=${authData.photo_url}`);
    if (authData.auth_date)
      dataCheckArray.push(`auth_date=${authData.auth_date}`);
    dataCheckArray.sort();
    const dataCheckString = dataCheckArray.join('\n');
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();
    const computedHash = createHmac('sha256', secretKey.toString())
      .update(dataCheckString)
      .digest('hex');
    return computedHash === authData.hash;
  } catch (error) {
    console.error('Error verifying Telegram auth data:', error);
    return false;
  }
}
