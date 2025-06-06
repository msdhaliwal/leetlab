import React from 'react';
import { User, Code, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { authUser } = useAuthStore();

  console.log('AUTH_USER', authUser);

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div className="mx-auto flex w-full max-w-4xl justify-between rounded-2xl border border-gray-200/10 bg-black/15 p-4 shadow-lg shadow-neutral-600/5 backdrop-blur-lg">
        {/* Logo Section */}
        <Link to="/" className="flex cursor-pointer items-center gap-3">
          <img
            src="/leetlab.svg"
            className="bg-primary/20 text-primary h-18 w-18 rounded-full border-none px-2 py-2"
          />
          <span className="hidden text-lg font-bold tracking-tight text-white md:block md:text-2xl">
            Leetlab
          </span>
        </Link>

        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-8">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar flex flex-row">
              <div className="w-10 rounded-full">
                <img
                  src={authUser?.image || 'https://avatar.iran.liara.run/public/boy'}
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 space-y-3 p-2 shadow"
            >
              {/* Admin Option */}

              {/* Common Options */}
              <li>
                <p className="text-base font-semibold">{authUser?.name}</p>
                <hr className="border-gray-200/10" />
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-primary text-base font-semibold hover:text-white"
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
              </li>
              {authUser?.role === 'ADMIN' && (
                <li>
                  <Link
                    to="/add-problem"
                    className="hover:bg-primary text-base font-semibold hover:text-white"
                  >
                    <Code className="mr-1 h-4 w-4" />
                    Add Problem
                  </Link>
                </li>
              )}
              <li>
                <LogoutButton className="hover:bg-primary hover:text-white">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
