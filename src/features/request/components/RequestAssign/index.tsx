import { useMemo, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCatalogStore } from '@/features/catalog/hooks';

type Props = {
  onClose: () => void;
  onSubmit: (user: string) => void;
};

const RequestAssign = ({ onClose, onSubmit }: Props) => {
  const { users, roles } = useCatalogStore(
    useShallow((state) => ({
      users: state.data.users,
      roles: state.data.roles,
    }))
  );
  const [selectedUser, setSelectedUser] = useState('');

  const filteredUsers = useMemo(() => {
    return Object.values(users).filter((user) => {
      return roles[user.roleId]?.isMaintenance || false;
    });
  }, [users, roles]);

  const handleSubmit = () => {
    if (!selectedUser) {
      toast({
        title: 'User is required',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(selectedUser);
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign</DialogTitle>
          <DialogDescription>
            Assign this maintenance task to a user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Assign to
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setSelectedUser(value)}
              value={selectedUser}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestAssign;
