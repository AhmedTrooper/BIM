export interface OsInfoState {
  osName: string | null;
  isMobileOS: boolean;
  platform: string;
  version: string;
  arch: string;
  type: string;
  locale: string;
  hostname: string;
  family: string;
  osFetched: boolean;
  
  setOSName: (os: string) => void;
  setIsMobileOS: (osStatus: boolean) => void;
  setPlatform: (platform: string) => void;
  setVersion: (version: string) => void;
  setArch: (arch: string) => void;
  setType: (type: string) => void;
  setLocale: (locale: string) => void;
  setHostname: (hostname: string) => void;
  setFamily: (family: string) => void;
  setOsFetched: (status: boolean) => void;
  
  detectMobileOS: () => void;
  fetchOsInfo: () => Promise<void>;
}
