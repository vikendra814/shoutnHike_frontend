import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuotaBadge from './QuotaBadge';
import {
  HomeIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  PhotoIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/tools/social-media', label: 'Social Media', icon: MegaphoneIcon },
  { to: '/tools/seo', label: 'SEO Content', icon: DocumentTextIcon },
  { to: '/tools/google-ads', label: 'Google Ads', icon: MegaphoneIcon },
  { to: '/tools/design-brief', label: 'Design Brief', icon: PhotoIcon },
  { to: '/history', label: 'History', icon: ClockIcon },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">
          <span className="text-brand-500">Shoutn</span>Hike
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">AI Marketing Suite</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === to
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {label}
          </Link>
        ))}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/admin'
                ? 'bg-purple-500/20 text-purple-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ShieldCheckIcon className="h-4 w-4" />
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <QuotaBadge />
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors ml-2">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
