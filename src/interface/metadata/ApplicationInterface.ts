export interface IRemoteApplicationVersion {
  online: string;
}

export interface IRuntimeApplicationVersion extends IRemoteApplicationVersion {
  current: string;
}

export interface IRemoteApplication {
  name: string;
  description?: string;
  version: IRemoteApplicationVersion;
  updateMessage?: string;
  updateUrl?: string;
}

export interface IRuntimeApplication extends IRemoteApplication {
  version: IRuntimeApplicationVersion;
  updateAvailable: boolean;
}
