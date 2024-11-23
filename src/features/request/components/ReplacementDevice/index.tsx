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
import { useDeviceStore } from '@/features/device/hooks';

type Props = {
  currentDevice: string;
  onClose: () => void;
  onSubmit: (user: string) => void;
};

const ReplacementDevice = ({ onClose, onSubmit, currentDevice }: Props) => {
  const { devices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
    }))
  );
  const [selectedDevice, setSelectedDevice] = useState('');

  const filteredDevice = useMemo(() => {
    return Object.values(devices).filter((device) => {
      if (device.id === currentDevice) {
        return false;
      }
      if (device.employeeId) {
        return false;
      }
      return true;
    });
  }, [devices, currentDevice]);

  const handleSubmit = () => {
    if (!selectedDevice) {
      toast({
        title: 'Device is required',
        variant: 'destructive',
      });
      return;
    }
    onSubmit(selectedDevice);
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
          <DialogTitle>Replacement Device</DialogTitle>
          <DialogDescription>
            Please select a device to replace the current device.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Device
              <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setSelectedDevice(value)}
              value={selectedDevice}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select device" />
              </SelectTrigger>
              <SelectContent>
                {filteredDevice.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplacementDevice;
