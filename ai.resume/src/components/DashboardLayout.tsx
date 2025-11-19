import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LayoutDashboard,
  FileText,
  Mail,
  Target,
  Linkedin,
  Briefcase,
  Settings,
  Bell,
  Menu,
  Sparkles,
  CreditCard,
  X,
  LogOut,
  User,
  CheckCircle2
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { logout } from "../utils/auth";
import api from '../api/axiosClient';
import logo from "../assets/logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ full_name: string; avatar_url?: string } | null>(null);


  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    // Load initially
    loadUser();

    // Listen for updates from other components
    window.addEventListener("user-updated", loadUser);

    // Cleanup
    return () => {
      window.removeEventListener("user-updated", loadUser);
    };
  }, []);

  function getInitials(name: string) {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase(); // e.g. "Raja" → "RA"
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(); // e.g. "Vasanthan Raju" → "VR"
  }


  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-violet-500 to-purple-500' },
    { path: '/resume-templates', icon: FileText, label: 'Resume', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/ats-checker', icon: CheckCircle2, label: 'ATS Checker', gradient: 'from-teal-500 to-cyan-500' },
    { path: '/cover-letter', icon: Mail, label: 'Cover Letter', gradient: 'from-green-500 to-emerald-500' },
    { path: '/job-fit', icon: Target, label: 'Job Fit', gradient: 'from-orange-500 to-red-500' },
    { path: '/linkedin-optimizer', icon: Linkedin, label: 'LinkedIn', gradient: 'from-blue-600 to-indigo-600' },
    // { path: '/portfolio', icon: Briefcase, label: 'Portfolio', gradient: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/30 to-purple-50/30">
      {/* Modern Top Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm">
        {/* Top Bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logo} alt="SmartCV Maker" className="w-30 h-14"/>
                {/* <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                  <Sparkles className="w-5 h-5 text-white" />
                </div> */}
                <div className="hidden sm:block">
                  <span className="bg-gradient-to-r text-cyan-600 bg-clip-text">
                    SmartCV Maker
                  </span>
                  <p className="text-gray-500 -mt-1">AI-Powered Beta</p>
                </div>
              </Link>

              {/* Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* <Link to="/pricing" className="hidden md:block">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-violet-100 text-violet-600">
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </Link> 
                <Button variant="ghost" size="sm" className="relative hover:bg-violet-100">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
                 */}
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none group">
                        {/* Avatar */}
                        <Avatar className="ring-2 ring-violet-200 hover:ring-violet-400 transition-all cursor-pointer">
                          {user?.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                            style={{ objectFit: 'cover' }} 
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white font-semibold">
                            {getInitials(user?.full_name || 'User')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {/* User name */}
                     <span className="text-gray-900 font-semibold group-hover:text-violet-600 transition-colors">
                        {user?.full_name || 'User'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        {user?.full_name || 'User'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden hover:bg-violet-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-violet-600" />
                  ) : (
                    <Menu className="w-5 h-5 text-violet-600" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 py-2 overflow-x-auto">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2.5 rounded-xl 
                      transition-all duration-200 whitespace-nowrap
                      ${isActive 
                        ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl"></div>
                    )}
                    <div className={`
                      relative z-10 p-1.5 rounded-lg
                      ${isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 group-hover:bg-white'
                      }
                    `}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="relative z-10 font-medium">{item.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Additional Nav Items */}
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              
              {/* <Link
                to="/pricing"
                className={`
                  group relative flex items-center gap-2 px-4 py-2.5 rounded-xl 
                  transition-all duration-200 whitespace-nowrap
                  ${location.pathname === '/pricing'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-lg
                  ${location.pathname === '/pricing'
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-white'
                  }
                `}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-medium">Pricing</span>
              </Link> */}

              <Link
                to="/settings"
                className={`
                  group relative flex items-center gap-2 px-4 py-2.5 rounded-xl 
                  transition-all duration-200 whitespace-nowrap
                  ${location.pathname === '/settings'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-lg
                  ${location.pathname === '/settings'
                    ? 'bg-white/20' 
                    : 'bg-gray-100 group-hover:bg-white'
                  }
                `}>
                  <Settings className="w-4 h-4" />
                </div>
                <span className="font-medium">Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="max-w-[1600px] mx-auto px-4 py-3">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        group relative flex items-center gap-3 px-4 py-3 rounded-xl 
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl"></div>
                      )}
                      <div className={`
                        relative z-10 p-2 rounded-lg
                        ${isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-white'
                        }
                      `}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="relative z-10 font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-gray-200 my-2"></div>

                {/* <Link
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl 
                    transition-all duration-200
                    ${location.pathname === '/pricing'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg
                    ${location.pathname === '/pricing'
                      ? 'bg-white/20' 
                      : 'bg-gray-100 group-hover:bg-white'
                    }
                  `}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Pricing</span>
                </Link> */}

                <div className="h-px bg-gray-200 my-2"></div>

                {/* Log Out Button */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                >
                  <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Log Out</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {children}
      </main>
      <footer className="bg-gray-900 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-400">
            <p>&copy; 2025 SmartCV Maker. All rights reserved. Powered by Inspira.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}