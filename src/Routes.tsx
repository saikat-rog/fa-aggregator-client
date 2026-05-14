import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/NavigationBar";
import { SavedAdvisorsProvider } from "./context/SavedAdvisorsContext";
import { ProtectedRoute } from "./components/RoutePrivacy/ProtectedRoute";
import { PublicOnlyRoute } from "./components/RoutePrivacy/PublicOnlyRoute";
import { AdminPage } from "./pages/AdminPage";
import { AuthPage } from "./pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { AdvisorProfilePage } from "./pages/AdvisorProfilePage";
import AdvisorLayout from "./layouts/AdvisorLayout";
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./components/user/UserDashboard";
import AdvisorDashboardPage from "./pages/AdvisorDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <SavedAdvisorsProvider>
        <AppShell>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth"
            element={
              <PublicOnlyRoute>
                <AuthPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/u"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
              <Route index element={<Navigate to="/" replace />} />
              <Route path="dashboard" element={<UserDashboard />} />
          </Route>
          <Route
            path="/a"
            element={
              <ProtectedRoute allowedRoles={["advisor"]}>
                <AdvisorLayout />
              </ProtectedRoute>
            }
          >
              <Route index element={<Navigate to="/" replace />} />
              <Route path="dashboard" element={<AdvisorDashboardPage />} />
          </Route>
          <Route path="/lol" element={<AdminPage />} />
          <Route path="/:username" element={<AdvisorProfilePage />} />
          </Routes>
        </AppShell>
      </SavedAdvisorsProvider>
    </BrowserRouter>
  );
}

export default App;
