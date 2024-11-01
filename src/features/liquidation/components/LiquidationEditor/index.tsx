import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { SearchableSelect } from '@/components';
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
import { useDeviceStore } from '@/features/device/hooks';
import { Liquidation } from '@/features/liquidation/type';
import { useUserStore } from '@/features/user/hooks';

import { useLiquidationStore } from '../../hooks';

type Props = {
  liquidation?: Liquidation;
  onClose: () => void;
};

const LiquidationEditor = ({ onClose, liquidation }: Props) => {
  const { userInfo } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
    }))
  );

  const { createLiquidation, updateLiquidation } = useLiquidationStore(
    useShallow((state) => ({
      createLiquidation: state.createLiquidation,
      updateLiquidation: state.updateLiquidation,
    }))
  );

  const { devices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
    }))
  );

  const [editor, setEditor] = useState<Partial<Liquidation>>({
    deviceId: liquidation?.deviceId || '',
    reason: liquidation?.reason || '',
  });

  const handleSubmit = async () => {
    if (!editor.deviceId || !editor.reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    const dataUpdate: Partial<Liquidation> = {
      ...liquidation,
      ...editor,
    };

    if (!liquidation?.id) {
      dataUpdate.status = 'pending';
      dataUpdate.requestBy = userInfo?.id;
    }

    if (liquidation) {
      updateLiquidation(liquidation.id, dataUpdate);
    } else {
      await createLiquidation(dataUpdate);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {liquidation ? 'Edit Liquidation' : 'Create Liquidation'}
          </DialogTitle>
          <DialogDescription>
            Enter the details of the device you want to liquidate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="device-name" className="text-right">
              Device
              <span className="text-red-500">*</span>
            </Label>
            <SearchableSelect
              disabled={!!liquidation}
              className="w-full col-span-3"
              options={Object.values(devices).map((device) => ({
                label: device.name,
                value: device.id.toString(),
              }))}
              value={editor.deviceId}
              onSelect={(value) =>
                setEditor({ ...editor, deviceId: value.toString() })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              className="col-span-3"
              value={editor.reason}
              onChange={(e) => setEditor({ ...editor, reason: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LiquidationEditor;
