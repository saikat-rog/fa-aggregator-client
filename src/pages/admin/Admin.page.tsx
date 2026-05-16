import { useMemo } from "react";
import { AdminLoginCard } from "../../components/admin/AdminLoginCard";
import { AdminPageContent } from "../../components/admin/AdminPageContent";

export function AdminPage() {
  const isAdmin = useMemo(
    () => Boolean(localStorage.getItem("token")) && localStorage.getItem("role") === "admin",
    [],
  );

  if (!isAdmin) {
    return <AdminLoginCard />;
  }

  return <AdminPageContent />;
}
