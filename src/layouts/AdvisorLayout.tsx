import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../components/RoutePrivacy/ProtectedRoute";
const AdvisorLayout = () => {
  return (
    <ProtectedRoute allowedRoles={["advisor"]}>
      <Outlet />
    </ProtectedRoute>
  );
};

export default AdvisorLayout;