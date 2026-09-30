import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="py-8 sm:py-10 bg-[var(--bg)] min-h-[calc(100vh-80px)]">
      <div className="wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
