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

import { useCatalogStore } from '../../hooks';
import { Room } from '../../type';

type Props = {
  room: Partial<Room>;
  onCancel: () => void;
  onSave: (type: Partial<Room>) => void;
};

export const RoomEditor = ({ room, onCancel, onSave }: Props) => {
  const [editor, setEditor] = useState<Partial<Room>>(room);
  const { users } = useCatalogStore(
    useShallow((state) => ({
      users: state.data.users,
    }))
  );

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
          <DialogTitle>{room.id ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          <DialogDescription>
            Enter the details of the department here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dept-name" className="text-right">
              Name
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dept-name"
              className="col-span-3"
              value={editor.name}
              onChange={(e) => setEditor({ ...editor, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              Leader
            </Label>
            <Select
              onValueChange={(leader) => setEditor({ ...editor, leader })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select leader" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(users).map(([userId, user]) => (
                  <SelectItem key={userId} value={userId}>
                    {user.name}
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
              if (!editor.name) {
                toast({
                  title: 'Error',
                  description: 'Name is required',
                  variant: 'destructive',
                });
                return;
              }
              onSave(editor);
            }}
          >
            {room.id ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
