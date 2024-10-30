import { useState } from 'react';

import { toast } from '@/components/hooks/use-toast';
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

import { RequestStatus } from '../../type';

type Props = {
  status: Partial<RequestStatus>;
  onCancel: () => void;
  onSave: (status: Partial<RequestStatus>) => void;
};

export const StatusEditor = ({ status, onCancel, onSave }: Props) => {
  const [editor, setEditor] = useState<Partial<RequestStatus>>(status);

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
          <DialogTitle>Add New Request Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Status
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={editor.name}
              onChange={(e) => setEditor({ ...editor, name: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              if (!editor.name) {
                toast({
                  title: 'Error',
                  description: 'Please enter a status name',
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
