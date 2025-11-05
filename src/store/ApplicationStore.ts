import { IApplicationState } from "@/interface/store/IApplicationStore";
import {
  IRemoteUpdateState,
  IRuntimeUpdateState,
} from "@/interface/metadata/UpdateInterface";
import {
  IRuntimeDependency,
  EDependencyStatus,
} from "@/interface/metadata/DependencyInterface";
import { addToast } from "@heroui/react";
import { getVersion, getName } from "@tauri-apps/api/app";
import { create } from "zustand";
import {
  checkDependencyUpdate,
  compareVersions,
} from "@/utils/DependencyDetector";

export const useApplicationStore = create<IApplicationState>((set, get) => ({
  appName: null,
  appVersion: null,
  githubUrl: "https://github.com/AhmedTrooper",
  projectUrl: "https://github.com/AhmedTrooper/BIM",
  youtubeUrl: "https://www.youtube.com/@AhmedTrooper",
  updateMetadata: null,
  isCheckingUpdate: false,
  updateCheckError: null,
  lastUpdateCheck: null,

  fetchAppInfo: async () => {
    try {
      const name = await getName();
      const version = await getVersion();
      set({ appName: name.toUpperCase(), appVersion: version });
    } catch (error) {
      console.error("Failed to fetch app info:", error);
      set({ appName: "APP", appVersion: "0.0.0" });
    }
  },

  checkForUpdates: async () => {
    const store = get();
    store.setIsCheckingUpdate(true);
    store.setUpdateCheckError(null);

    try {
      const metadataUrl =
        "https://raw.githubusercontent.com/AhmedTrooper/BIM/main/resources/metadata/update.json";

      const currentAppVersion = await getVersion();
      const response = await fetch(metadataUrl);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch update metadata: ${response.status}`);
      }

      const remoteData = (await response.json()) as IRemoteUpdateState;

      const checkTime = new Date();
      const runtimeDependencies = await Promise.all(
        remoteData.dependencySet.dependencies.map(async (dep) => {
          const result = await checkDependencyUpdate(
            dep.type,
            dep.version.online
          );

          return {
            ...dep,
            version: {
              current: result.current,
              online: result.online,
              status: result.status,
              lastChecked: checkTime,
              error: result.error,
            },
            isUpdateAvailable: result.updateAvailable,
          } as IRuntimeDependency;
        })
      );

      const runtimeData: IRuntimeUpdateState = {
        ...remoteData,
        application: {
          ...remoteData.application,
          version: {
            current: currentAppVersion,
            online: remoteData.application.version.online,
          },
          updateAvailable:
            compareVersions(
              currentAppVersion,
              remoteData.application.version.online
            ) < 0,
        },
        dependencySet: {
          dependencies: runtimeDependencies,
        },
      };

      store.setUpdateMetadata(runtimeData);
      store.setIsCheckingUpdate(false);
      store.setUpdateCheckError(null);
      set({ lastUpdateCheck: checkTime });

      if (runtimeData.application.updateAvailable) {
        addToast({
          title: "Application Update Available",
          description: `New version ${runtimeData.application.version.online} is available!`,
          color: "success",
          timeout: 3000,
        });
      }

      const outdatedDeps = runtimeDependencies.filter(
        (d) => d.version.status === EDependencyStatus.Outdated
      );
      const errorDeps = runtimeDependencies.filter(
        (d) => d.version.status === EDependencyStatus.Error
      );
      const notInstalledDeps = runtimeDependencies.filter(
        (d) =>
          d.version.status === EDependencyStatus.NotInstalled && !d.isOptional
      );

      if (outdatedDeps.length > 0) {
        addToast({
          title: "Dependency Updates Available",
          description: `${outdatedDeps.length} ${
            outdatedDeps.length === 1 ? "dependency" : "dependencies"
          } can be updated`,
          color: "warning",
          timeout: 3000,
        });
      }

      if (notInstalledDeps.length > 0) {
        addToast({
          title: "Missing Dependencies",
          description: `${notInstalledDeps.length} required ${
            notInstalledDeps.length === 1 ? "dependency is" : "dependencies are"
          } not installed`,
          color: "danger",
          timeout: 4000,
        });
      }

      if (errorDeps.length > 0) {
        console.warn(
          "Dependency check errors:",
          errorDeps.map((d) => ({
            name: d.name,
            error: d.version.error,
          }))
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      store.setUpdateCheckError(errorMessage);
      store.setIsCheckingUpdate(false);

      addToast({
        title: "Update Check Failed",
        description: errorMessage,
        color: "danger",
        timeout: 4000,
      });
    }
  },

  setUpdateMetadata: (metadata) => set({ updateMetadata: metadata }),
  setIsCheckingUpdate: (status) => set({ isCheckingUpdate: status }),
  setUpdateCheckError: (error) => set({ updateCheckError: error }),
  clearUpdateData: () =>
    set({
      updateMetadata: null,
      updateCheckError: null,
      lastUpdateCheck: null,
    }),
}));
