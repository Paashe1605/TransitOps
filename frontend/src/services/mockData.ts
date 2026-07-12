export interface Vehicle {
  id: number;
  registration_number: string;
  model: string;
  type: string;
  max_capacity: number; // in kg
  odometer: number; // in km
  acquisition_cost: number; // in USD
  status: "Available" | "On Trip" | "In Shop" | "Retired";
}

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  license_category: string;
  license_expiry: string; // YYYY-MM-DD
  contact: string;
  safety_score: number; // 0 to 100
  status: "Available" | "On Trip" | "Suspended";
}

export interface Trip {
  id: number;
  source: string;
  destination: string;
  vehicle_id: number;
  driver_id: number;
  cargo_weight: number; // in kg
  planned_distance: number; // in km
  status: "Pending" | "Dispatched" | "Completed" | "Cancelled";
  vehicle_reg?: string;
  driver_name?: string;
}

export interface MaintenanceLog {
  id: number;
  vehicle_id: number;
  vehicle_reg?: string;
  description: string;
  cost: number;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed";
}

export interface Expense {
  id: number;
  vehicle_id: number;
  vehicle_reg?: string;
  liters?: number; // for fuel logs
  cost: number;
  date: string;
  type: "Fuel" | "Toll" | "Insurance" | "Maintenance";
}

export const mockVehicles: Vehicle[] = [
  { id: 1, registration_number: "MH-12-PQ-9087", model: "Tata Prima 4925.T", type: "Heavy Truck", max_capacity: 25000, odometer: 125400, acquisition_cost: 65000, status: "On Trip" },
  { id: 2, registration_number: "DL-01-AB-1234", model: "Mahindra Blazo X 35", type: "Heavy Truck", max_capacity: 18000, odometer: 85200, acquisition_cost: 48000, status: "Available" },
  { id: 3, registration_number: "KA-03-MM-5678", model: "Ashok Leyland Partner", type: "Medium Truck", max_capacity: 8000, odometer: 42100, acquisition_cost: 28000, status: "In Shop" },
  { id: 4, registration_number: "MH-02-XY-4321", model: "Eicher Pro 2049", type: "Medium Truck", max_capacity: 5000, odometer: 32000, acquisition_cost: 22000, status: "On Trip" },
  { id: 5, registration_number: "DL-03-CC-8899", model: "Tata Ace Gold", type: "Light Van", max_capacity: 1500, odometer: 15600, acquisition_cost: 9500, status: "Available" },
  { id: 6, registration_number: "MH-14-GH-6644", model: "Mahindra Jeeto", type: "Light Van", max_capacity: 1000, odometer: 9800, acquisition_cost: 7200, status: "Available" },
  { id: 7, registration_number: "KA-51-EE-3020", model: "BYD T3 EV", type: "Electric Carrier", max_capacity: 1200, odometer: 18400, acquisition_cost: 25000, status: "On Trip" },
  { id: 8, registration_number: "GJ-01-ZZ-5500", model: "BharatBenz 2823R", type: "Heavy Truck", max_capacity: 20000, odometer: 145900, acquisition_cost: 58000, status: "Retired" },
  { id: 9, registration_number: "HR-55-AA-7711", model: "Force Traveller", type: "Medium Truck", max_capacity: 4000, odometer: 67000, acquisition_cost: 18000, status: "In Shop" },
  { id: 10, registration_number: "MH-43-BB-9922", model: "Tata Ultra T.7", type: "Medium Truck", max_capacity: 7000, odometer: 24100, acquisition_cost: 19500, status: "Available" }
];

export const mockDrivers: Driver[] = [
  { id: 1, name: "Rajesh Kumar", license_number: "DL-90823412", license_category: "Heavy Vehicle", license_expiry: "2028-09-15", contact: "+91 98765 43210", safety_score: 94, status: "On Trip" },
  { id: 2, name: "Amit Sharma", license_number: "MH-12345678", license_category: "Heavy Vehicle", license_expiry: "2027-04-20", contact: "+91 98234 56789", safety_score: 88, status: "Available" },
  { id: 3, name: "Suresh Patel", license_number: "GJ-76543210", license_category: "Medium Vehicle", license_expiry: "2026-11-05", contact: "+91 99123 45678", safety_score: 72, status: "Available" },
  { id: 4, name: "Vikram Singh", license_number: "HR-98765432", license_category: "Heavy Vehicle", license_expiry: "2029-01-30", contact: "+91 97531 24680", safety_score: 96, status: "On Trip" },
  { id: 5, name: "Karan Johar", license_number: "MH-34567890", license_category: "Light Vehicle", license_expiry: "2025-10-12", contact: "+91 96420 13579", safety_score: 85, status: "Available" },
  { id: 6, name: "Rahul Verma", license_number: "DL-56789012", license_category: "Medium Vehicle", license_expiry: "2026-03-22", contact: "+91 95812 34769", safety_score: 65, status: "Suspended" },
  { id: 7, name: "John Doe", license_number: "KA-45678901", license_category: "Light Vehicle (EV)", license_expiry: "2029-08-18", contact: "+91 91234 56700", safety_score: 91, status: "On Trip" },
  { id: 8, name: "Manpreet Singh", license_number: "PB-23456789", license_category: "Heavy Vehicle", license_expiry: "2027-12-01", contact: "+91 94321 09876", safety_score: 89, status: "Available" }
];

export const mockTrips: Trip[] = [
  { id: 1, source: "Mumbai Hub", destination: "Pune Depot", vehicle_id: 1, driver_id: 1, cargo_weight: 22000, planned_distance: 150, status: "Dispatched", vehicle_reg: "MH-12-PQ-9087", driver_name: "Rajesh Kumar" },
  { id: 2, source: "Delhi Cargo Terminal", destination: "Jaipur Hub", vehicle_id: 4, driver_id: 4, cargo_weight: 4800, planned_distance: 270, status: "Dispatched", vehicle_reg: "MH-02-XY-4321", driver_name: "Vikram Singh" },
  { id: 3, source: "Bengaluru Logistics Park", destination: "Chennai Port", vehicle_id: 7, driver_id: 7, cargo_weight: 1100, planned_distance: 350, status: "Dispatched", vehicle_reg: "KA-51-EE-3020", driver_name: "John Doe" },
  { id: 4, source: "Ahmedabad Industrial Zone", destination: "Surat GIDC", vehicle_id: 2, driver_id: 2, cargo_weight: 15000, planned_distance: 260, status: "Completed", vehicle_reg: "DL-01-AB-1234", driver_name: "Amit Sharma" },
  { id: 5, source: "Mumbai Hub", destination: "Nashik Warehouse", vehicle_id: 5, driver_id: 5, cargo_weight: 1200, planned_distance: 170, status: "Completed", vehicle_reg: "DL-03-CC-8899", driver_name: "Karan Johar" },
  { id: 6, source: "Delhi Cargo Terminal", destination: "Gurugram Hub", vehicle_id: 6, driver_id: 8, cargo_weight: 800, planned_distance: 45, status: "Completed", vehicle_reg: "MH-14-GH-6644", driver_name: "Manpreet Singh" },
  { id: 7, source: "Kolkata Port", destination: "Patna Warehouse", vehicle_id: 10, driver_id: 3, cargo_weight: 6500, planned_distance: 580, status: "Pending", vehicle_reg: "MH-43-BB-9922", driver_name: "Suresh Patel" },
  { id: 8, source: "Chennai Port", destination: "Hyderabad Hub", vehicle_id: 2, driver_id: 2, cargo_weight: 17000, planned_distance: 620, status: "Pending", vehicle_reg: "DL-01-AB-1234", driver_name: "Amit Sharma" }
];

export const mockMaintenanceLogs: MaintenanceLog[] = [
  { id: 1, vehicle_id: 3, description: "Engine overhaul & transmission fluid replacement", cost: 1250, date: "2026-07-10", status: "In Progress", vehicle_reg: "KA-03-MM-5678" },
  { id: 2, vehicle_id: 9, description: "Brake pads replacement and wheel alignment", cost: 450, date: "2026-07-11", status: "In Progress", vehicle_reg: "HR-55-AA-7711" },
  { id: 3, vehicle_id: 1, description: "Routine 100k servicing & oil change", cost: 350, date: "2026-06-25", status: "Completed", vehicle_reg: "MH-12-PQ-9087" },
  { id: 4, vehicle_id: 8, description: "Suspension rebuild & bumper replacement", cost: 2100, date: "2026-05-14", status: "Completed", vehicle_reg: "GJ-01-ZZ-5500" },
  { id: 5, vehicle_id: 4, description: "AC compressor replacement", cost: 600, date: "2026-07-15", status: "Scheduled", vehicle_reg: "MH-02-XY-4321" }
];

export const mockExpenses: Expense[] = [
  // Fuel Logs
  { id: 1, vehicle_id: 1, liters: 320, cost: 2400, date: "2026-07-01", type: "Fuel", vehicle_reg: "MH-12-PQ-9087" },
  { id: 2, vehicle_id: 2, liters: 180, cost: 1350, date: "2026-07-02", type: "Fuel", vehicle_reg: "DL-01-AB-1234" },
  { id: 3, vehicle_id: 4, liters: 120, cost: 900, date: "2026-07-03", type: "Fuel", vehicle_reg: "MH-02-XY-4321" },
  { id: 4, vehicle_id: 7, liters: 0, cost: 150, date: "2026-07-04", type: "Fuel", vehicle_reg: "KA-51-EE-3020" }, // EV Charging cost
  
  // Tolls & Others
  { id: 5, vehicle_id: 1, cost: 250, date: "2026-07-01", type: "Toll", vehicle_reg: "MH-12-PQ-9087" },
  { id: 6, vehicle_id: 2, cost: 180, date: "2026-07-02", type: "Toll", vehicle_reg: "DL-01-AB-1234" },
  { id: 7, vehicle_id: 4, cost: 140, date: "2026-07-03", type: "Toll", vehicle_reg: "MH-02-XY-4321" },
  
  // Maintenance Expenses
  { id: 8, vehicle_id: 3, cost: 1250, date: "2026-07-10", type: "Maintenance", vehicle_reg: "KA-03-MM-5678" },
  { id: 9, vehicle_id: 9, cost: 450, date: "2026-07-11", type: "Maintenance", vehicle_reg: "HR-55-AA-7711" },
  { id: 10, vehicle_id: 1, cost: 350, date: "2026-06-25", type: "Maintenance", vehicle_reg: "MH-12-PQ-9087" }
];

export async function fetchVehicles(): Promise<Vehicle[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockVehicles), 400));
}

export async function fetchDrivers(): Promise<Driver[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockDrivers), 400));
}

export async function fetchTrips(): Promise<Trip[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockTrips), 400));
}

export async function fetchMaintenanceLogs(): Promise<MaintenanceLog[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockMaintenanceLogs), 400));
}

export async function fetchExpenses(): Promise<Expense[]> {
  return new Promise((resolve) => setTimeout(() => resolve(mockExpenses), 400));
}
