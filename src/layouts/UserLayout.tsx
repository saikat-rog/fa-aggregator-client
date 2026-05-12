import { Outlet } from 'react-router-dom'

const UserLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;