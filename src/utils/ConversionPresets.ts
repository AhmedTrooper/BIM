import { ImageVariant } from '../interface/imageConverter/IImageConverter';

export interface ConversionPreset {
  id: string;
  name: string;
  description: string;
  variants: Omit<ImageVariant, 'id'>[];
}

export const CONVERSION_PRESETS: ConversionPreset[] = [
  {
    id: 'app-icons',
    name: 'App Icons',
    description: 'Standard app icon sizes for desktop and mobile',
    variants: [
      { name: 'icon_16', format: 'png', width: 16, height: 16, conversionStatus: 'idle' },
      { name: 'icon_32', format: 'png', width: 32, height: 32, conversionStatus: 'idle' },
      { name: 'icon_48', format: 'png', width: 48, height: 48, conversionStatus: 'idle' },
      { name: 'icon_64', format: 'png', width: 64, height: 64, conversionStatus: 'idle' },
      { name: 'icon_128', format: 'png', width: 128, height: 128, conversionStatus: 'idle' },
      { name: 'icon_256', format: 'png', width: 256, height: 256, conversionStatus: 'idle' },
      { name: 'icon_512', format: 'png', width: 512, height: 512, conversionStatus: 'idle' },
      { name: 'icon_1024', format: 'png', width: 1024, height: 1024, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'web-responsive',
    name: 'Responsive Web Images',
    description: 'Optimized images for responsive web design',
    variants: [
      { name: 'desktop_2x', format: 'webp', width: 1920, height: 1080, maxSize: 500, conversionStatus: 'idle' },
      { name: 'desktop_1x', format: 'webp', width: 1280, height: 720, maxSize: 300, conversionStatus: 'idle' },
      { name: 'tablet_2x', format: 'webp', width: 1024, height: 768, maxSize: 250, conversionStatus: 'idle' },
      { name: 'tablet_1x', format: 'webp', width: 768, height: 576, maxSize: 150, conversionStatus: 'idle' },
      { name: 'mobile_2x', format: 'webp', width: 750, height: 1334, maxSize: 200, conversionStatus: 'idle' },
      { name: 'mobile_1x', format: 'webp', width: 375, height: 667, maxSize: 100, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Standard sizes for major social platforms',
    variants: [
      { name: 'facebook_cover', format: 'jpg', width: 820, height: 312, maxSize: 100, conversionStatus: 'idle' },
      { name: 'facebook_post', format: 'jpg', width: 1200, height: 630, maxSize: 100, conversionStatus: 'idle' },
      { name: 'twitter_header', format: 'jpg', width: 1500, height: 500, maxSize: 100, conversionStatus: 'idle' },
      { name: 'twitter_post', format: 'jpg', width: 1200, height: 675, maxSize: 100, conversionStatus: 'idle' },
      { name: 'instagram_post', format: 'jpg', width: 1080, height: 1080, maxSize: 100, conversionStatus: 'idle' },
      { name: 'instagram_story', format: 'jpg', width: 1080, height: 1920, maxSize: 100, conversionStatus: 'idle' },
      { name: 'linkedin_post', format: 'jpg', width: 1200, height: 627, maxSize: 100, conversionStatus: 'idle' },
      { name: 'youtube_thumbnail', format: 'jpg', width: 1280, height: 720, maxSize: 2048, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'favicon',
    name: 'Favicon Set',
    description: 'Complete favicon package for websites',
    variants: [
      { name: 'favicon', format: 'ico', width: 32, height: 32, conversionStatus: 'idle' },
      { name: 'favicon-16x16', format: 'png', width: 16, height: 16, conversionStatus: 'idle' },
      { name: 'favicon-32x32', format: 'png', width: 32, height: 32, conversionStatus: 'idle' },
      { name: 'apple-touch-icon', format: 'png', width: 180, height: 180, conversionStatus: 'idle' },
      { name: 'android-chrome-192x192', format: 'png', width: 192, height: 192, conversionStatus: 'idle' },
      { name: 'android-chrome-512x512', format: 'png', width: 512, height: 512, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'thumbnails',
    name: 'Thumbnail Sizes',
    description: 'Various thumbnail sizes for galleries and previews',
    variants: [
      { name: 'thumb_small', format: 'jpg', width: 150, height: 150, maxSize: 20, conversionStatus: 'idle' },
      { name: 'thumb_medium', format: 'jpg', width: 300, height: 300, maxSize: 50, conversionStatus: 'idle' },
      { name: 'thumb_large', format: 'jpg', width: 600, height: 600, maxSize: 100, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'product-images',
    name: 'E-commerce Product Images',
    description: 'Standard product image sizes for online stores',
    variants: [
      { name: 'product_full', format: 'jpg', width: 2000, height: 2000, maxSize: 500, conversionStatus: 'idle' },
      { name: 'product_large', format: 'jpg', width: 1200, height: 1200, maxSize: 300, conversionStatus: 'idle' },
      { name: 'product_medium', format: 'jpg', width: 600, height: 600, maxSize: 150, conversionStatus: 'idle' },
      { name: 'product_small', format: 'jpg', width: 300, height: 300, maxSize: 50, conversionStatus: 'idle' },
      { name: 'product_thumb', format: 'jpg', width: 150, height: 150, maxSize: 20, conversionStatus: 'idle' },
    ],
  },
  {
    id: 'print-ready',
    name: 'Print Quality',
    description: 'High-resolution images for print materials',
    variants: [
      { name: 'print_a4_300dpi', format: 'tiff', width: 2480, height: 3508, conversionStatus: 'idle' },
      { name: 'print_letter_300dpi', format: 'tiff', width: 2550, height: 3300, conversionStatus: 'idle' },
      { name: 'print_a5_300dpi', format: 'tiff', width: 1748, height: 2480, conversionStatus: 'idle' },
    ],
  },
];

export const applyPreset = (preset: ConversionPreset): ImageVariant[] => {
  return preset.variants.map((variant, index) => ({
    ...variant,
    id: `preset-${preset.id}-${Date.now()}-${index}`,
  }));
};

export const getPresetById = (presetId: string): ConversionPreset | undefined => {
  return CONVERSION_PRESETS.find(p => p.id === presetId);
};

export const createCustomVariant = (
  baseName: string,
  format: ImageVariant['format'],
  sizes: Array<{ width: number; height: number }>
): ImageVariant[] => {
  return sizes.map((size, index) => ({
    id: `custom-${Date.now()}-${index}`,
    name: `${baseName}_${size.width}x${size.height}`,
    format,
    width: size.width,
    height: size.height,
    conversionStatus: 'idle',
  }));
};
