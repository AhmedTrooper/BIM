import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Info,
  X,
  Minus,
  Maximize2,
  Moon,
  Sun,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { RouteList } from "@/constants/routes/RouteList";
import { useState, useEffect, useRef } from "react";
import useOsInfoStore from "@/store/OsInfoStore";
import useThemeStore from "@/store/ThemeStore";
import useMenuBarStore from "@/store/MenuBarStore";
import { useApplicationStore } from "@/store/ApplicationStore";
import { getCurrentWindow } from "@tauri-apps/api/window";

const routeIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "": Home,
  info: Info,
  settings: Settings,
};

export default function Sidebar() {
  const [isFullScreen, setIsFullScreen] = useState<boolean | null>(null);
  const location = useLocation();
  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const position = useMenuBarStore((state) => state.position);
  const loadPosition = useMenuBarStore((state) => state.loadPosition);
  const navRef = useRef<HTMLDivElement>(null);

  const appName = useApplicationStore((state) => state.appName);
  const appVersion = useApplicationStore((state) => state.appVersion);
  const fetchAppInfo = useApplicationStore((state) => state.fetchAppInfo);

  useEffect(() => {
    if (!appName) {
      fetchAppInfo();
    }
    loadPosition();
  }, [appName, fetchAppInfo, loadPosition]);

  const startDraggingWindow = async () => {
    try {
      await getCurrentWindow().startDragging();
    } catch (e) {}
  };

  const handleWindowClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch (e) {}
  };

  const hideWindow = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (e) {}
  };

  const handleFullScreen = async () => {
    try {
      let screenStatus = await getCurrentWindow().isFullscreen();
      setIsFullScreen(screenStatus);
      if (isFullScreen) {
        await getCurrentWindow().setFullscreen(false);
        setIsFullScreen(false);
      } else {
        await getCurrentWindow().setFullscreen(true);
        setIsFullScreen(true);
      }
    } catch (e) {}
  };

  const scrollNav = (direction: "forward" | "backward") => {
    if (!navRef.current) return;

    const scrollAmount = 200;
    if (isHorizontal) {
      navRef.current.scrollBy({
        left: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    } else {
      navRef.current.scrollBy({
        top: direction === "forward" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const isHorizontal = position === "top" || position === "bottom";

  return (
    <aside
      className={clsx(
        "fixed bg-[#191f1f] dark:bg-zinc-900 border-zinc-800 z-50 transition-all duration-300",
        "flex shadow-lg",
        {
          "w-16": !isHorizontal,
          "h-16": isHorizontal,
          "left-0 top-0 h-screen border-r flex-col": position === "left",
          "right-0 top-0 h-screen border-l flex-col": position === "right",
          "left-0 right-0 top-0 w-screen border-b flex-row": position === "top",
          "left-0 right-0 bottom-0 w-screen border-t flex-row-reverse":
            position === "bottom",
        }
      )}
    >
      {!isHorizontal ? (
        <>
          <div className="border-b border-zinc-800 p-2">
            <div
              className="flex items-center justify-center p-2 mb-3 cursor-move hover:bg-zinc-800/50 rounded-lg transition-colors"
              onMouseDown={startDraggingWindow}
              title="Drag to move window"
            >
              <GripVertical size={18} className="text-zinc-500" />
            </div>

            {!isMobileOS && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={hideWindow}
                  className="w-10 h-10 rounded-lg bg-zinc-800 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center"
                  title="Minimize"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={handleFullScreen}
                  className="w-10 h-10 rounded-lg bg-zinc-800 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                  title="Maximize"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  onClick={handleWindowClose}
                  className="w-10 h-10 rounded-lg bg-zinc-800 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="border-r border-zinc-800 flex items-center gap-3 p-2">
            <div
              className="cursor-move hover:bg-zinc-800/50 rounded-lg transition-colors p-2 flex items-center"
              onMouseDown={startDraggingWindow}
              title="Drag to move window"
            >
              <GripVertical size={18} className="text-zinc-500 rotate-90" />
            </div>

            {position === "top" && !isMobileOS && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={hideWindow}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center"
                  title="Minimize"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={handleFullScreen}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                  title="Maximize"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  onClick={handleWindowClose}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {position === "bottom" && !isMobileOS && (
              <div className="flex gap-2 items-center">
                <button
                  onClick={hideWindow}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-yellow-500 hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center"
                  title="Minimize"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={handleFullScreen}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-green-500 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center"
                  title="Maximize"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  onClick={handleWindowClose}
                  className="w-8 h-8 rounded-lg bg-zinc-800 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {!isHorizontal && (
        <div className="flex items-center justify-center py-2 border-b border-zinc-800">
          <button
            onClick={() => scrollNav("backward")}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            title="Scroll Up"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      )}

      {isHorizontal && (
        <div className="flex items-center justify-center px-2 border-r border-zinc-800">
          <button
            onClick={() => scrollNav("backward")}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            title={position === "top" ? "Scroll Left" : "Scroll Right"}
          >
            {position === "top" ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>
      )}

      <nav
        ref={navRef}
        className={clsx("flex-1 p-3 overflow-auto", {
          "space-y-2": !isHorizontal,
          "flex gap-2": isHorizontal,
        })}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {RouteList.map((route) => {
          const Icon = routeIcons[route.url] || Home;
          const isActive = location.pathname === `/${route.url}`;

          return (
            <Link
              key={route.url}
              to={`/${route.url}`}
              className={clsx(
                "flex items-center justify-center rounded-lg transition-all",
                "hover:bg-zinc-800 group relative",
                {
                  "bg-blue-600 text-white hover:bg-blue-700": isActive,
                  "text-zinc-400 hover:text-white": !isActive,
                  "w-10 h-10": true,
                }
              )}
              title={route.name}
            >
              <Icon className="flex-shrink-0 w-5 h-5" />
            </Link>
          );
        })}
      </nav>

      {!isHorizontal && (
        <div className="flex items-center justify-center py-2 border-t border-zinc-800">
          <button
            onClick={() => scrollNav("forward")}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            title="Scroll Down"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      )}

      {isHorizontal && (
        <div className="flex items-center justify-center px-2 border-l border-zinc-800">
          <button
            onClick={() => scrollNav("forward")}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
            title={position === "top" ? "Scroll Right" : "Scroll Left"}
          >
            {position === "top" ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>
      )}

      <div
        className={clsx("p-3 border-zinc-800", {
          "border-t": !isHorizontal,
          "border-l": isHorizontal,
          "space-y-2": !isHorizontal,
          "flex gap-2 items-center": isHorizontal,
        })}
      >
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center justify-center rounded-lg transition-all w-10 h-10 bg-zinc-800 text-white hover:bg-zinc-700"
          title={dark ? "Light Mode" : "Dark Mode"}
        >
          {dark ? (
            <Sun className="flex-shrink-0 w-5 h-5" />
          ) : (
            <Moon className="flex-shrink-0 w-5 h-5" />
          )}
        </button>

        <p className="text-xs text-zinc-500 text-center">
          v{appVersion || "1.0.0"}
        </p>
      </div>
    </aside>
  );
}
