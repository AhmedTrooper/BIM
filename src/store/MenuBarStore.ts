import { create } from "zustand";
import { IMenuBarState } from "@/interface/store/IMenuBarStore";

const STORAGE_KEY = "menubar_position";

const useMenuBarStore = create<IMenuBarState>((set, get) => ({
  isVisible: true,
  position: "bottom",

  setVisible: (status) => set({ isVisible: status }),

  toggleVisible: () => set({ isVisible: !get().isVisible }),

  setPosition: (position) => {
    set({ position });
    get().savePosition();
  },

  savePosition: async () => {
    const { position } = get();
    localStorage.setItem(STORAGE_KEY, position);
  },

  loadPosition: async () => {
    const position = localStorage.getItem(STORAGE_KEY) as "top" | "bottom" | "left" | "right" | null;
    if (position) {
      set({ position });
    }
  },
}));

export default useMenuBarStore;
