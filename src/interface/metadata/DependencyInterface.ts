export interface IRemoteDependency {
  id: string;
  name: string;
  type: EDependencyType;
  version: IRemoteDependencyVersion;
  isOptional: boolean;
  isUpdateAvailable: boolean;
  updateLink: string;
  updateMessage: string;
}

export interface IRemoteDependencyVersion {
  online: string;
}

export interface IRemoteDependencyCollection {
  dependencies: IRemoteDependency[];
}

export interface IRuntimeDependencyVersion extends IRemoteDependencyVersion {
  current: string;
  status: EDependencyStatus;
  lastChecked?: Date;
  error?: string;
}

export interface IRuntimeDependency extends IRemoteDependency {
  version: IRuntimeDependencyVersion;
}

export interface IRuntimeDependencyCollection {
  dependencies: IRuntimeDependency[];
}

export enum EDependencyType {
  NodeJS = "nodejs",
  NPM = "npm",
  Yarn = "yarn",
  PNPM = "pnpm",
  Git = "git",
  Docker = "docker",
  Python = "python",
  Pip = "pip",
  Rust = "rust",
  Cargo = "cargo",
  Go = "go",
  Java = "java",
  Custom = "custom",
}

export enum EDependencyStatus {
  Installed = "installed",
  NotInstalled = "not-installed",
  Outdated = "outdated",
  UpToDate = "up-to-date",
  Unknown = "unknown",
  Error = "error",
}

export interface IDependencyDetector {
  command: string;
  args: string[];
  versionRegex: RegExp;
}

export interface IDependencyCheckResult {
  current: string;
  online: string;
  status: EDependencyStatus;
  updateAvailable: boolean;
  error?: string;
}
