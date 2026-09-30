import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from '../components/RoutePrivacy/ProtectedRoute';

const AdvisorLayout = () => {
  return (
    <ProtectedRoute allowedRoles={['advisor']}>
      <div className="py-8 sm:py-10 bg-[var(--bg)] min-h-[calc(100vh-80px)]">
        <div className="wrap">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdvisorLayout;
