import { IRuntimeUpdateState } from "../metadata/UpdateInterface";

export interface IApplicationState {
  appName: string | null;
  appVersion: string | null;
  githubUrl: string;
  projectUrl: string;
  youtubeUrl: string;
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
