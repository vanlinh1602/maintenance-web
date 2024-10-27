import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { DeviceStatus } from '../../type';

type Props = {
  status: Partial<DeviceStatus>;
  onCancel: () => void;
  onSave: (status: Partial<DeviceStatus>) => void;
};

export const StatusEditor = ({ status, onCancel, onSave }: Props) => {
  const [editor, setEditor] = useState<Partial<DeviceStatus>>(status);

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
          <DialogTitle>Add New DeviceStatus</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Status
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={editor.status}
              onChange={(e) => setEditor({ ...editor, status: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => onSave(editor)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
