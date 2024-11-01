import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
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
import { useCatalogStore } from '@/features/catalog/hooks';
import { Device } from '@/features/device/type';
import { Request } from '@/features/request/type';
import { useUserStore } from '@/features/user/hooks';
import { priorities } from '@/lib/options';

import { useRequestStore } from '../../hooks';

type Props = {
  device: Device;
  request?: Request;
  onClose: () => void;
};

const RequestRepair = ({ device, onClose, request }: Props) => {
  const navigate = useNavigate();
  const { handling, createRequest, updateRequest } = useRequestStore(
    useShallow((state) => ({
      createRequest: state.createRequest,
      updateRequest: state.updateRequest,
      handling: state.handling,
    }))
  );

  const { requestTypes } = useCatalogStore(
    useShallow((state) => ({
      requestTypes: state.data.request.type,
    }))
  );

  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
    }))
  );

  const [editor, setEditor] = useState({
    description: '',
    priority: '',
    type: '',
  });

  const handleSubmit = async () => {
    if (!editor.type || !editor.description || !editor.priority) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    const dataUpdate: Partial<Request> = {
      ...request,
      ...editor,
      deviceId: device.id,
      creator: userInfo!.id,
      status: 'pending',
    };
    if (request) {
      updateRequest(request.id, dataUpdate);
      onClose();
    } else {
      const requestCreated = await createRequest(dataUpdate);
      if (requestCreated) {
        navigate(`/request/${requestCreated.id}`);
        onClose();
      }
    }
  };
  return (
    <>
      {handling ? <Waiting /> : null}
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
            <DialogTitle>Request Repair for {device?.name}</DialogTitle>
            <DialogDescription>
              Please provide details about the issue you're experiencing with
              this device.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urgency" className="text-right">
                Type
                <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(e) => setEditor({ ...editor, type: e })}
                value={editor.type}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(requestTypes).map(([k, type]) => (
                    <SelectItem key={k} value={k} style={{ color: type.color }}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issue" className="text-right">
                Description
                <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="issue"
                placeholder="Describe the problem in detail..."
                className="col-span-3"
                value={editor.description}
                onChange={(e) =>
                  setEditor({ ...editor, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urgency" className="text-right">
                Priority
                <span className="text-red-600">*</span>
              </Label>
              <Select
                onValueChange={(e) => setEditor({ ...editor, priority: e })}
                value={editor.priority}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorities).map(([k, priority]) => (
                    <SelectItem
                      key={k}
                      value={k}
                      style={{ color: priority.color }}
                    >
                      {priority.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Submit Repair Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestRepair;
