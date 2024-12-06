import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/features/user/type';

import { useCatalogStore } from '../../hooks';

type Props = {
  user: Partial<User>;
  onCancel: () => void;
  onSave: (user: Partial<User>) => void;
};

export const UserEditor = ({ user, onCancel, onSave }: Props) => {
  const { rooms, roles, users } = useCatalogStore(
    useShallow((state) => ({
      rooms: state.data.rooms,
      roles: state.data.roles,
      users: state.data.users,
    }))
  );

  const [editor, setEditor] = useState<Partial<User>>(user);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user.id ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new employee here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={editor.name}
              onChange={(e) => setEditor({ ...editor, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              className="col-span-3"
              value={editor.email}
              onChange={(e) => setEditor({ ...editor, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Room
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={editor.roomId}
              onValueChange={(roomId) => setEditor({ ...editor, roomId })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(rooms).map(([roomId, room]) => (
                  <SelectItem key={roomId} value={roomId}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">
              Role
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={editor.roleId}
              onValueChange={(roleId) => setEditor({ ...editor, roleId })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(roles).map(([roleId, role]) => (
                  <SelectItem key={roleId} value={roleId}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (
                !editor.name ||
                !editor.email ||
                !editor.roomId ||
                !editor.roleId
              ) {
                toast({
                  title: 'Error',
                  description: 'Please fill in all the required fields.',
                  variant: 'destructive',
                });
                return;
              }

              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editor.email)) {
                toast({
                  title: 'Error',
                  description: 'Invalid email address.',
                  variant: 'destructive',
                });
                return;
              }

              if (
                Object.values(users).find(
                  (u) => u.id !== editor.id && u.email === editor.email
                )
              ) {
                toast({
                  title: 'Error',
                  description: 'User with this email already exists.',
                  variant: 'destructive',
                });
                return;
              }
              onSave(editor);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
