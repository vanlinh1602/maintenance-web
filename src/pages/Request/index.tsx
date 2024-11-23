'use client';

import { MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import { useRequestStore } from '@/features/request/hooks';
import { useUserStore } from '@/features/user/hooks';
import { requestStatuses } from '@/lib/options';

export default function MaintenancePage() {
  const navigate = useNavigate();

  const { handling, requests, getRequests, deleteRequest } = useRequestStore(
    useShallow((state) => ({
      handling: state.handling,
      requests: state.data,
      getRequests: state.getRequests,
      deleteRequest: state.deleteRequest,
    }))
  );

  const { devices, getDevices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
    }))
  );

  const { requestType } = useCatalogStore(
    useShallow((state) => ({
      requestType: state.data.request.type,
    }))
  );

  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
    }))
  );

  const [filter, setFilter] = useState('All');

  const filteredRequests = useMemo(
    () =>
      Object.values(requests).filter((task) => {
        if (filter === 'All') {
          return true;
        }
        return task.status === filter;
      }),
    [requests, filter]
  );

  useEffect(() => {
    getRequests();
    if (!Object.keys(devices).length) {
      getDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Maintenance Management</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {/* <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search maintenance tasks..."
              className="pl-8 md:w-[300px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}
          <Select onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {Object.entries(requestStatuses).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.map((task) => (
          <Card key={task.id}>
            <CardHeader>
              <div className="flex space-x-2">
                <img
                  src={task.image}
                  alt="device"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <CardTitle>
                    {requestType[task.type]?.name} -{' '}
                    {devices[task.deviceId]?.name}
                  </CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge
                  style={{
                    backgroundColor: requestStatuses[task.status]?.color,
                  }}
                >
                  {requestStatuses[task.status]?.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Date create: {moment(task.createdAt).format('DD/MM/YYYY')}
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
                    onSelect={() => navigate(`/request/${task.id}`)}
                  >
                    View Details
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Edit Task</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Completed</DropdownMenuItem> */}
                  {task.creator === userInfo?.id.toString() ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={() => deleteRequest(task.id)}
                      >
                        Cancel Task
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
