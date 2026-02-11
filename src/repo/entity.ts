export interface WishlistEntity {
  id?: string;
  title: string;
  imageurl?: string;
  producturl?: string;
  owner_id: string;
  code: string;
}

export interface WishlistCodesEntity {
  id?: string;
  name: string;
  owner_id: string;
  code: string;
}

export interface WishlistUserEntity {
  id?: string;
  login?: string;
  password?: string;
  telegram_id?: number;
  google_id?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  created_at?: Date;
}
