import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Sidebar from "./Sidebar";

export default function Layout() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar Layout */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <main className="pl-[17rem] pr-8 py-6 min-h-screen w-full">
        {/* Page Content */}
        <div className="max-w-7xl mx-auto w-full space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
