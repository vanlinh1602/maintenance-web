import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
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
import { deviceStatuses } from '@/lib/options';
import { convertImgaesToBase64 } from '@/lib/utils';

import { useDeviceStore } from '../../hooks';
import { Device } from '../../type';

type Props = {
  device: Partial<Device>;
  onClose: () => void;
};

const DeviceEditor = ({ device, onClose }: Props) => {
  const { createDevice, updateDevice } = useDeviceStore(
    useShallow((state) => ({
      createDevice: state.createDevice,
      updateDevice: state.updateDevice,
    }))
  );

  const { users, rooms, types } = useCatalogStore(
    useShallow((state) => ({
      rooms: state.data.rooms,
      users: state.data.users,
      types: state.data.device.type,
    }))
  );

  const [handling, setHandling] = useState(false);
  const [editor, setEditor] = useState<Partial<Device>>(device);
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [assignedDate, setAssignedDate] = useState<Date>();
  const [warrantyExpireDate, setWarrantyExpireDate] = useState<Date>();

  useEffect(() => {
    if (device.purchaseDate) {
      setPurchaseDate(new Date(device.purchaseDate));
    }
    if (device.assignedDate) {
      setAssignedDate(new Date(device.assignedDate));
    }
    if (device.warrantyExpireDate) {
      setWarrantyExpireDate(new Date(device.warrantyExpireDate));
    }
  }, [device]);

  const validate = useCallback((data: Partial<Device>) => {
    if (!data.name) {
      toast({
        title: 'Error',
        description: 'Name is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!data.serial) {
      toast({
        title: 'Error',
        description: 'Serial is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!data.purchaseDate) {
      toast({
        title: 'Error',
        description: 'Purchase date is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!data.warrantyExpireDate) {
      toast({
        title: 'Error',
        description: 'Warranty expire date is required',
        variant: 'destructive',
      });
      return false;
    } else {
      if (data.warrantyExpireDate < data.purchaseDate) {
        toast({
          title: 'Error',
          description:
            'Warranty expire date must be greater than purchase date',
          variant: 'destructive',
        });
        return false;
      }
    }

    if (data.assignedDate && data.assignedDate < data.purchaseDate) {
      toast({
        title: 'Error',
        description: 'Assigned date must be greater than purchase date',
        variant: 'destructive',
      });
      return false;
    }

    if (!data.status) {
      toast({
        title: 'Error',
        description: 'Status is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!data.type) {
      toast({
        title: 'Error',
        description: 'Type is required',
        variant: 'destructive',
      });
      return;
    }
    return true;
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setHandling(true);
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      const base64 = await convertImgaesToBase64(file);
      setEditor({ ...editor, image: base64 });
    } finally {
      setHandling(false);
    }
  };

  const handleSave = () => {
    const data: Partial<Device> = {
      ...editor,
      purchaseDate: purchaseDate?.getTime(),
      assignedDate: assignedDate?.getTime(),
      warrantyExpireDate: warrantyExpireDate?.getTime(),
    };
    if (!validate(data)) {
      return;
    }
    if (device.id) {
      updateDevice(device.id, data);
    } else {
      createDevice(data);
    }
    onClose();
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
      {handling ? <Waiting /> : null}
      <DialogContent className="w-[800px] container max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {device.id ? `Edit ${device.name}` : 'Create new device'}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the device here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 grid-cols-2 py-4">
          <div className="flex flex-row gap-4 col-span-2">
            <div>
              <div className="items-center gap-4 ">
                <Label htmlFor="image" className="text-right"></Label>
                {editor.image ? (
                  <div className="w-52 h-52">
                    <div className="absolute left-52 text-destructive h-6 w-6 cursor-pointer bg-white rounded-lg">
                      <X onClick={() => setEditor({ ...editor, image: '' })} />
                    </div>
                    <img
                      src={editor.image}
                      alt="device"
                      className="w-52 h-52 object-cover"
                    />
                  </div>
                ) : (
                  <Input
                    type="file"
                    id="image"
                    className="w-52 h-52 justify-center text-cente items-center"
                    placeholder="Upload image"
                    content="Upload image"
                    accept="image/*"
                    multiple={false}
                    onChange={handleUploadImage}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 w-full">
              <div className="items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  value={editor.name}
                  onChange={(e) =>
                    setEditor({ ...editor, name: e.target.value })
                  }
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Serial
                  <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="serial"
                  value={editor.serial}
                  onChange={(e) =>
                    setEditor({ ...editor, serial: e.target.value })
                  }
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                  <span className="text-red-600">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditor({ ...editor, type: value })
                  }
                  value={editor.type}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(types).map(([typeKey, type]) => (
                      <SelectItem key={typeKey} value={typeKey}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="col-span-2  items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              value={editor.description}
              onChange={(e) =>
                setEditor({ ...editor, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maintenance-date" className="text-right">
              Purchase Date
              <span className="text-red-600">*</span>
            </Label>
            <Input
              className="col-span-3"
              type="date"
              value={purchaseDate?.toISOString().split('T')[0]}
              onChange={(e) => {
                setPurchaseDate(new Date(e.target.value));
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warranty-expire-date" className="text-right">
              Warranty Expire Date
              <span className="text-red-600">*</span>
            </Label>
            <Input
              className="col-span-3"
              type="date"
              value={warrantyExpireDate?.toISOString().split('T')[0]}
              onChange={(e) => {
                setWarrantyExpireDate(new Date(e.target.value));
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assigned-date" className="text-right">
              Assigned Date
            </Label>
            <Input
              className="col-span-3"
              type="date"
              value={assignedDate?.toISOString().split('T')[0]}
              onChange={(e) => {
                setAssignedDate(new Date(e.target.value));
              }}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
              <span className="text-red-600">*</span>
            </Label>
            <Select
              onValueChange={(value) => setEditor({ ...editor, status: value })}
              value={editor.status}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(deviceStatuses).map(([statusKey, status]) => (
                  <SelectItem key={statusKey} value={statusKey}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              Room
            </Label>
            <Select
              onValueChange={(value) => setEditor({ ...editor, roomId: value })}
              value={editor.roomId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(rooms).map(([roomKey, room]) => (
                  <SelectItem key={roomKey} value={roomKey}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee" className="text-right">
              User
            </Label>
            <Select
              onValueChange={(value) =>
                setEditor({ ...editor, employeeId: value })
              }
              value={editor.employeeId}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(users).map(([userKey, user]) => (
                  <SelectItem key={userKey} value={userKey}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceEditor;
