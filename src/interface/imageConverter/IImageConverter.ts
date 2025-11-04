export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'bmp' | 'tiff' | 'ico';

export interface ImageVariant {
  id: string;
  name: string;
  format: ImageFormat;
  minSize?: number; // in KB
  maxSize?: number; // in KB
  width: number;
  height: number;
  outputPath?: string;
  isConverting?: boolean;
  conversionStatus?: 'idle' | 'converting' | 'success' | 'error';
  errorMessage?: string;
}

export interface ImageSource {
  id: string;
  filePath: string;
  fileName: string;
  variants: ImageVariant[];
}

export interface ConversionResult {
  success: boolean;
  outputPath?: string;
  errorMessage?: string;
}
