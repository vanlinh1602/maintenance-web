import { Check, MoreHorizontal, Plus, Search, X } from 'lucide-react';
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
import { Role } from '../../type';
import { RoleEditor } from './RoleEditor';

const RolesTab = () => {
  const { roles, updateCatalog } = useCatalogStore(
    useShallow((state) => ({
      roles: state.data.roles,
      updateCatalog: state.updateCatalog,
    }))
  );

  const [filter, setFilter] = useState('');
  const [editor, setEditor] = useState<Partial<Role>>();

  const filteredRoles = Object.values(roles).filter((role) =>
    role.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSave = (type: Partial<Role>) => {
    if (type.id) {
      updateCatalog('edit', 'roles', type);
    } else {
      updateCatalog('add', 'roles', type);
    }
    setEditor(undefined);
  };
  return (
    <Card>
      {editor ? (
        <RoleEditor
          role={editor}
          onCancel={() => setEditor(undefined)}
          onSave={handleSave}
        />
      ) : null}
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>View and manage role</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search role..."
              className="pl-8 w-[300px]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button onClick={() => setEditor({})}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Is Admin</TableHead>
              <TableHead>Is Manager</TableHead>
              <TableHead>Is Maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role, index) => (
              <TableRow key={role.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.isAdmin ? (
                    <Check className="text-primary" />
                  ) : (
                    <X className="text-destructive" />
                  )}
                </TableCell>
                <TableCell>
                  {role.isManager ? (
                    <Check className="text-primary" />
                  ) : (
                    <X className="text-destructive" />
                  )}
                </TableCell>
                <TableCell>
                  {role.isMaintenance ? (
                    <Check className="text-primary" />
                  ) : (
                    <X className="text-destructive" />
                  )}
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
                      <DropdownMenuItem onClick={() => setEditor(role)}>
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => updateCatalog('delete', 'roles', role)}
                      >
                        Remove Role
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

export default RolesTab;
