import { IRemoteApplication, IRuntimeApplication } from "./ApplicationInterface";
import {
  IRemoteDependencyCollection,
  IRuntimeDependencyCollection,
} from "./DependencyInterface";
import { IFixedErrorCollection } from "./FixedErrorInterface";
import { IFeatureCollection } from "./FeatureInterface";
import { ESeverity } from "./SeverityInterface";

export interface IRemoteUpdateState {
  application: IRemoteApplication;
  featureSet: IFeatureCollection;
  errorSet: IFixedErrorCollection;
  author: string;
  severity: ESeverity;
  dependencySet: IRemoteDependencyCollection;
}

export interface IRuntimeUpdateState {
  application: IRuntimeApplication;
  featureSet: IFeatureCollection;
  errorSet: IFixedErrorCollection;
  author: string;
  severity: ESeverity;
  dependencySet: IRuntimeDependencyCollection;
}
