import {
  GitFork,
  LayoutDashboard,
  ListTodo,
  LogOut,
  MonitorSmartphone,
  Receipt,
  User,
} from 'lucide-react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/features/user/hooks';
import { auth } from '@/services/firebase';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = useMemo(() => {
    const path = location.pathname;
    const key = path.split('/')[1];
    return key || 'home';
  }, [location.pathname]);

  const { userInfo, signOut } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
      signOut: state.signOut,
    }))
  );

  if (activeKey === 'login') {
    return null;
  }

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white">
      <Button
        variant="link"
        className="flex items-center justify-center"
        onClick={() => navigate('/')}
      >
        Device Management
      </Button>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/')}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/device')}
        >
          <MonitorSmartphone className="h-4 w-4" />
          Device
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/request')}
        >
          <ListTodo className="h-4 w-4" />
          Request
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/liquidation')}
        >
          <Receipt className="h-4 w-4" />
          Liquidation
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/catalog')}
        >
          <GitFork className="h-4 w-4" />
          Catalog
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              id="login-button"
              variant="ghost"
              className="flex items-center"
            >
              {userInfo?.avatar ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={userInfo.avatar} alt="avatar" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5 text-gray-600" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator /> */}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                auth.signOut().then(() => {
                  signOut();
                });
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};
