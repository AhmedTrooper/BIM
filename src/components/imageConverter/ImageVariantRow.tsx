import React from 'react';
import { ImageVariant, ImageFormat } from '../../interface/imageConverter/IImageConverter';

interface ImageVariantRowProps {
  variant: ImageVariant;
  onUpdate: (updatedVariant: ImageVariant) => void;
  onDelete: () => void;
  onRun: () => void;
  disabled?: boolean;
}

const IMAGE_FORMATS: ImageFormat[] = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'tiff', 'ico'];

export const ImageVariantRow: React.FC<ImageVariantRowProps> = ({
  variant,
  onUpdate,
  onDelete,
  onRun,
  disabled = false,
}) => {
  const handleFieldChange = (field: keyof ImageVariant, value: any) => {
    onUpdate({
      ...variant,
      [field]: value,
    });
  };

  const getStatusColor = () => {
    switch (variant.conversionStatus) {
      case 'converting':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return '';
    }
  };

  const getStatusIcon = () => {
    switch (variant.conversionStatus) {
      case 'converting':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '';
    }
  };

  return (
    <div className="border rounded-lg p-3 sm:p-4 mb-3 bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col gap-3">
        {/* Row 1: Name and Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              value={variant.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g., icon_30x30"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            />
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-medium mb-1">Format</label>
            <select
              value={variant.format}
              onChange={(e) => handleFieldChange('format', e.target.value as ImageFormat)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            >
              {IMAGE_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Size Constraints */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Min KB (Optional)</label>
            <input
              type="number"
              value={variant.minSize || ''}
              onChange={(e) => handleFieldChange('minSize', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No min"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Max KB (Optional)</label>
            <input
              type="number"
              value={variant.maxSize || ''}
              onChange={(e) => handleFieldChange('maxSize', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No max"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Row 3: Dimensions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Width (px)</label>
            <input
              type="number"
              value={variant.width}
              onChange={(e) => handleFieldChange('width', Number(e.target.value))}
              placeholder="Width"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Height (px)</label>
            <input
              type="number"
              value={variant.height}
              onChange={(e) => handleFieldChange('height', Number(e.target.value))}
              placeholder="Height"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Row 4: Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onRun}
            disabled={disabled || variant.isConverting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
          >
            {variant.isConverting ? 'Converting...' : 'Run'}
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            Delete
          </button>
        </div>

        {/* Status & Error Message */}
        {variant.conversionStatus && variant.conversionStatus !== 'idle' && (
          <div className={`text-sm flex items-center gap-2 ${getStatusColor()}`}>
            <span>{getStatusIcon()}</span>
            {variant.conversionStatus === 'error' && variant.errorMessage ? (
              <span>{variant.errorMessage}</span>
            ) : (
              <span>
                {variant.conversionStatus === 'converting' && 'Converting...'}
                {variant.conversionStatus === 'success' && `Saved to: ${variant.outputPath}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
