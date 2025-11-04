import React, { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { ImageSource, ImageVariant } from '../../interface/imageConverter/IImageConverter';
import { ImageVariantRow } from './ImageVariantRow';
import { FFmpegConverter } from '../../utils/FFmpegConverter';
import { CONVERSION_PRESETS, applyPreset } from '../../utils/ConversionPresets';
import { CustomPresetCreator } from './CustomPresetCreator';

export const ImageConverter: React.FC = () => {
  const [images, setImages] = useState<ImageSource[]>([]);
  const [outputDirectory, setOutputDirectory] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [showCustomPresetModal, setShowCustomPresetModal] = useState(false);
  const [currentImageIdForPreset, setCurrentImageIdForPreset] = useState<string>('');

  const extractFileName = (path: string): string => {
    return path.split('/').pop() || path.split('\\').pop() || 'unknown';
  };

  const handleSelectImages = async () => {
    try {
      const selected = await open({
        multiple: true,
        filters: [{
          name: 'Images',
          extensions: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff']
        }]
      });

      if (selected) {
        if (Array.isArray(selected)) {
          const newImages: ImageSource[] = selected.map((filePath: string, index) => ({
            id: `img-${Date.now()}-${index}`,
            filePath,
            fileName: extractFileName(filePath),
            variants: [createDefaultVariant()]
          }));

          setImages([...images, ...newImages]);
        } else if (typeof selected === 'string') {
          const newImage: ImageSource = {
            id: `img-${Date.now()}`,
            filePath: selected,
            fileName: extractFileName(selected),
            variants: [createDefaultVariant()]
          };
          setImages([...images, newImage]);
        }
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      alert('Failed to select images');
    }
  };

  const handleSelectOutputDirectory = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false
      });

      if (selected && typeof selected === 'string') {
        setOutputDirectory(selected);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      alert('Failed to select output directory');
    }
  };

  const createDefaultVariant = (): ImageVariant => ({
    id: `variant-${Date.now()}-${Math.random()}`,
    name: 'output',
    format: 'png',
    width: 512,
    height: 512,
    conversionStatus: 'idle'
  });

  const handleAddVariant = (imageId: string) => {
    setImages(images.map(img => 
      img.id === imageId 
        ? { ...img, variants: [...img.variants, createDefaultVariant()] }
        : img
    ));
  };

  const handleApplyPreset = (imageId: string, presetId: string) => {
    const preset = CONVERSION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const newVariants = applyPreset(preset);
    setImages(images.map(img =>
      img.id === imageId
        ? { ...img, variants: newVariants }
        : img
    ));
    setSelectedPreset('');
  };

  const handleOpenCustomPreset = (imageId: string) => {
    setCurrentImageIdForPreset(imageId);
    setShowCustomPresetModal(true);
  };

  const handleApplyCustomPreset = (variants: ImageVariant[]) => {
    if (currentImageIdForPreset) {
      setImages(images.map(img =>
        img.id === currentImageIdForPreset
          ? { ...img, variants }
          : img
      ));
    }
  };

  const handleUpdateVariant = (imageId: string, variantId: string, updatedVariant: ImageVariant) => {
    setImages(images.map(img =>
      img.id === imageId
        ? {
            ...img,
            variants: img.variants.map(v => v.id === variantId ? updatedVariant : v)
          }
        : img
    ));
  };

  const handleDeleteVariant = (imageId: string, variantId: string) => {
    setImages(images.map(img =>
      img.id === imageId
        ? { ...img, variants: img.variants.filter(v => v.id !== variantId) }
        : img
    ));
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const handleRunSingleVariant = async (imageId: string, variantId: string) => {
    if (!outputDirectory) {
      alert('⚠️ Please select an output directory first!');
      return;
    }

    const image = images.find(img => img.id === imageId);
    const variant = image?.variants.find(v => v.id === variantId);

    if (!image || !variant) return;

    updateVariantStatus(imageId, variantId, { isConverting: true, conversionStatus: 'converting' });

    try {
      const finalOutputDir = image.customSubdirectory 
        ? `${outputDirectory}/${image.customSubdirectory}`
        : outputDirectory;
      
      const result = await FFmpegConverter.convertImage(image.filePath, variant, finalOutputDir);

      if (result.success) {
        updateVariantStatus(imageId, variantId, {
          isConverting: false,
          conversionStatus: 'success',
          outputPath: result.outputPath
        });
      } else {
        updateVariantStatus(imageId, variantId, {
          isConverting: false,
          conversionStatus: 'error',
          errorMessage: result.errorMessage
        });
      }
    } catch (error) {
      updateVariantStatus(imageId, variantId, {
        isConverting: false,
        conversionStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleRunAllVariantsForImage = async (imageId: string) => {
    if (!outputDirectory) {
      alert('⚠️ Please select an output directory first!');
      return;
    }

    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setIsProcessing(true);

    image.variants.forEach(variant => {
      updateVariantStatus(imageId, variant.id, { isConverting: true, conversionStatus: 'converting' });
    });

    const finalOutputDir = image.customSubdirectory 
      ? `${outputDirectory}/${image.customSubdirectory}`
      : outputDirectory;

    await FFmpegConverter.convertAllVariants(
      image.filePath,
      image.variants,
      finalOutputDir,
      (variantId, result) => {
        if (result.success) {
          updateVariantStatus(imageId, variantId, {
            isConverting: false,
            conversionStatus: 'success',
            outputPath: result.outputPath
          });
        } else {
          updateVariantStatus(imageId, variantId, {
            isConverting: false,
            conversionStatus: 'error',
            errorMessage: result.errorMessage
          });
        }
      }
    );

    setIsProcessing(false);
  };

  const handleRunAllImages = async () => {
    if (!outputDirectory) {
      alert('⚠️ Please select an output directory first!');
      return;
    }

    if (images.length === 0) {
      alert('⚠️ Please add some images first!');
      return;
    }

    setIsProcessing(true);

    images.forEach(image => {
      image.variants.forEach(variant => {
        updateVariantStatus(image.id, variant.id, { isConverting: true, conversionStatus: 'converting' });
      });
    });

    const imagesToConvert = images.map(img => ({
      inputPath: img.filePath,
      variants: img.variants,
      outputDirectory: img.customSubdirectory 
        ? `${outputDirectory}/${img.customSubdirectory}`
        : outputDirectory
    }));

    for (let i = 0; i < imagesToConvert.length; i++) {
      const { inputPath, variants, outputDirectory: finalOutputDir } = imagesToConvert[i];
      await FFmpegConverter.convertAllVariants(
        inputPath,
        variants,
        finalOutputDir,
        (variantId, result) => {
          const imageId = images[i].id;
          if (result.success) {
            updateVariantStatus(imageId, variantId, {
              isConverting: false,
              conversionStatus: 'success',
              outputPath: result.outputPath
            });
          } else {
            updateVariantStatus(imageId, variantId, {
              isConverting: false,
              conversionStatus: 'error',
              errorMessage: result.errorMessage
            });
          }
        }
      );
    }

    setIsProcessing(false);
  };

  const updateVariantStatus = (imageId: string, variantId: string, updates: Partial<ImageVariant>) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === imageId
          ? {
              ...img,
              variants: img.variants.map(v =>
                v.id === variantId ? { ...v, ...updates } : v
              )
            }
          : img
      )
    );
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Image Converter</h1>

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
          <button
            onClick={handleSelectImages}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm sm:text-base"
            disabled={isProcessing}
          >
            📁 Select Images
          </button>

          <button
            onClick={handleSelectOutputDirectory}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm sm:text-base"
            disabled={isProcessing}
          >
            📂 Select Output Directory
          </button>

          {outputDirectory && (
            <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-xs sm:text-sm break-all">
              <strong>Output:</strong> {outputDirectory}
            </div>
          )}

          {!outputDirectory && images.length > 0 && (
            <div className="flex-1 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Please select an output directory to convert images
            </div>
          )}

          {images.length > 0 && (
            <button
              onClick={handleRunAllImages}
              className="px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-bold text-sm sm:text-base"
              disabled={isProcessing || !outputDirectory}
            >
              🚀 Convert All ({images.length})
            </button>
          )}
        </div>
      </div>

      {/* Images List */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No images selected. Click "Select Images" to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {images.map((image, imageIndex) => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              {/* Image Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      Image {imageIndex + 1}: {image.fileName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 break-all">
                      {image.filePath}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Custom Subdirectory (Optional)
                    </label>
                    <input
                      type="text"
                      value={image.customSubdirectory || ''}
                      onChange={(e) => {
                        const newImages = [...images];
                        newImages[imageIndex] = {
                          ...newImages[imageIndex],
                          customSubdirectory: e.target.value || undefined
                        };
                        setImages(newImages);
                      }}
                      placeholder="e.g., icons, thumbnails, or leave empty"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 text-sm"
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Outputs will be saved to: {outputDirectory || '<select output directory>'}/{image.customSubdirectory || '<image variants>'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:mt-0">
                  <button
                    onClick={() => handleRunAllVariantsForImage(image.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
                    disabled={isProcessing || !outputDirectory}
                  >
                    ▶ Run All ({image.variants.length})
                  </button>
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    disabled={isProcessing}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-medium">Variants:</h3>
                  
                  {/* Preset Selector */}
                  <div className="flex gap-2 items-center flex-wrap">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">Preset:</label>
                    <select
                      value={selectedPreset}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleApplyPreset(image.id, e.target.value);
                        }
                      }}
                      className="flex-1 sm:flex-none px-2 sm:px-3 py-1 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-xs sm:text-sm"
                      disabled={isProcessing}
                    >
                      <option value="">-- Select Preset --</option>
                      {CONVERSION_PRESETS.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleOpenCustomPreset(image.id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-xs sm:text-sm whitespace-nowrap"
                      disabled={isProcessing}
                    >
                      ✨ Custom
                    </button>
                  </div>
                </div>

                {image.variants.map((variant) => (
                  <ImageVariantRow
                    key={variant.id}
                    variant={variant}
                    onUpdate={(updated) => handleUpdateVariant(image.id, variant.id, updated)}
                    onDelete={() => handleDeleteVariant(image.id, variant.id)}
                    onRun={() => handleRunSingleVariant(image.id, variant.id)}
                    disabled={isProcessing}
                  />
                ))}
              </div>

              {/* Add Variant Button */}
              <button
                onClick={() => handleAddVariant(image.id)}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                disabled={isProcessing}
              >
                + Add Variant
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Preset Creator Modal */}
      {showCustomPresetModal && (
        <CustomPresetCreator
          onApplyPreset={handleApplyCustomPreset}
          onClose={() => setShowCustomPresetModal(false)}
        />
      )}
    </div>
  );
};
