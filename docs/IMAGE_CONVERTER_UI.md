# Image Converter - UI Structure

## Component Hierarchy

```
ImageConverterPage
  └── ImageConverter (Main Component)
      ├── Control Panel
      │   ├── Select Images Button (📁)
      │   ├── Select Output Directory Button (📂)
      │   ├── Output Path Display
      │   └── Convert All Images Button (🚀)
      │
      └── Images List (For each image)
          ├── Image Header
          │   ├── Image Name & Path
          │   ├── Run All Variants Button (▶)
          │   └── Remove Image Button
          │
          ├── Variants Section
          │   ├── Preset Selector Dropdown
          │   └── Variant Rows (For each variant)
          │       └── ImageVariantRow Component
          │           ├── Name Input
          │           ├── Format Selector
          │           ├── Min Size Input
          │           ├── Max Size Input
          │           ├── Width Input
          │           ├── Height Input
          │           ├── Run Button
          │           ├── Delete Button
          │           └── Status Display
          │
          └── Add Variant Button (+)
```

## Layout Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│  Image Converter                                                │
├─────────────────────────────────────────────────────────────────┤
│  Control Panel                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [📁 Select Images] [📂 Select Output Directory]         │   │
│  │ Output: /path/to/output    [🚀 Convert All Images (3)]  │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Image 1: photo.jpg                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ /home/user/photos/photo.jpg                             │   │
│  │                          [▶ Run All Variants (5)]  [Remove]│ │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ Variants:              Apply Preset: [-- Select Preset --▼]│ │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ┌───────────────────────────────────────────────────────┐  │
│  │ │ Name: icon_512 | Format: PNG▼ | Min:    | Max:       │  │
│  │ │ W: 512 | H: 512                     [Run]  [✕]       │  │
│  │ │ ✅ Success: /output/icon_512.png                      │  │
│  │ └───────────────────────────────────────────────────────┘  │
│  │ ┌───────────────────────────────────────────────────────┐  │
│  │ │ Name: icon_256 | Format: PNG▼ | Min:    | Max:       │  │
│  │ │ W: 256 | H: 256                     [Run]  [✕]       │  │
│  │ │ ⏳ Converting...                                      │  │
│  │ └───────────────────────────────────────────────────────┘  │
│  │ [+ Add Variant]                                            │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Image 2: banner.png                                            │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
START
  │
  ├─> Click "Select Images"
  │   └─> File dialog opens
  │       └─> User selects 1+ images
  │           └─> Images added to list with default variant
  │
  ├─> Click "Select Output Directory"
  │   └─> Folder dialog opens
  │       └─> User selects destination folder
  │
  ├─> Configure Variants (for each image)
  │   │
  │   ├─> Option A: Manual Configuration
  │   │   └─> Modify name, format, size, resolution
  │   │       └─> Click "+ Add Variant" for more
  │   │
  │   └─> Option B: Use Preset
  │       └─> Select from dropdown
  │           └─> All variants auto-populated
  │
  ├─> Execute Conversion
  │   │
  │   ├─> Single Variant: Click variant's [Run] button
  │   │   └─> FFmpeg executes for that variant
  │   │       └─> Status updates (⏳ → ✅/❌)
  │   │
  │   ├─> All Variants for Image: Click [▶ Run All Variants]
  │   │   └─> FFmpeg executes for each variant sequentially
  │   │       └─> Progress updates per variant
  │   │
  │   └─> All Images: Click [🚀 Convert All Images]
  │       └─> FFmpeg executes for all variants of all images
  │           └─> Complete batch processing
  │
  └─> Check Results
      ├─> Green checkmark ✅: Conversion successful
      ├─> Red X ❌: Conversion failed (see error message)
      └─> Output path displayed on success
```

## Preset Selection Flow

```
User clicks preset dropdown for Image 1
  │
  ├─> Selects "App Icons"
  │   └─> Replaces all variants with:
  │       • icon_16 (16x16 PNG)
  │       • icon_32 (32x32 PNG)
  │       • icon_48 (48x48 PNG)
  │       • icon_64 (64x64 PNG)
  │       • icon_128 (128x128 PNG)
  │       • icon_256 (256x256 PNG)
  │       • icon_512 (512x512 PNG)
  │       • icon_1024 (1024x1024 PNG)
  │
  ├─> Selects "Social Media"
  │   └─> Replaces all variants with:
  │       • facebook_cover (820x312 JPG)
  │       • facebook_post (1200x630 JPG)
  │       • twitter_header (1500x500 JPG)
  │       • instagram_post (1080x1080 JPG)
  │       • etc...
  │
  └─> Selects "Responsive Web Images"
      └─> Replaces all variants with:
          • desktop_2x (1920x1080 WebP)
          • desktop_1x (1280x720 WebP)
          • tablet_2x (1024x768 WebP)
          • mobile_2x (750x1334 WebP)
          • etc...
```

## Conversion Execution Flow

```
User clicks any Run button
  │
  ├─> Validation
  │   ├─> Check if output directory selected
  │   └─> Check if FFmpeg available
  │
  ├─> Build FFmpeg Command
  │   └─> FFmpegConverter.buildCommand()
  │       ├─> Input path
  │       ├─> Output path (directory + name + format)
  │       ├─> Scale filter (width x height)
  │       └─> Format-specific options
  │
  ├─> Execute Command
  │   └─> Command.create('ffmpeg', args)
  │       └─> Execute asynchronously
  │
  ├─> Process Result
  │   ├─> Exit code 0 (Success)
  │   │   ├─> Validate file size (if constraints set)
  │   │   ├─> Update status to success ✅
  │   │   └─> Display output path
  │   │
  │   └─> Exit code ≠ 0 (Error)
  │       ├─> Update status to error ❌
  │       └─> Display error message
  │
  └─> UI Update
      └─> Status indicator changes
          └─> User can proceed or retry
```

## Available Presets

1. **App Icons** (8 variants)
   - 16x16 to 1024x1024 PNG

2. **Responsive Web Images** (6 variants)
   - Desktop, Tablet, Mobile @ 1x and 2x WebP

3. **Social Media** (8 variants)
   - Facebook, Twitter, Instagram, LinkedIn, YouTube JPG

4. **Favicon Set** (6 variants)
   - ICO + PNG variants + Apple/Android icons

5. **Thumbnail Sizes** (3 variants)
   - Small, Medium, Large JPG with size constraints

6. **E-commerce Product Images** (5 variants)
   - Full to Thumb JPG with size constraints

7. **Print Quality** (3 variants)
   - A4, Letter, A5 @ 300 DPI TIFF

## State Management

```typescript
interface State {
  images: ImageSource[];          // All loaded images
  outputDirectory: string;        // Selected output path
  isProcessing: boolean;          // Global processing flag
  selectedPreset: string;         // Currently selected preset
}

interface ImageSource {
  id: string;                     // Unique identifier
  filePath: string;               // Absolute path to source
  fileName: string;               // Display name
  variants: ImageVariant[];       // Array of output configs
}

interface ImageVariant {
  id: string;                     // Unique identifier
  name: string;                   // Output filename
  format: ImageFormat;            // Output format
  minSize?: number;               // Min size in KB
  maxSize?: number;               // Max size in KB
  width: number;                  // Output width
  height: number;                 // Output height
  outputPath?: string;            // Result path (after conversion)
  isConverting?: boolean;         // Individual processing flag
  conversionStatus?: Status;      // idle/converting/success/error
  errorMessage?: string;          // Error details
}
```

## Key Features Highlighted

✅ **Multi-level batch operations**
- Single variant, single image, or all images

✅ **Preset system**
- 7 built-in presets for common use cases

✅ **Real-time feedback**
- Status indicators and messages

✅ **Flexible configuration**
- Every parameter customizable per variant

✅ **File size validation**
- Optional min/max constraints

✅ **Error handling**
- Graceful failure with helpful messages

✅ **Async processing**
- Non-blocking UI during conversions
