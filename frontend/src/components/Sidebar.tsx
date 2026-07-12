import { LayoutDashboard, Truck, Users, Route, Wrench, DollarSign, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "vehicles", label: "Vehicles", icon: Truck },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "trips", label: "Trips", icon: Route },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "expenses", label: "Expenses", icon: DollarSign },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col h-[calc(100vh-2rem)] rounded-2xl m-4 fixed left-0 top-0 z-30 shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-gray-200/30 dark:border-gray-800/30">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl dark:bg-primary/20">
          <Truck className="h-6 w-6" />
        </div>
        <div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            TransitOps
          </span>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">
            {role || "Operator"} Workspace
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`} />
              {item.label}
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200/30 dark:border-gray-800/30">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
