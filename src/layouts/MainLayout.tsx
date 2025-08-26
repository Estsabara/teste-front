import Sidebar from "@/components/Sidebar";
import RoleSelector from "@/components/RoleSelector";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 p-4">
      <div className="mb-4">
        <RoleSelector />
      </div>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;

