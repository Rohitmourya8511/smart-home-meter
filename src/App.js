import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Monitor from "./scenes/Monitor";
import ConfigForm from "./scenes/ConfigForm";
import FlowLineChart from "./scenes/FlowLineChart";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ElectricityLine from "./scenes/electricity";
import Devices from "./scenes/devices";
import Login from "./scenes/Login";
import GasLineChart from "./scenes/GasLineChart";

function App() {
  const [theme, colorMode] = useMode();
    const [isAuthenticated, setIsAuthenticated] = useState( sessionStorage.getItem("isAuthenticated") === "true");
  const [isSidebar, setIsSidebar] = useState(true);

  const handleLogin = () => {
      sessionStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
   sessionStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuthenticated && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {isAuthenticated && (
              <Topbar  setIsSidebar={setIsSidebar} onLogout={handleLogout} />
            )}
            <Routes>
              {!isAuthenticated && (
                <Route path="/" element={<Login onLogin={handleLogin} />} />
               
              )}
              {isAuthenticated && <Route path="/" element={<Dashboard />} />}
              {isAuthenticated && <Route path="/monitor" element={<Monitor />} />}
              {isAuthenticated && <Route path="/devices" element={<Devices />} />}
              {isAuthenticated && (
                <Route path="/configuration" element={<ConfigForm />} />
              )}
              {isAuthenticated && (
                <Route path="/water-line-chart" element={<FlowLineChart />} />
              )}
              {isAuthenticated && (
                <Route
                  path="/energy-line-chart"
                  element={<ElectricityLine />}
                />
              )}
              {isAuthenticated && (
                <Route path="/gas-line-chart" element={<GasLineChart/>} />
              )}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
