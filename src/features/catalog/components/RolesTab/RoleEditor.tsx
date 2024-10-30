import { useState } from 'react';

import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

import { Role } from '../../type';

type Props = {
  role: Partial<Role>;
  onCancel: () => void;
  onSave: (type: Partial<Role>) => void;
};

export const RoleEditor = ({ role, onCancel, onSave }: Props) => {
  const [editor, setEditor] = useState<Partial<Role>>(role);

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
          <DialogTitle>{role.id ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            Enter the details of the role here.
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

          <div className="flex justify-around">
            <div className="flex items-center space-x-1 col-span-1">
              <Checkbox
                id="dept-name"
                className="col-span-3"
                value={editor.name}
                onCheckedChange={(e) => {
                  if (e) {
                    setEditor({ ...editor, isAdmin: true });
                  } else {
                    setEditor({ ...editor, isAdmin: false });
                  }
                }}
              />
              <Label htmlFor="dept-name" className="text-right">
                Is Admin
              </Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                id="dept-name"
                value={editor.name}
                onCheckedChange={(e) => {
                  if (e) {
                    setEditor({ ...editor, isManager: true });
                  } else {
                    setEditor({ ...editor, isManager: false });
                  }
                }}
              />
              <Label htmlFor="dept-name" className="text-right">
                Is Manager
              </Label>
            </div>
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
            {role.id ? 'Save' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
