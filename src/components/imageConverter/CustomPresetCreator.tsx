import React, { useState } from "react";
import {
  ImageVariant,
  ImageFormat,
} from "../../interface/imageConverter/IImageConverter";

interface CustomPresetCreatorProps {
  onApplyPreset: (variants: ImageVariant[]) => void;
  onClose: () => void;
}

type SizeType = "square" | "dimension" | "aspect";

interface SizeConfig {
  id: string;
  type: SizeType;
  value: string; // For square: "16", for dimension: "1920x1080", for aspect: "16:9@1920"
}

export const CustomPresetCreator: React.FC<CustomPresetCreatorProps> = ({
  onApplyPreset,
  onClose,
}) => {
  const [nameParts, setNameParts] = useState<string[]>(["custom"]);
  const [resolutionPosition, setResolutionPosition] = useState<number>(2);
  const [formats, setFormats] = useState<string>("png");
  const [sizes, setSizes] = useState<SizeConfig[]>([
    { id: "1", type: "square", value: "512" },
  ]);

  const addSize = () => {
    setSizes([
      ...sizes,
      { id: Date.now().toString(), type: "square", value: "" },
    ]);
  };

  const removeSize = (id: string) => {
    setSizes(sizes.filter((s) => s.id !== id));
  };

  const updateSize = (id: string, field: keyof SizeConfig, value: any) => {
    setSizes(sizes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const buildFileName = (width: number, height: number): string => {
    const resolution = `${width}x${height}`;
    const parts = [...nameParts];
    parts.splice(resolutionPosition - 1, 0, resolution);
    return parts.join("");
  };

  const parseSize = (
    config: SizeConfig
  ): { width: number; height: number; name: string }[] => {
    const results: { width: number; height: number; name: string }[] = [];

    try {
      if (config.type === "square") {
        const sizes = config.value
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        for (const sizeStr of sizes) {
          const size = parseInt(sizeStr);
          if (!isNaN(size) && size > 0) {
            results.push({
              width: size,
              height: size,
              name: buildFileName(size, size),
            });
          }
        }
      } else if (config.type === "dimension") {
        const parts = config.value.split("x");
        if (parts.length !== 2) return results;
        const width = parseInt(parts[0]);
        const height = parseInt(parts[1]);
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0)
          return results;
        results.push({
          width,
          height,
          name: buildFileName(width, height),
        });
      } else if (config.type === "aspect") {
        const parts = config.value.split("@");
        if (parts.length !== 2) return results;
        const [aspectStr, baseSize] = parts;
        const aspectParts = aspectStr.split(":");
        if (aspectParts.length !== 2) return results;

        const aspectW = parseFloat(aspectParts[0]);
        const aspectH = parseFloat(aspectParts[1]);
        const base = parseInt(baseSize);

        if (isNaN(aspectW) || isNaN(aspectH) || isNaN(base) || base <= 0)
          return results;

        const width = base;
        const height = Math.round((base / aspectW) * aspectH);

        results.push({
          width,
          height,
          name: buildFileName(width, height),
        });
      }
      return results;
    } catch {
      return results;
    }
  };

  const handleGenerate = () => {
    const variants: ImageVariant[] = [];
    const formatList = formats
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f) as ImageFormat[];

    for (const sizeConfig of sizes) {
      const parsedSizes = parseSize(sizeConfig);
      for (const parsed of parsedSizes) {
        for (const fmt of formatList) {
          variants.push({
            id: `custom-${Date.now()}-${Math.random()}`,
            name: parsed.name,
            format: fmt,
            width: parsed.width,
            height: parsed.height,
            conversionStatus: "idle",
          });
        }
      }
    }

    if (variants.length > 0) {
      onApplyPreset(variants);
      onClose();
    } else {
      alert("⚠️ Please add at least one valid size configuration");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">
              Create Custom Preset
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name Parts (comma-separated)
              </label>
              <input
                type="text"
                value={nameParts.join(",")}
                onChange={(e) =>
                  setNameParts(
                    e.target.value.split(",").map((p) => p.trim())
                  )
                }
                placeholder="e.g., Square_, Logo, Tauri"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Parts that will form the filename (resolution will be inserted
                at chosen position)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resolution Position
                </label>
                <select
                  value={resolutionPosition}
                  onChange={(e) =>
                    setResolutionPosition(parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  {Array.from(
                    { length: nameParts.length + 1 },
                    (_, i) => i + 1
                  ).map((pos) => (
                    <option key={pos} value={pos}>
                      Position {pos}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Where to insert resolution (e.g., 16x16)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Formats (comma-separated)
                </label>
                <input
                  type="text"
                  value={formats}
                  onChange={(e) => setFormats(e.target.value)}
                  placeholder="e.g., png, jpg, webp"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Output formats for each size
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Sizes</h3>
              <button
                onClick={addSize}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                + Add Size
              </button>
            </div>

            <div className="space-y-3">
              {sizes.map((size) => (
                <div
                  key={size.id}
                  className="flex flex-col sm:flex-row gap-2 p-3 border rounded-md dark:border-gray-600"
                >
                  <select
                    value={size.type}
                    onChange={(e) =>
                      updateSize(size.id, "type", e.target.value)
                    }
                    className="px-2 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
                  >
                    <option value="square">Square</option>
                    <option value="dimension">Dimension</option>
                    <option value="aspect">Aspect Ratio</option>
                  </select>

                  <input
                    type="text"
                    value={size.value}
                    onChange={(e) =>
                      updateSize(size.id, "value", e.target.value)
                    }
                    placeholder={
                      size.type === "square"
                        ? "16,32,64,128,256,512"
                        : size.type === "dimension"
                        ? "1920x1080"
                        : "16:9@1920"
                    }
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
                  />

                  <button
                    onClick={() => removeSize(size.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm">
              <p className="font-semibold mb-2">Examples:</p>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong>Name Parts:</strong> Square_, Logo, Tauri
                  <br />
                  <strong>Resolution at Position 2:</strong>{" "}
                  Square_16x16LogoTauri
                </li>
                <li>
                  <strong>Square Sizes:</strong> 16,32,64,512 → creates 16x16,
                  32x32, 64x64, 512x512
                </li>
                <li>
                  <strong>Dimension:</strong> 1920x1080 → creates exact
                  dimensions
                </li>
                <li>
                  <strong>Formats:</strong> png, jpg, webp → creates all
                  variants in each format
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="text-sm font-semibold mb-2">
              Preview (
              {sizes.reduce((total, s) => {
                const formatList = formats
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f);
                return total + parseSize(s).length * formatList.length;
              }, 0)}{" "}
              variants):
            </h3>
            <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
              {sizes.map((size) => {
                const parsedSizes = parseSize(size);
                const formatList = formats
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f);
                return parsedSizes.flatMap((parsed, idx) =>
                  formatList.map((fmt, fmtIdx) => (
                    <div
                      key={`${size.id}-${idx}-${fmtIdx}`}
                      className="flex justify-between"
                    >
                      <span className="font-mono">
                        {parsed.name}.{fmt}
                      </span>
                      <span className="text-gray-500">
                        {parsed.width}x{parsed.height}
                      </span>
                    </div>
                  ))
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Generate Variants
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
