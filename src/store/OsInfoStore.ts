import { create } from "zustand";
import {
  platform,
  version,
  arch,
  type,
  locale,
  hostname,
  family,
} from "@tauri-apps/plugin-os";
import { OsInfoState } from "@/interface/store/IOsInfoStore";

const useOsInfoStore = create<OsInfoState>((set) => ({
  osName: null,
  isMobileOS: false,
  platform: "",
  version: "",
  arch: "",
  type: "",
  locale: "",
  hostname: "",
  family: "",
  osFetched: false,

  setOSName: (os) => set({ osName: os }),
  setIsMobileOS: (status) => set({ isMobileOS: status }),
  setPlatform: (platformValue) => set({ platform: platformValue }),
  setVersion: (versionValue) => set({ version: versionValue }),
  setArch: (archValue) => set({ arch: archValue }),
  setType: (typeValue) => set({ type: typeValue }),
  setLocale: (localeValue) => set({ locale: localeValue }),
  setHostname: (hostnameValue) => set({ hostname: hostnameValue }),
  setFamily: (familyValue) => set({ family: familyValue }),
  setOsFetched: (status) => set({ osFetched: status }),

  detectMobileOS: () => {
    const currentOS = platform();
    set({
      osName: currentOS,
      platform: currentOS,
      isMobileOS: currentOS === "android" || currentOS === "ios",
      osFetched: true,
    });
  },

  fetchOsInfo: async () => {
    try {
      const platformName = platform();
      const osVersion = version();
      const osArch = arch();
      const osType = type();
      const osFamily = family();
      const osLocale = await locale();
      const osHostname = await hostname();

      set({
        platform: platformName?.trim() || "Unknown",
        version: osVersion?.trim() || "Unknown",
        arch: osArch?.trim() || "Unknown",
        type: osType?.trim() || "Unknown",
        locale: osLocale?.trim() || "en-US",
        hostname: osHostname?.trim() || "Unknown",
        family: osFamily?.trim() || "Unknown",
        osName: platformName?.trim() || "Unknown",
        isMobileOS: platformName === "android" || platformName === "ios",
        osFetched: true,
      });
    } catch (error) {
      set({
        platform: "Unknown",
        version: "Unknown",
        arch: "Unknown",
        type: "Unknown",
        locale: "en-US",
        hostname: "Unknown",
        family: "Unknown",
        osFetched: true,
      });
    }
  },
}));

export default useOsInfoStore;
