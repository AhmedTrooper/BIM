import { useEffect } from "react";
import "./App.css";
import useOsInfoStore from "./store/OsInfoStore";
import useThemeStore from "./store/ThemeStore";
import useMenuBarStore from "./store/MenuBarStore";
import clsx from "clsx";
import Sidebar from "./components/navigation/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const fetchOsInfo = useOsInfoStore((state) => state.fetchOsInfo);
  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const osFetched = useOsInfoStore((state) => state.osFetched);
  const position = useMenuBarStore((state) => state.position);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, [setDark]);

  useEffect(() => {
    if (!osFetched) {
      fetchOsInfo();
    }
  }, [osFetched, fetchOsInfo]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div
      className={clsx(
        "min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors select-none",
        {
          "custom-scrollbar": !isMobileOS,
        }
      )}
    >
      <Sidebar />
      
      <main
        className={clsx(
          "transition-all duration-300 min-h-screen p-6",
          {
            "ml-16": position === "left",
            "mr-16": position === "right",
            "mt-16": position === "top",
            "mb-16": position === "bottom",
          }
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default App;
