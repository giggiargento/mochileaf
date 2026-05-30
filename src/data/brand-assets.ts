import type { ImageMetadata } from 'astro';
import brandIsologoAsset from '../assets/brand/isologo.png';
import brandIconSmallAsset from '../assets/brand/logo-icon-small.png';

/** Optimized brand rasters in src/assets (footer lockup, mobile icon). */
export const brandAssetByPublicPath: Record<string, ImageMetadata> = {
  '/brand/isologo.png': brandIsologoAsset,
  '/brand/logo-icon-small.png': brandIconSmallAsset,
  '/brand/logo-icon.png': brandIconSmallAsset,
};

export function getBrandAsset(publicPath: string | null | undefined): ImageMetadata | undefined {
  if (!publicPath) return undefined;
  return brandAssetByPublicPath[publicPath];
}
