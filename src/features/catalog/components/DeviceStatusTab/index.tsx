import { MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useCatalogStore } from '../../hooks';
import { DeviceStatus } from '../../type';
import { StatusEditor } from './StatusEditor';

const DeviceStatusTab = () => {
  const { deviceStatus, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      deviceStatus: state.data.device.status,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [editor, setEditor] = useState<Partial<DeviceStatus>>();

  const handleSave = (status: Partial<DeviceStatus>) => {
    if (status.id) {
      updateCatalog('edit', 'device-status', status);
    } else {
      updateCatalog('add', 'device-status', status);
    }
    setEditor(undefined);
  };

  return (
    <Card>
      {editor ? (
        <StatusEditor
          status={editor}
          onCancel={() => setEditor(undefined)}
          onSave={handleSave}
        />
      ) : null}
      <CardHeader>
        <CardTitle>Personnel Management</CardTitle>
        <CardDescription>View and manage company personnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end items-center mb-4">
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Device Status
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(deviceStatus).map(([id, status]) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{status.status}</TableCell>
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
                      <DropdownMenuItem onClick={() => setEditor(status)}>
                        Edit Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() =>
                          updateCatalog('delete', 'device-status', status)
                        }
                      >
                        Remove
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
  );
};

export default DeviceStatusTab;
