import { MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DeviceType } from '../../type';
import { TypeEditor } from './TypeEditor';

const DeviceTypeTab = () => {
  const { deviceType, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      deviceType: state.data.device.type,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [editor, setEditor] = useState<Partial<DeviceType>>();

  const handleSave = (type: Partial<DeviceType>) => {
    if (type.id) {
      updateCatalog('edit', 'device-type', type);
    } else {
      updateCatalog('add', 'device-type', type);
    }
    setEditor(undefined);
  };

  return (
    <Card>
      {editor ? (
        <TypeEditor
          type={editor}
          onCancel={() => setEditor(undefined)}
          onSave={handleSave}
        />
      ) : null}
      <CardHeader>
        <CardTitle>Device Status Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end items-center mb-4">
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Device Type
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(deviceType).map(([id, type]) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{type.type}</TableCell>
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
                      <DropdownMenuItem onClick={() => setEditor(type)}>
                        Edit Type
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() =>
                          updateCatalog('delete', 'device-type', type)
                        }
                      >
                        Remove Type
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

export default DeviceTypeTab;
