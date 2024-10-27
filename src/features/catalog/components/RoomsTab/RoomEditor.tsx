import { useState } from 'react';

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

import { Room } from '../../type';

type Props = {
  room: Partial<Room>;
  onCancel: () => void;
  onSave: (type: Partial<Room>) => void;
};

export const RoomEditor = ({ room, onCancel, onSave }: Props) => {
  const [editor, setEditor] = useState<Partial<Room>>(room);

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
            <Input
              id="leader"
              className="col-span-3"
              value={editor.leader}
              onChange={(e) => setEditor({ ...editor, leader: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => onSave(editor)}>
            {room.id ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
