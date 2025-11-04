import { Command } from "@tauri-apps/plugin-shell";
import { 
  EDependencyType, 
  EDependencyStatus,
  IDependencyDetector,
  IDependencyCheckResult 
} from "@/interface/metadata/DependencyInterface";

const DEPENDENCY_DETECTORS: Record<EDependencyType, IDependencyDetector> = {
  [EDependencyType.NodeJS]: {
    command: "node",
    args: ["--version"],
    versionRegex: /v?(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.NPM]: {
    command: "npm",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Yarn]: {
    command: "yarn",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.PNPM]: {
    command: "pnpm",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Git]: {
    command: "git",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Docker]: {
    command: "docker",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Python]: {
    command: "python",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Pip]: {
    command: "pip",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Rust]: {
    command: "rustc",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Cargo]: {
    command: "cargo",
    args: ["--version"],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Go]: {
    command: "go",
    args: ["version"],
    versionRegex: /go(\d+\.\d+\.\d+)/,
  },
  [EDependencyType.Java]: {
    command: "java",
    args: ["-version"],
    versionRegex: /"(\d+\.\d+\.\d+)"/,
  },
  [EDependencyType.Custom]: {
    command: "",
    args: [],
    versionRegex: /(\d+\.\d+\.\d+)/,
  },
};

const versionCache = new Map<string, { version: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function detectDependencyVersion(
  type: EDependencyType,
  customCommand?: { command: string; args: string[]; versionRegex?: RegExp }
): Promise<string> {
  const cacheKey = customCommand 
    ? `${customCommand.command}-${customCommand.args.join('-')}`
    : type;
  
  const cached = versionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.version;
  }

  try {
    const detector = DEPENDENCY_DETECTORS[type];
    const command = customCommand?.command || detector.command;
    const args = customCommand?.args || detector.args;
    const versionRegex = customCommand?.versionRegex || detector.versionRegex;
    
    if (!command) {
      return "unknown";
    }

    const cmd = Command.create(command, args);
    const output = await cmd.execute();

    if (output.code === 0) {
      const combinedOutput = output.stdout + output.stderr;
      const versionMatch = combinedOutput.match(versionRegex);
      const version = versionMatch ? versionMatch[1] : "unknown";
      
      versionCache.set(cacheKey, { version, timestamp: Date.now() });
      return version;
    }

    return "not-installed";
  } catch (error) {
    console.error(`Failed to detect dependency version:`, error);
    return "error";
  }
}

export async function checkDependencyUpdate(
  type: EDependencyType,
  onlineVersion: string,
  customCommand?: { command: string; args: string[]; versionRegex?: RegExp }
): Promise<IDependencyCheckResult> {
  const currentVersion = await detectDependencyVersion(type, customCommand);
  
  let status: EDependencyStatus;
  let updateAvailable = false;
  let error: string | undefined;

  if (currentVersion === "error") {
    status = EDependencyStatus.Error;
    error = "Failed to execute version check command";
  } else if (currentVersion === "not-installed") {
    status = EDependencyStatus.NotInstalled;
  } else if (currentVersion === "unknown") {
    status = EDependencyStatus.Unknown;
    error = "Could not parse version from command output";
  } else {
    const comparison = compareVersions(currentVersion, onlineVersion);
    if (comparison < 0) {
      status = EDependencyStatus.Outdated;
      updateAvailable = true;
    } else {
      status = EDependencyStatus.UpToDate;
    }
  }

  return {
    current: currentVersion,
    online: onlineVersion,
    status,
    updateAvailable,
    error,
  };
}

export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}

export function clearDependencyCache(): void {
  versionCache.clear();
}
