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
import { User } from '@/features/user/type';

import { useCatalogStore } from '../../hooks';
import { UserEditor } from './UserEditor';

const UsersTab = () => {
  const { users, rooms, roles, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      users: state.data.users,
      rooms: state.data.rooms,
      roles: state.data.roles,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [filter, setFilter] = useState('');
  const [editor, setEditor] = useState<Partial<User>>();

  const filteredPersonnel = Object.values(users).filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSave = (type: Partial<User>) => {
    if (type.id) {
      updateCatalog('edit', 'users', type);
    } else {
      updateCatalog('add', 'users', type);
    }
    setEditor(undefined);
  };

  return (
    <Card>
      {editor ? (
        <UserEditor
          user={editor}
          onCancel={() => setEditor(undefined)}
          onSave={handleSave}
        />
      ) : null}
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>View and manage company personnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search personnel..."
              className="pl-8 w-[300px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersonnel.map((person) => (
              <TableRow key={person.id}>
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{rooms[person.roomId]?.name}</TableCell>
                <TableCell>
                  {roles[person.roleId]?.name || person.roleId}
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
                      <DropdownMenuItem onClick={() => setEditor(person)}>
                        Edit Employee
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => updateCatalog('delete', 'users', person)}
                      >
                        Remove Employee
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

export default UsersTab;
