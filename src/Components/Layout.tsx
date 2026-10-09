import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import type { RootState } from "../store/store";

export const Layout = () => {
    const { isDark } = useSelector((state: RootState) => state.theme);
    return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className={`min-h-screen ${isDark ? "bg-gray-900" : "text-white:  text-gray-900 dark:text-white`"}`}>
        <Navbar/>
        <main>
            <div className=" container max-auto px-4 py-8">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  )
}
