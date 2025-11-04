import { Command } from '@tauri-apps/plugin-shell';
import { ImageVariant, ConversionResult } from '../interface/imageConverter/IImageConverter';

export class FFmpegConverter {
  /**
   * Build FFmpeg command for image conversion
   */
  static buildCommand(
    inputPath: string,
    outputPath: string,
    variant: ImageVariant
  ): string[] {
    const args: string[] = [
      '-i', inputPath,
      '-vf', `scale=${variant.width}:${variant.height}`,
      '-y', // Overwrite output file
    ];

    // Add quality/size optimization based on format
    switch (variant.format) {
      case 'jpg':
      case 'jpeg':
        args.push('-q:v', '2'); // High quality JPEG
        break;
      case 'png':
        args.push('-compression_level', '6'); // Balanced PNG compression
        break;
      case 'webp':
        args.push('-quality', '90'); // WebP quality
        break;
    }

    args.push(outputPath);
    return args;
  }

  /**
   * Convert a single image variant
   */
  static async convertImage(
    inputPath: string,
    variant: ImageVariant,
    outputDirectory: string
  ): Promise<ConversionResult> {
    try {
      const outputFileName = `${variant.name}.${variant.format}`;
      const outputPath = `${outputDirectory}/${outputFileName}`;

      const args = this.buildCommand(inputPath, outputPath, variant);

      // Execute FFmpeg command with dynamic arguments
      const command = Command.create('ffmpeg', args);
      const output = await command.execute();

      if (output.code === 0) {
        // Check file size if constraints are set
        if (variant.minSize || variant.maxSize) {
          const sizeValid = await this.validateFileSize(
            outputPath,
            variant.minSize,
            variant.maxSize
          );
          
          if (!sizeValid) {
            return {
              success: false,
              errorMessage: `File size outside constraints (min: ${variant.minSize}KB, max: ${variant.maxSize}KB)`,
            };
          }
        }

        return {
          success: true,
          outputPath,
        };
      } else {
        return {
          success: false,
          errorMessage: output.stderr || 'FFmpeg conversion failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Validate file size against constraints
   */
  private static async validateFileSize(
    filePath: string,
    minSizeKB?: number,
    maxSizeKB?: number
  ): Promise<boolean> {
    try {
      // Use Tauri's fs plugin to check file size
      const { stat } = await import('@tauri-apps/plugin-fs');
      const stats = await stat(filePath);
      const fileSizeKB = stats.size / 1024;

      if (minSizeKB && fileSizeKB < minSizeKB) {
        return false;
      }
      if (maxSizeKB && fileSizeKB > maxSizeKB) {
        return false;
      }
      return true;
    } catch {
      return true; // If we can't check, assume it's valid
    }
  }

  /**
   * Convert multiple variants of a single image
   */
  static async convertAllVariants(
    inputPath: string,
    variants: ImageVariant[],
    outputDirectory: string,
    onProgress?: (variantId: string, result: ConversionResult) => void
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];

    for (const variant of variants) {
      const result = await this.convertImage(inputPath, variant, outputDirectory);
      results.push(result);
      
      if (onProgress) {
        onProgress(variant.id, result);
      }
    }

    return results;
  }

  /**
   * Convert all variants for multiple images
   */
  static async convertBatch(
    images: Array<{ inputPath: string; variants: ImageVariant[] }>,
    outputDirectory: string,
    onProgress?: (imageIndex: number, variantId: string, result: ConversionResult) => void
  ): Promise<ConversionResult[][]> {
    const allResults: ConversionResult[][] = [];

    for (let i = 0; i < images.length; i++) {
      const { inputPath, variants } = images[i];
      const results = await this.convertAllVariants(
        inputPath,
        variants,
        outputDirectory,
        (variantId, result) => {
          if (onProgress) {
            onProgress(i, variantId, result);
          }
        }
      );
      allResults.push(results);
    }

    return allResults;
  }
}
