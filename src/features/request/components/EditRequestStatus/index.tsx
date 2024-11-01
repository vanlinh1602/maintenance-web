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
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/features/user/hooks';
import { requestStatuses } from '@/lib/options';

type Props = {
  onClose: () => void;
  onSubmit: (status: string, notes: string) => void;
};

const EditRequestStatus = ({ onClose, onSubmit }: Props) => {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const { isManager } = useUserStore(
    useShallow((state) => ({
      isMaintenance: state.isMaintenance,
      isManager: state.isManager,
    }))
  );

  const statusOptions = useMemo(() => {
    if (isManager) {
      return requestStatuses;
    }
    return Object.fromEntries(
      Object.entries(requestStatuses).filter(([key]) => key !== 'approved')
    );
  }, [isManager]);

  const handleSubmit = () => {
    if (!status) {
      toast({
        title: 'Status is required',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(status, notes);
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
          <DialogTitle>Update Maintenance Status</DialogTitle>
          <DialogDescription>
            Change the current status of this maintenance task.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
              <span className="text-red-500">*</span>
            </Label>
            <Select onValueChange={(value) => setStatus(value)} value={status}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusOptions).map(([k, stats]) => (
                  <SelectItem key={k} value={k} style={{ color: stats.color }}>
                    {stats.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status-notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="status-notes"
              placeholder="Add any relevant notes about this status change..."
              className="col-span-3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequestStatus;
