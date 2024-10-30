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
import { RequestStatus } from '../../type';
import { StatusEditor } from './StatusEditor';

const RequestStatusTab = () => {
  const { requestStatus, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      requestStatus: state.data.request.status,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [editor, setEditor] = useState<Partial<RequestStatus>>();

  const handleSave = (status: Partial<RequestStatus>) => {
    if (status.id) {
      updateCatalog('edit', 'request-status', status);
    } else {
      updateCatalog('add', 'request-status', status);
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
        <CardTitle>Request Status Management</CardTitle>
        <CardDescription>View and manage request status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end items-center mb-4">
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Request Status
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(requestStatus).map(([id, status], index) => (
              <TableRow key={id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{status.name}</TableCell>
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
                          updateCatalog('delete', 'request-status', status)
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

export default RequestStatusTab;
