# Image Converter Feature

## Overview
The Image Converter is a powerful tool that allows users to batch convert images to different formats, sizes, and resolutions. It's perfect for creating multiple variants of app icons or assets in one go.

## Features

### 1. **Multi-Image Support**
- Select one or multiple source images at once
- Each image can have multiple output variants
- Process all images and variants in a single batch

### 2. **Per-Variant Configuration**
Each output variant can be customized with:
- **Custom Name**: Set a unique name for each output file (e.g., `icon_30x30`, `banner_1920x1080`)
- **Format Selection**: Choose from PNG, JPG, JPEG, WebP, BMP, TIFF, or ICO
- **Size Constraints**: Set minimum and maximum file sizes in KB (optional)
- **Resolution**: Specify exact width and height in pixels

### 3. **Flexible Execution Options**
- **Run Single Variant**: Convert one specific variant at a time
- **Run All Variants for Image**: Convert all variants for a single image
- **Run All Images**: Batch convert all variants for all images in one click

### 4. **Real-time Status Feedback**
- See conversion progress with status indicators:
  - ⏳ Converting...
  - ✅ Success (with output path)
  - ❌ Error (with error message)

## How to Use

### Step 1: Select Images
1. Click **"📁 Select Images"**
2. Choose one or more source images from your file system
3. Supported formats: PNG, JPG, JPEG, WebP, BMP, TIFF

### Step 2: Select Output Directory
1. Click **"📂 Select Output Directory"**
2. Choose where you want the converted images to be saved

### Step 3: Configure Variants
For each image, configure one or more output variants:
1. **Name**: Enter the output filename (without extension)
2. **Format**: Select the desired image format from the dropdown
3. **Min KB** (optional): Set minimum file size
4. **Max KB** (optional): Set maximum file size
5. **Width**: Enter the desired width in pixels
6. **Height**: Enter the desired height in pixels

### Step 4: Add More Variants (Optional)
- Click **"+ Add Variant"** to create additional output variants for an image
- Each variant can have completely different settings

### Step 5: Convert
Choose your conversion method:
- **Individual "Run" button**: Convert a single variant
- **"▶ Run All Variants"**: Convert all variants for one image
- **"🚀 Convert All Images"**: Batch convert everything

## Example Use Cases

### App Icon Generation
Create multiple icon sizes from one source:
```
Source: app_icon.png (1024x1024)

Variants:
1. name: icon_16x16    | format: PNG  | width: 16   | height: 16
2. name: icon_32x32    | format: PNG  | width: 32   | height: 32
3. name: icon_64x64    | format: PNG  | width: 64   | height: 64
4. name: icon_128x128  | format: PNG  | width: 128  | height: 128
5. name: icon_256x256  | format: PNG  | width: 256  | height: 256
```

### Web Asset Optimization
Convert to different formats and sizes:
```
Source: hero_image.jpg

Variants:
1. name: hero_desktop  | format: WebP | width: 1920 | height: 1080 | max: 500KB
2. name: hero_tablet   | format: WebP | width: 1024 | height: 768  | max: 300KB
3. name: hero_mobile   | format: WebP | width: 640  | height: 480  | max: 150KB
4. name: hero_thumb    | format: JPG  | width: 320  | height: 240  | max: 50KB
```

### Bulk Processing
Process multiple product images at once:
```
Sources: product1.jpg, product2.jpg, product3.jpg

For each image, create:
1. Large:  1200x1200 WebP
2. Medium: 600x600 WebP
3. Small:  300x300 WebP
4. Thumb:  150x150 JPG
```

## Technical Requirements

### Prerequisites
- **FFmpeg** must be installed and available in your system PATH
- The app uses FFmpeg for all image conversion operations

### Installing FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt-get install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch
sudo pacman -S ffmpeg
```

## Permissions
The following Tauri permissions are required (already configured):
- `dialog:allow-open` - For file/directory selection
- `shell:allow-execute` - For running FFmpeg commands
- `fs:allow-read-file` - For reading source images
- `fs:allow-stat` - For checking file sizes

## Tips & Best Practices

1. **Test First**: Start with a single variant to ensure your FFmpeg installation works
2. **Output Directory**: Choose an empty directory or one you don't mind filling with converted images
3. **Naming**: Use descriptive names that include dimensions (e.g., `logo_512x512`)
4. **Size Constraints**: Use min/max size constraints when you need specific file sizes for platforms (e.g., app stores)
5. **Batch Processing**: Group similar conversions together and use the batch convert feature
6. **Error Handling**: If a conversion fails, check the error message - it usually indicates missing FFmpeg or invalid parameters

## Troubleshooting

### "FFmpeg not found" error
- Ensure FFmpeg is installed and in your system PATH
- Restart the application after installing FFmpeg

### Conversion fails silently
- Check that the output directory exists and is writable
- Verify the source image is not corrupted
- Try smaller dimensions or different format

### File size constraints not met
- The converter will show an error if the output doesn't meet min/max size requirements
- Adjust quality settings or dimensions to achieve desired file sizes

## Future Enhancements
- Custom quality settings per format
- Aspect ratio locking
- Preview before conversion
- Preset templates for common use cases
- Progress bars for batch operations
- History of conversions
