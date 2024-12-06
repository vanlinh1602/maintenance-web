'use client';

import { MoreHorizontal, Plus } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import {
  EditLiquidationStatus,
  LiquidationEditor,
} from '@/features/liquidation/components';
import { useLiquidationStore } from '@/features/liquidation/hooks';
import { Liquidation } from '@/features/liquidation/type';
import { useUserStore } from '@/features/user/hooks';
import { liquidationStautses } from '@/lib/options';

export default function LiquidationRequestPage() {
  // const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editor, setEditor] = useState<Partial<Liquidation>>();
  const [changeStatus, setChangeStatus] = useState<Liquidation>();

  const { handling, liquidations, getLiquidations, deleteLiquidation } =
    useLiquidationStore(
      useShallow((state) => ({
        handling: state.handling,
        liquidations: state.data,
        getLiquidations: state.getLiquidations,
        deleteLiquidation: state.deleteLiquidation,
      }))
    );

  const { devices, getDevices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
    }))
  );

  const { users } = useCatalogStore(
    useShallow((state) => ({
      users: state.data.users,
    }))
  );

  const { isAdmin, isMaintenance, isManager } = useUserStore(
    useShallow((state) => ({
      isAdmin: state.isAdmin,
      isManager: state.isManager,
      isMaintenance: state.isMaintenance,
    }))
  );

  useEffect(() => {
    if (!Object.keys(liquidations).length) {
      getLiquidations();
    }
    if (!Object.keys(devices).length) {
      // Fetch devices if not available
      getDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRequests = useMemo(
    () =>
      Object.values(liquidations).filter(
        (request) => statusFilter === 'All' || request.status === statusFilter
      ),
    [liquidations, statusFilter]
  );

  const { total, pending, approved, reject } = useMemo(() => {
    const result = Object.values(liquidations).reduce(
      (acc, request) => {
        acc.total++;
        if (request.status === 'pending') {
          acc.pending++;
        }
        if (request.status === 'approved') {
          acc.approved++;
        }
        if (request.status === 'reject') {
          acc.reject++;
        }
        return acc;
      },
      { total: 0, pending: 0, approved: 0, reject: 0 }
    );

    return result;
  }, [liquidations]);

  return (
    <div className="container mx-auto">
      {handling ? <Waiting /> : null}
      {editor ? (
        <LiquidationEditor
          liquidation={
            Object.keys(editor).length ? (editor as Liquidation) : undefined
          }
          onClose={() => setEditor(undefined)}
        />
      ) : null}
      {changeStatus ? (
        <EditLiquidationStatus
          liquidation={changeStatus}
          onClose={() => setChangeStatus(undefined)}
        />
      ) : null}
      <div></div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center mb-6">
          <div>
            <CardTitle>Liquidation Request Overview</CardTitle>
            <CardDescription>
              Quick summary of liquidation requests
            </CardDescription>
          </div>
          {isMaintenance || isAdmin ? (
            <Button onClick={() => setEditor({})}>
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-sm text-muted-foreground">
              Total Requests
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-yellow-500">
              {pending}
            </span>
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-green-500">
              {approved}
            </span>
            <span className="text-sm text-muted-foreground">Approved</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-500">{reject}</span>
            <span className="text-sm text-muted-foreground">Rejected</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end items-center mb-4 space-y-2 sm:space-y-0">
        {/* <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
        <Select onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {Object.entries(liquidationStautses).map(([key, { name }]) => (
              <SelectItem key={key} value={key}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device Name</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Request by</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {devices[request.deviceId]?.name || request.deviceId}
                  </TableCell>
                  <TableCell>{devices[request.deviceId]?.serial}</TableCell>
                  <TableCell>
                    {moment(request.createdAt).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell>
                    {users[request.requestBy]?.name || request.requestBy}
                  </TableCell>
                  <TableCell>
                    <Badge
                      style={{
                        backgroundColor:
                          liquidationStautses[request.status]?.color,
                      }}
                    >
                      {liquidationStautses[request.status].name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem>View Details</DropdownMenuItem> */}
                        {isMaintenance || isAdmin ? (
                          <DropdownMenuItem onSelect={() => setEditor(request)}>
                            Edit Request
                          </DropdownMenuItem>
                        ) : null}
                        {isManager || isAdmin ? (
                          <DropdownMenuItem
                            onSelect={() => setChangeStatus(request)}
                          >
                            Change Status
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => deleteLiquidation(request.id)}
                        >
                          Delete Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
