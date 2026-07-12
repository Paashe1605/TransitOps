import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import Financials from "./pages/Financials";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Layout from "./components/Layout";
import { useAuthStore } from "./store/authStore";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="trips" element={<Trips />} />
          <Route path="maintenance" element={token ? <Maintenance /> : <Navigate to="/login" replace />} />
          <Route path="financials" element={token ? <Financials /> : <Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
