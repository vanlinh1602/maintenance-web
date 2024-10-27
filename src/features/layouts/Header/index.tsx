import {
  GitFork,
  LayoutDashboard,
  ListTodo,
  MonitorSmartphone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Header = () => {
  const navigate = useNavigate();
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
          onClick={() => navigate('/catalog')}
        >
          <GitFork className="h-4 w-4" />
          Catalog
        </Button>
      </nav>
    </header>
  );
};
