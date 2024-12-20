import { saveAs } from 'file-saver';
import { FilterIcon, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import XlsxPopulate from 'xlsx-populate';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
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
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import FilterRequest from '@/features/request/components/FilterRequest';
import { useRequestStore } from '@/features/request/hooks';
import { useUserStore } from '@/features/user/hooks';
import { BACKEND } from '@/lib/config';
import { requestStatuses } from '@/lib/options';
import formatError from '@/utils/formatError';

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

  const { requestType, users } = useCatalogStore(
    useShallow((state) => ({
      requestType: state.data.request.type,
      users: state.data.users,
    }))
  );

  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
    }))
  );

  const [filter, setFilter] = useState<{
    open: boolean;
    from?: Date;
    to?: Date;
    status?: string;
  }>({ open: false });

  const filteredRequests = useMemo(
    () =>
      Object.values(requests).filter((task) => {
        if (filter.from) {
          if (moment(task.createdAt).isBefore(filter.from)) {
            return false;
          }
        }
        if (filter.to) {
          if (moment(task.createdAt).isAfter(filter.to)) {
            return false;
          }
        }
        if (filter.status && filter.status !== 'all') {
          if (task.status !== filter.status) {
            return false;
          }
        }
        return true;
      }),
    [requests, filter]
  );

  useEffect(() => {
    if (!Object.keys(requests).length) {
      getRequests();
    }
    if (!Object.keys(devices).length) {
      getDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exportExcel = async () => {
    const req = new XMLHttpRequest();
    req.open('GET', `${BACKEND}/excel/template.xlsx`, true);
    req.responseType = 'arraybuffer';
    req.onreadystatechange = () => {
      if (req.readyState === 4 && req.status === 200) {
        XlsxPopulate.fromDataAsync(req.response).then((wb) => {
          const ws = wb.sheet(0);
          let row = 2;
          filteredRequests.forEach((task, index) => {
            ws.row(row)
              .cell(1)
              .value(index + 1);
            ws.row(row).cell(2).value(devices[task.deviceId]?.name);
            ws.row(row).cell(3).value(task.description);
            ws.row(row)
              .cell(4)
              .value(moment(task.createdAt).format('DD/MM/YYYY'));
            ws.row(row).cell(5).value(users[task.creator]?.name);
            ws.row(row)
              .cell(6)
              .value(users[task.assignedTo || '']?.name);
            if (task.scheduledDate) {
              ws.row(row)
                .cell(7)
                .value(moment(task.scheduledDate).format('DD/MM/YYYY'));
            }
            ws.row(row)
              .cell(8)
              .value(devices[task.replacementDeviceId || '']?.name);
            ws.row(row).cell(9).value(requestStatuses[task.status]?.name);
            row += 1;
          });
          return wb.outputAsync().then((data) => {
            if (data !== undefined) {
              saveAs(data as any, 'report-request.xlsx');
            } else {
              toast({
                title: 'Error',
                description: 'Cannot export excel file',
                variant: 'destructive',
              });
            }
          });
        });
      }
    };

    req.onerror = (err) => {
      toast({
        title: 'Error',
        description: formatError(err),
        variant: 'destructive',
      });
    };
    req.send();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      {filter.open ? (
        <FilterRequest
          onClose={() => setFilter({ open: false })}
          onSubmit={(values) => setFilter({ ...values, open: false })}
        />
      ) : null}
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
          <Button
            onClick={() => setFilter((pre) => ({ ...pre, open: true }))}
            variant="outline"
            className="h-8"
          >
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
          {Object.values(filter).some((value) => value) ? (
            <Button
              onClick={() => setFilter({ open: false })}
              variant="outline"
              className="h-8"
            >
              Clear Filter
            </Button>
          ) : null}
        </div>
        <Button onClick={exportExcel}>Export Excel</Button>
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
