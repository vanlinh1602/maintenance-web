import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';

type Props = {
  onClose: () => void;
  onSubmit: (notes: string) => void;
};

const AddRequestNote = ({ onClose, onSubmit }: Props) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!notes) {
      toast({
        title: 'Note is required',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(notes);
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
          <DialogTitle>Add note</DialogTitle>
          <DialogDescription>
            Add a note to this maintenance task.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status-notes" className="text-right">
              Notes
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="status-notes"
              placeholder="Add a note"
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

export default AddRequestNote;
