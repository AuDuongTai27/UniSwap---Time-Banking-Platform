import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Clock, User, Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { apiFetch } from '@/app/data/api';
import type { User as UserType } from '@/app/data/mock-data';

export function Header() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    apiFetch('/api/me').then(data => setCurrentUser(data)).catch(() => {});
  }, []);

  const availableCredits = currentUser
    ? (currentUser.credits_earned - currentUser.credits_spent).toFixed(1)
    : '0';

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniSwap
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Browse Skills
            </Link>
            <Link to="/my-activity" className={`text-sm transition-colors hover:text-blue-600 ${isActive('/my-activity') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              My Activity
            </Link>
            <Link to="/how-it-works" className={`text-sm transition-colors hover:text-blue-600 ${isActive('/how-it-works') ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">{availableCredits} credits</span>
            </div>
            <Link to="/post-service">
              <Button size="sm" className="hidden md:flex gap-2">
                <Plus className="h-4 w-4" />
                Post Service
              </Button>
            </Link>
            <Link to="/profile">
              <Avatar className="h-10 w-10 border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-colors">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}