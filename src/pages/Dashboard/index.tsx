'use client';

import {
  CalendarDays,
  CheckCircle,
  Construction,
  MonitorSmartphone,
  Settings,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useShallow } from 'zustand/shallow';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import { useLiquidationStore } from '@/features/liquidation/hooks';
import { useRequestStore } from '@/features/request/hooks';
import { Request } from '@/features/request/type';
import { useUserStore } from '@/features/user/hooks';

const equipmentPerformance = [
  { name: 'Jan', efficiency: 65 },
  { name: 'Feb', efficiency: 59 },
  { name: 'Mar', efficiency: 80 },
  { name: 'Apr', efficiency: 81 },
  { name: 'May', efficiency: 56 },
  { name: 'Jun', efficiency: 55 },
  { name: 'Jul', efficiency: 40 },
];

const renderTasks = (request: Request, title: string) => {
  switch (request.status) {
    case 'inProgress':
    case 'approved':
      return (
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="ml-auto font-medium text-blue-500">In Progress</div>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-yellow-500" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">
              Scheduled for:{' '}
              {moment(request.scheduledDate || undefined).format('DD MMM YYYY')}
            </p>
          </div>
          <div className="ml-auto font-medium text-yellow-500">Pending</div>
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">
              Completed on:{' '}
              {moment(request.completedDate).format('DD MMM YYYY')}
            </p>
          </div>
          <div className="ml-auto font-medium text-green-500">Completed</div>
        </div>
      );
    default:
      return null;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isManager } = useUserStore(
    useShallow((state) => ({
      isManager: state.isManager,
    }))
  );

  const { devices, getDevices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
    }))
  );

  const { requests, getRequests } = useRequestStore(
    useShallow((state) => ({
      requests: state.data,
      getRequests: state.getRequests,
    }))
  );

  const { liquidations, getLiquidations } = useLiquidationStore(
    useShallow((state) => ({
      liquidations: state.data,
      getLiquidations: state.getLiquidations,
    }))
  );

  const { requestTypes } = useCatalogStore(
    useShallow((state) => ({
      requestTypes: state.data.request.type,
    }))
  );

  useEffect(() => {
    if (!isManager) {
      navigate('/device');
    } else {
      getDevices();
      getRequests();
      getLiquidations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(() => {
    const totalDevice = Object.values(devices).length;
    const activeDevice = Object.values(devices).filter(
      (device) => device.status === 'active'
    ).length;
    const requsetsStatus = Object.values(requests).filter(
      (request) => request.status === 'approved'
    ).length;

    const liquidationStatus = Object.values(liquidations).filter(
      (liquidation) => liquidation.status === 'approved'
    ).length;

    return {
      totalDevice,
      activeDevice,
      requsetsStatus,
      liquidationStatus,
    };
  }, [devices, liquidations, requests]);

  const requestList = useMemo(() => {
    const sortedRequests = Object.values(requests).sort(
      (a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
    );
    return sortedRequests.slice(0, 3);
  }, [requests]);
  console.log('requestList', requestList);

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Device
              </CardTitle>
              <MonitorSmartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalDevice}</div>
              <p className="text-xs text-muted-foreground">
                Total equipment in the system
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Device
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.activeDevice}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.activeDevice * 100) / data.totalDevice)}% of
                total equipment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In Maintenance
              </CardTitle>
              <Construction className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.requsetsStatus}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.requsetsStatus * 100) / data.totalDevice)}% of
                total equipment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Liquidation</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.liquidationStatus}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((data.liquidationStatus * 100) / data.totalDevice)}%
                of total equipment
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Equipment Performance</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  efficiency: {
                    label: 'Efficiency',
                    color: 'hsl(var(--chart-1))',
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentPerformance}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="efficiency"
                      fill="var(--color-efficiency)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Maintenance Tasks</CardTitle>
              <CardDescription>
                Latest updates on equipment maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {requestList.map((request) => {
                  const title = `${requestTypes[request.type]?.name} - ${
                    devices[request.deviceId]?.name
                  }`;
                  return (
                    <div key={request.id}>{renderTasks(request, title)}</div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
                <Button>
                  <PenTool className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
                <Button>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Request Repair
                </Button>
                <Button>
                  <Truck className="mr-2 h-4 w-4" />
                  Add New Equipment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </main>
    </div>
  );
}
