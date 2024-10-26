import { Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white">
      <Button variant="link" className="flex items-center justify-center">
        <Truck className="h-6 w-6" />
        <span className="ml-2">Equip Master</span>
      </Button>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/')}
        >
          Dashboard
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/equipment')}
        >
          Equipment
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/maintenance')}
        >
          Maintenance
        </Button>
        <Button
          variant="link"
          className="text-sm font-medium hover:underline underline-offset-4"
          onClick={() => navigate('/control')}
        >
          Control
        </Button>
      </nav>
    </header>
  );
};
