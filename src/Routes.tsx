import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { AdvisorHomePage } from "./pages/AdvisorHomePage";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { UserHomePage } from "./pages/UserHomePage";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<UserHomePage />} />
          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/fa"
            element={
              <ProtectedRoute allowedRoles={["advisor"]}>
                <AdvisorHomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/lol" element={<AdminPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
