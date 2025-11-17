import { useEffect, useState } from "react";
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser); // ✅ true if user exists
  }, []);
  return (
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-gray-900 dark:text-white">CareerBoost</span>
                        <p className="text-gray-500 -mt-1">AI-Powered Beta</p>
                    </div>
                </Link>
              
            </div>
            <div className="flex items-center gap-3">
              {/* <ThemeToggle /> */}
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-base font-medium text-violet-600 hover:bg-violet-50"
                  >
                    View Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-base font-medium">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
  );
}
