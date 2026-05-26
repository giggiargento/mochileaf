Cozy Creators — profile photos (from Instagram)

Preferred: npm run creators:sync
  Pulls avatar + bio from Instagram and writes giggiland.jpg / .webp here.

Requires .env for reliable sync on servers (see .env.example):
  INSTAGRAM_ACCESS_TOKEN + INSTAGRAM_BUSINESS_USER_ID

Manual fallback:
  npm run creators:sync-avatar -- giggiland path/to/photo.jpg
