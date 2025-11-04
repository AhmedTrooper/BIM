import { IPlatform } from "./PlatformInterface";

export interface IFeature {
  id: string;
  items: string[];
  supportedPlatforms: IPlatform[];
  platformChanges: string[];
  isFirst: boolean;
  isLatest: boolean;
  previousId: string;
}

export interface IFeatureCollection {
  latestId: string;
  features: IFeature[];
}
