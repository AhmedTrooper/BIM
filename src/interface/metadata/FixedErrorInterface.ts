import { IPlatform } from "./PlatformInterface";

export interface IFixedError {
  id: string;
  items: string[];
  affectedPlatforms: IPlatform[];
  isFirst: boolean;
  isLatest: boolean;
  previousId: string;
}

export interface IFixedErrorCollection {
  latestId: string;
  errors: IFixedError[];
}
