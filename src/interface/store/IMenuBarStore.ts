export interface IMenuBarState {
  isVisible: boolean;
  position: "top" | "bottom" | "left" | "right";
  
  setVisible: (status: boolean) => void;
  toggleVisible: () => void;
  setPosition: (position: "top" | "bottom" | "left" | "right") => void;
  savePosition: () => Promise<void>;
  loadPosition: () => Promise<void>;
}
