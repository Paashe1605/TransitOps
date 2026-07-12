
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import GlassCard from "../components/GlassCard";
import DataGrid from "../components/DataGrid";
import type { ColumnDef } from "../components/DataGrid";
import FleetUtilizationChart from "../components/charts/FleetUtilizationChart";
import FuelEfficiencyChart from "../components/charts/FuelEfficiencyChart";
import FinancialCostsChart from "../components/charts/FinancialCostsChart";
import type {
  Vehicle,
  Driver,
  Trip,
  MaintenanceLog,
  Expense,
} from "../services/mockData";
import {
  fetchVehicles,
  fetchDrivers,
  fetchTrips,
  fetchMaintenanceLogs,
  fetchExpenses,
} from "../services/mockData";
import { Truck, Users, Wrench, DollarSign, Calendar } from "lucide-react";

export default function Dashboard() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  // State for data
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data
  useEffect(() => {
    async function loadData() {
      try {
        const [v, d, t, m, e] = await Promise.all([
          fetchVehicles(),
          fetchDrivers(),
          fetchTrips(),
          fetchMaintenanceLogs(),
          fetchExpenses(),
        ]);
        setVehicles(v);
        setDrivers(d);
        setTrips(t);
        setMaintenance(m);
        setExpenses(e);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Compute metric calculations
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.status === "On Trip").length;
  const driversOnDuty = drivers.filter((d) => d.status === "On Trip").length;
  const vehiclesInShop = vehicles.filter((v) => v.status === "In Shop").length;
  const totalCost = expenses.reduce((acc, curr) => acc + curr.cost, 0);

  // Status badging rendering functions
  const renderVehicleStatus = (v: Vehicle) => {
    const styles = {
      Available: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      "On Trip": "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      "In Shop": "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Retired: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[v.status]}`}>
        {v.status}
      </span>
    );
  };

  const renderDriverStatus = (d: Driver) => {
    const styles = {
      Available: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      "On Trip": "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      Suspended: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[d.status]}`}>
        {d.status}
      </span>
    );
  };

  const renderTripStatus = (t: Trip) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Dispatched: "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      Cancelled: "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[t.status]}`}>
        {t.status}
      </span>
    );
  };

  const renderMaintenanceStatus = (m: MaintenanceLog) => {
    const styles = {
      Scheduled: "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      "In Progress": "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${styles[m.status]}`}>
        {m.status}
      </span>
    );
  };

  // Column definitions for DataGrids
  const vehicleColumns: ColumnDef<Vehicle>[] = [
    { key: "registration_number", header: "Reg No.", sortable: true },
    { key: "model", header: "Model", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "max_capacity", header: "Max Cap (kg)", sortable: true, render: (v) => `${v.max_capacity.toLocaleString()} kg` },
    { key: "odometer", header: "Odometer (km)", sortable: true, render: (v) => `${v.odometer.toLocaleString()} km` },
    { key: "acquisition_cost", header: "Cost", sortable: true, render: (v) => `$${v.acquisition_cost.toLocaleString()}` },
    { key: "status", header: "Status", sortable: true, render: renderVehicleStatus },
  ];

  const driverColumns: ColumnDef<Driver>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "license_number", header: "License No.", sortable: false },
    { key: "license_category", header: "Category", sortable: true },
    { key: "license_expiry", header: "Expiry Date", sortable: true },
    { key: "contact", header: "Contact", sortable: false },
    {
      key: "safety_score",
      header: "Safety Score",
      sortable: true,
      render: (d) => (
        <span
          className={`font-bold ${
            d.safety_score >= 90
              ? "text-emerald-600 dark:text-emerald-400"
              : d.safety_score >= 75
              ? "text-amber-600 dark:text-amber-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {d.safety_score}%
        </span>
      ),
    },
    { key: "status", header: "Status", sortable: true, render: renderDriverStatus },
  ];

  const tripColumns: ColumnDef<Trip>[] = [
    { key: "id", header: "Trip ID", sortable: true },
    { key: "source", header: "Source", sortable: true },
    { key: "destination", header: "Destination", sortable: true },
    { key: "vehicle_reg", header: "Vehicle Reg", sortable: true },
    { key: "driver_name", header: "Driver", sortable: true },
    { key: "cargo_weight", header: "Cargo (kg)", sortable: true, render: (t) => `${t.cargo_weight.toLocaleString()} kg` },
    { key: "planned_distance", header: "Distance", sortable: true, render: (t) => `${t.planned_distance} km` },
    { key: "status", header: "Status", sortable: true, render: renderTripStatus },
  ];

  const maintenanceColumns: ColumnDef<MaintenanceLog>[] = [
    { key: "vehicle_reg", header: "Vehicle Reg", sortable: true },
    { key: "description", header: "Description", sortable: false },
    { key: "cost", header: "Cost", sortable: true, render: (m) => `$${m.cost.toLocaleString()}` },
    { key: "date", header: "Date", sortable: true },
    { key: "status", header: "Status", sortable: true, render: renderMaintenanceStatus },
  ];

  const expenseColumns: ColumnDef<Expense>[] = [
    { key: "vehicle_reg", header: "Vehicle Reg", sortable: true },
    {
      key: "type",
      header: "Expense Type",
      sortable: true,
      render: (e) => (
        <span className="capitalize font-bold text-gray-800 dark:text-gray-200">
          {e.type}
        </span>
      ),
    },
    { key: "cost", header: "Amount", sortable: true, render: (e) => `$${e.cost.toLocaleString()}` },
    { key: "liters", header: "Fuel (Liters)", sortable: true, render: (e) => (e.liters ? `${e.liters} L` : "-") },
    { key: "date", header: "Date", sortable: true },
  ];

  // Helper title renderer
  const getHeaderTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Fleet Operations Hub";
      case "vehicles":
        return "Vehicle Registry";
      case "drivers":
        return "Driver Directory";
      case "trips":
        return "Trip Manifests";
      case "maintenance":
        return "Maintenance Logbook";
      case "expenses":
        return "Expense Analytics";
      default:
        return "TransitOps";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      {/* Main Workspace Frame */}
      <main className="flex-1 pl-76 pr-8 py-6 space-y-6 min-h-screen max-w-7xl mx-auto">
        {/* Top Header Panel */}
        <div className="flex items-center justify-between glass-panel px-6 py-4.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Fleet Operations Hub
            </h1>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 mt-0.5">
              Logged in as: <span className="text-primary font-bold">{role}</span>
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/maintenance" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-md font-medium transition-colors">
              Maintenance
            </Link>
            <Link to="/financials" className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 rounded-md font-medium transition-colors">
              Financials
            </Link>
            <ThemeToggle />
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-md font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
              Loading metrics...
            </span>
          </div>
        ) : (
          <>
            {/* Overview dashboard viewport */}
            <div className="space-y-6">
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <GlassCard className="flex items-center gap-4.5 hover:scale-[1.02] hover:shadow-md cursor-default">
                    <div className="p-3.5 bg-blue-500/10 text-blue-500 rounded-xl dark:bg-blue-500/20">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        Fleet Utilization
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                        {activeVehicles} / {totalVehicles}
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 font-semibold">
                        Vehicles currently on road
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="flex items-center gap-4.5 hover:scale-[1.02] hover:shadow-md cursor-default">
                    <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-xl dark:bg-emerald-500/20">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        Drivers on Duty
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                        {driversOnDuty}
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 font-semibold">
                        Operators on active routes
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="flex items-center gap-4.5 hover:scale-[1.02] hover:shadow-md cursor-default">
                    <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-xl dark:bg-amber-500/20">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        In Shop Maintenance
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                        {vehiclesInShop}
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 font-semibold">
                        Vehicles undergoing service
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard className="flex items-center gap-4.5 hover:scale-[1.02] hover:shadow-md cursor-default">
                    <div className="p-3.5 bg-purple-500/10 text-purple-500 rounded-xl dark:bg-purple-500/20">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                        Total Fleet Costs
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                        ${totalCost.toLocaleString()}
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-0.5 font-semibold">
                        Cumulative expenses logged
                      </p>
                    </div>
                  </GlassCard>
                </div>

                {/* Analytical Charts Block */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard className="lg:col-span-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                        Fleet Status Breakdown
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-400 font-semibold mt-0.5">
                        Allocation of vehicle statuses
                      </p>
                    </div>
                    <div className="mt-6">
                      <FleetUtilizationChart vehicles={vehicles} />
                    </div>
                  </GlassCard>

                  <GlassCard className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                        Fuel Efficiency Trends
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-400 font-semibold mt-0.5">
                        Average kilometers per liter (last 7 months)
                      </p>
                    </div>
                    <div className="mt-4">
                      <FuelEfficiencyChart />
                    </div>
                  </GlassCard>

                  <GlassCard className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                        Operational Cost Structure
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-400 font-semibold mt-0.5">
                        Cumulative expense breakdown by type
                      </p>
                    </div>
                    <div className="mt-6">
                      <FinancialCostsChart expenses={expenses} />
                    </div>
                  </GlassCard>

                  {/* Upcoming Schedule Overview */}
                  <GlassCard className="lg:col-span-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                        Pending Actions
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-400 font-semibold mt-0.5">
                        Requires operator attention
                      </p>
                    </div>
                    <div className="mt-5 space-y-3.5">
                      <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg dark:bg-blue-500/20">
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            License Expiry Threat
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 mt-0.5">
                            Suresh Patel's license expires in 4 months.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors">
                        <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg dark:bg-amber-500/20">
                          <Wrench className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            Maintenance Scheduled
                          </p>
                          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 mt-0.5">
                            AC compressor servicing for MH-02-XY-4321.
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
