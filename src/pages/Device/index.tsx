import { MoreHorizontal, Plus, Search } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
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
import { useCatalogStore } from '@/features/catalog/hooks';
import { DeviceEditor } from '@/features/device/components';
import { useDeviceStore } from '@/features/device/hooks';
import { Device } from '@/features/device/type';
import { RequestRepair } from '@/features/request/components';
import { useUserStore } from '@/features/user/hooks';
import { deviceStatuses } from '@/lib/options';

// Mock data for device

export default function DevicePage() {
  const navigate = useNavigate();

  const { handling, devices, getDevices, deleteDevice } = useDeviceStore(
    useShallow((state) => ({
      handling: state.handling,
      devices: state.data,
      getDevices: state.getDevices,
      deleteDevice: state.deleteDevice,
    }))
  );

  const { users, rooms, deviceTypes } = useCatalogStore(
    useShallow((state) => ({
      rooms: state.data.rooms,
      users: state.data.users,
      deviceTypes: state.data.device.type,
    }))
  );

  const { isMaintenance, isManager } = useUserStore(
    useShallow((state) => ({
      isMaintenance: state.isMaintenance,
      isManager: state.isManager,
    }))
  );

  useEffect(() => {
    getDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [repairDevice, setRepairDevice] = useState<Device>();
  const [deviceEdit, setDeviceEdit] = useState<Partial<Device>>();

  const filteredDevice = Object.values(devices).filter((device) =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
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
        {isMaintenance || isManager ? (
          <Button onClick={() => setDeviceEdit({})}>
            <Plus className="mr-2 h-4 w-4" /> Add New Device
          </Button>
        ) : null}
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search device..."
              className="pl-8 md:w-[300px] lg:w-[300px] bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Button variant="outline">Schedule Maintenance</Button>
          <Button variant="outline">Generate Report</Button>
        </div> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevice.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <div className="flex space-x-2">
                <img
                  src={device.image}
                  alt={device.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
                <div>
                  <CardTitle>{device.name}</CardTitle>
                  <CardDescription>
                    {deviceTypes[device.type]?.name}
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Serial:
                      </span>{' '}
                      {device.serial}
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-start">
                <span className="text-sm text-muted-foreground">
                  Room:{' '}
                  {rooms[device.roomId || '']?.name ||
                    'Not assigned to any room'}
                </span>
                <span className="text-sm text-muted-foreground">
                  User:{' '}
                  {users[device.employeeId || '']?.name ||
                    'Not assigned to any user'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Badge
                  style={{
                    backgroundColor: deviceStatuses[device.status]?.color,
                  }}
                >
                  {deviceStatuses[device.status]?.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last Assign:{' '}
                  {moment(device.assignedDate).format('DD/MM/YYYY')}
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
                  {isMaintenance || isManager ? (
                    <DropdownMenuItem onSelect={() => setDeviceEdit(device)}>
                      Edit Device
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem onSelect={() => setRepairDevice(device)}>
                    Request Repair
                  </DropdownMenuItem>
                  {isMaintenance || isManager ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => deleteDevice(device.id)}
                      >
                        Delete Device
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
