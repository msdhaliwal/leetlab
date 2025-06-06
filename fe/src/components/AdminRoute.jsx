import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LoaderPinwheel } from 'lucide-react';

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderPinwheel className="size-10 animate-spin" />
      </div>
    );
  }
  if (!authUser || authUser.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;
