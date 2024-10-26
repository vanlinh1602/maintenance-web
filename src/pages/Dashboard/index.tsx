'use client';

import {
  CalendarDays,
  CheckCircle,
  PenTool,
  Settings,
  Truck,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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

const equipmentPerformance = [
  { name: 'Jan', efficiency: 65 },
  { name: 'Feb', efficiency: 59 },
  { name: 'Mar', efficiency: 80 },
  { name: 'Apr', efficiency: 81 },
  { name: 'May', efficiency: 56 },
  { name: 'Jun', efficiency: 55 },
  { name: 'Jul', efficiency: 40 },
];

export default function Dashboard() {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Equipment
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">245</div>
              <p className="text-xs text-muted-foreground">
                +3 from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operational</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">208</div>
              <p className="text-xs text-muted-foreground">
                85% of total equipment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In Maintenance
              </CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">
                10% of total equipment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Repair</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                5% of total equipment
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
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Forklift Annual Service
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completed on: 15 Oct 2023
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-green-500">
                    Complete
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-yellow-500" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      CNC Machine Calibration
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Scheduled for: 22 Oct 2023
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-yellow-500">
                    Pending
                  </div>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4 text-blue-500" />
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Conveyor Belt Replacement
                    </p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="ml-auto font-medium text-blue-500">
                    In Progress
                  </div>
                </div>
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
