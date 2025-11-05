# BIM - Batch Image Manager

A cross-platform desktop app for advanced batch image conversion, built with Tauri, React, TypeScript, Zustand, and FFmpeg.

## Download

Download the latest BIM binary from the [GitHub Releases](https://github.com/AhmedTrooper/BIM/releases) section:
- [Latest Release](https://github.com/AhmedTrooper/BIM/releases/latest)

Choose the appropriate binary for your operating system (Windows, Linux, macOS) and follow the installation instructions in the release notes.

## Screenshots

Below are screenshots of the app in action:

![Screenshot 1](resources/images/Screenshot%20from%202025-11-05%2016-46-42.png)
![Screenshot 2](resources/images/Screenshot%20from%202025-11-05%2016-47-07.png)
![Screenshot 3](resources/images/Screenshot%20from%202025-11-05%2016-47-47.png)
![Screenshot 4](resources/images/Screenshot%20from%202025-11-05%2016-47-52.png)
![Screenshot 5](resources/images/Screenshot%20from%202025-11-05%2016-48-36.png)
![Screenshot 6](resources/images/Screenshot%20from%202025-11-05%2016-48-44.png)
![Screenshot 7](resources/images/Screenshot%20from%202025-11-05%2016-48-48.png)
![Screenshot 8](resources/images/Screenshot%20from%202025-11-05%2016-48-56.png)
![Screenshot 9](resources/images/Screenshot%20from%202025-11-05%2018-55-34.png)
![Screenshot 10](resources/images/Screenshot%20from%202025-11-05%2018-55-38.png)
![Screenshot 11](resources/images/Screenshot%20from%202025-11-05%2018-55-46.png)
![Screenshot 12](resources/images/Screenshot%20from%202025-11-05%2018-55-54.png)
![Screenshot 13](resources/images/Screenshot%20from%202025-11-05%2018-56-01.png)
![Screenshot 14](resources/images/Screenshot%20from%202025-11-05%2018-56-09.png)

## Tech Stack

- **Tauri v2** (Rust, Native Shell)
- **React** (18+)
- **TypeScript** (Strict Types)
- **Zustand** (State Management)
- **Framer Motion** (Animations)
- **FFmpeg** (Native Conversion)
- **HeroUI** (UI Components)
- **Lucide Icons** (Iconography)
- **TailwindCSS** (Styling)

## Project Structure

```
BIM/
├── resources/
│   ├── images/                # App screenshots
│   └── metadata/update.json   # Remote update metadata
├── src/
│   ├── components/
│   │   └── imageConverter/    # Image conversion UI & logic
│   │   └── menuBar/           # Navigation & metadata info
│   ├── constants/
│   │   └── routes/            # Route definitions
│   ├── interface/
│   │   ├── imageConverter/    # Image & preset interfaces
│   │   ├── metadata/          # Update, dependency, app interfaces
│   │   └── store/             # Zustand state interfaces
│   ├── routes/                # Main app pages
│   ├── store/                 # Zustand stores
│   ├── ui/                    # UI components
│   └── utils/                 # Conversion & detection logic
├── package.json               # Dependencies
├── README.md                  # Project documentation
└── ...
```

## Technical Highlights

- **Modular Architecture**: Separation of concerns for maintainability and scalability.
- **Strongly Typed Interfaces**: TypeScript contracts for all app data, state, and metadata.
- **Custom Shell Integration**: Native FFmpeg execution via Tauri plugins.
- **Async Conversion**: Non-blocking image processing and feedback.
- **Robust State Management**: Zustand-powered stores for app, update, and theme state.
- **Update & Dependency System**: Real-time checks, semantic versioning, and user notifications.
- **Animated Navigation**: Framer Motion-powered sidebar, route transitions, and feedback.
- **Professional UI**: HeroUI components and Lucide icons for a modern look.
- **Cross-Platform Support**: Windows, Linux, macOS compatibility.
- **Security**: Tauri plugin isolation, safe shell execution, and strict dependency management.

## Key Interfaces

### Image Variant & Source
```ts
export interface ImageVariant {
  id: string;
  name: string;
  format: string;
  width: number;
  height: number;
  conversionStatus: string;
  outputPath?: string;
  errorMessage?: string;
}

export interface ImageSource {
  id: string;
  filePath: string;
  fileName: string;
  variants: ImageVariant[];
  customSubdirectory?: string;
}
```

### Update Metadata
```ts
export interface IRemoteUpdateState {
  application: IRemoteApplication;
  featureSet: IFeatureCollection;
  errorSet: IFixedErrorCollection;
  author: string;
  severity: ESeverity;
  dependencySet: IRemoteDependencyCollection;
}

export interface IRuntimeUpdateState extends IRemoteUpdateState {
  application: IRuntimeApplication;
  dependencySet: IRuntimeDependencyCollection;
}
```

### Zustand Store State
```ts
export interface IApplicationState {
  appName: string | null;
  appVersion: string | null;
  updateMetadata: IRuntimeUpdateState | null;
  isCheckingUpdate: boolean;
  updateCheckError: string | null;
  lastUpdateCheck: Date | null;
  fetchAppInfo: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  setUpdateMetadata: (metadata: IRuntimeUpdateState | null) => void;
  setIsCheckingUpdate: (status: boolean) => void;
  setUpdateCheckError: (error: string | null) => void;
  clearUpdateData: () => void;
}
```

## Core Logic Code Samples

### Image Conversion (FFmpeg)
```ts
export class FFmpegConverter {
  static buildCommand(inputPath, outputPath, variant) {
    // Build shell args for ffmpeg
    return ["-i", inputPath, "-vf", `scale=${variant.width}:${variant.height}`, "-y", outputPath];
  }
  static async convertImage(inputPath, variant, outputDirectory) {
    // Ensure output dir exists, build command, run via Tauri shell
    // Return result with success/error
  }
}
```

### State Management (Zustand)
```ts
export const useApplicationStore = create<IApplicationState>((set, get) => ({
  appName: null,
  appVersion: null,
  updateMetadata: null,
  fetchAppInfo: async () => { /* getName, getVersion */ },
  checkForUpdates: async () => { /* fetch update.json, compare versions */ },
}));
```

### Update Checking
```ts
const metadataUrl = "https://raw.githubusercontent.com/AhmedTrooper/BIM/main/resources/metadata/update.json";
const response = await fetch(metadataUrl);
const remoteData = await response.json();
// Compare versions, notify user
```

### Dependency Detection
```ts
const result = await checkDependencyUpdate(dep.type, dep.version.online);
// Check FFmpeg version, status, and update availability
```

## Explanations
- **Project Structure**: Modular, scalable, and organized for maintainability.
- **Interfaces**: Strongly typed contracts for all app data, state, and metadata.
- **Core Logic**: Custom shell integration, async conversion, and robust state management.
- **Update & Dependency**: Real-time checks, semantic versioning, and user notifications.
