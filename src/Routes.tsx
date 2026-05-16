import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppShell } from "./components/NavigationBar";
import { SavedAdvisorsProvider } from "./context/SavedAdvisorsContext";
import { ProtectedRoute } from "./components/RoutePrivacy/ProtectedRoute";
import { PublicOnlyRoute } from "./components/RoutePrivacy/PublicOnlyRoute";
import { AdminPage } from "./pages/admin/Admin.page";
import { AuthPage } from "./pages/auth/Auth.page";
import { HomePage } from "./pages/home/Home.page";
import { AdvisorProfilePage } from "./pages/advisor-profile/AdvisorProfile.page";
import AdvisorLayout from "./layouts/AdvisorLayout";
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./components/user/UserDashboard";
import AdvisorDashboardPage from "./pages/advisor/AdvisorDashboard.page";
import { BlogListPage } from "./pages/blog/BlogList.page";
import { BlogDetailPage } from "./pages/blog/BlogDetail.page";
import { NotFoundState } from "./components/pageNotFound/PageNotFound";
import { SeoLandingPage } from "./pages/home/SeoLanding.page";
import { seoLandings } from "./config/seoLandings";

function SlugRouteResolver() {
  const { slug } = useParams<{ slug: string }>();
  if (slug && seoLandings[slug]) {
    return <SeoLandingPage />;
  }
  return <AdvisorProfilePage />;
}

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
          <Route
            path="/admin"
            element={<AdminPage />}
          />
          <Route path="/lol" element={<Navigate to="/admin" replace />} />
          <Route path="/:slug" element={<SlugRouteResolver />} />
          <Route path="/blogs" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route
            path="*"
            element={<NotFoundState onButtonClick={() => window.location.assign("/")} />}
          />
          </Routes>
        </AppShell>
      </SavedAdvisorsProvider>
    </BrowserRouter>
  );
}

export default App;
