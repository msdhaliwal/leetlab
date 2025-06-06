import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AddProblem from './pages/AddProblem';
import ProblemPage from './pages/ProblemPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import Layout from './layout/Layout';
import AdminRoute from './components/AdminRoute';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={authUser ? <HomePage /> : <Navigate to={'/login'} />} />
        </Route>

        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />

        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
        />
        <Route element={<AdminRoute />}>
          <Route path="/add-problem" element={authUser ? <AddProblem /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
