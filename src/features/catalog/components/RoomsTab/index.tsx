import { MoreHorizontal, Plus, Search } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useCatalogStore } from '../../hooks';
import { Room } from '../../type';
import { RoomEditor } from './RoomEditor';

const RoomsTab = () => {
  const { rooms, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      users: state.data.users,
      rooms: state.data.rooms,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [filter, setFilter] = useState('');
  const [editor, setEditor] = useState<Partial<Room>>();

  const filteredRooms = Object.values(rooms).filter((room) =>
    room.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSave = (type: Partial<Room>) => {
    if (type.id) {
      updateCatalog('edit', 'rooms', type);
    } else {
      updateCatalog('add', 'rooms', type);
    }
    setEditor(undefined);
  };
  return (
    <Card>
      {editor ? (
        <RoomEditor
          room={editor}
          onCancel={() => setEditor(undefined)}
          onSave={handleSave}
        />
      ) : null}
      <CardHeader>
        <CardTitle>Room Management</CardTitle>
        <CardDescription>View and manage company departments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search departments..."
              className="pl-8 w-[300px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.leader}</TableCell>
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
                      <DropdownMenuItem onClick={() => setEditor(dept)}>
                        Edit Room
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => updateCatalog('delete', 'rooms', dept)}
                      >
                        Remove Room
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

export default RoomsTab;
