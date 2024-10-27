import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeviceEditor, RequestRepair } from '@/features/device/components';
import { useDeviceStore } from '@/features/device/hooks';
import { Device } from '@/features/device/type';

// Mock data for device
const deviceData = [
  {
    id: 1,
    name: 'Forklift A',
    type: 'Forklift',
    status: 'Operational',
    lastMaintenance: '2023-09-15',
  },
  {
    id: 2,
    name: 'CNC Machine B',
    type: 'CNC Machine',
    status: 'In Maintenance',
    lastMaintenance: '2023-10-01',
  },
  {
    id: 3,
    name: 'Conveyor Belt C',
    type: 'Conveyor',
    status: 'Operational',
    lastMaintenance: '2023-08-30',
  },
  {
    id: 4,
    name: 'Drill Press D',
    type: 'Drill Press',
    status: 'In Repair',
    lastMaintenance: '2023-09-22',
  },
  {
    id: 5,
    name: 'Lathe E',
    type: 'Lathe',
    status: 'Operational',
    lastMaintenance: '2023-10-05',
  },
];

export default function DevicePage() {
  const navigate = useNavigate();

  const { devices, getDevices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
    }))
  );

  useEffect(() => {
    if (!Object.keys(devices).length) {
      getDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [repairDevice, setRepairDevice] = useState<Device>();
  const [deviceEdit, setDeviceEdit] = useState<Partial<Device>>();

  const filteredDevice = deviceData.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || device.status === statusFilter)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {deviceEdit ? (
        <DeviceEditor
          device={deviceEdit}
          onClose={() => setDeviceEdit(undefined)}
        />
      ) : null}
      {repairDevice ? (
        <RequestRepair
          device={repairDevice}
          onClose={() => setRepairDevice(undefined)}
        />
      ) : null}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Device Management</h1>
        <Button onClick={() => setDeviceEdit({})}>
          <Plus className="mr-2 h-4 w-4" /> Add New Device
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search device..."
              className="pl-8 md:w-[300px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
              <SelectItem value="In Maintenance">In Maintenance</SelectItem>
              <SelectItem value="In Repair">In Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Schedule Maintenance</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevice.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <CardTitle>{device.name}</CardTitle>
              <CardDescription>{device.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    device.status === 'Operational'
                      ? 'default'
                      : device.status === 'In Maintenance'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {device.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last Maintenance: {device.lastMaintenance}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={() => navigate(`/device/${device.id}`)}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log('Edit Device')}>
                    Edit Device
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => console.log('Schedule Maintenance')}
                  >
                    Schedule Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setRepairDevice(undefined)}>
                    Request Repair
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={() => console.log('Delete Device')}
                  >
                    Delete Device
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
