import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

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
import { liquidationStautses } from '@/lib/options';

import { useLiquidationStore } from '../../hooks';
import { Liquidation } from '../../type';

type Props = {
  liquidation: Liquidation;
  onClose: () => void;
};

const EditLiquidationStatus = ({ onClose, liquidation }: Props) => {
  const { updateLiquidation } = useLiquidationStore(
    useShallow((state) => ({
      updateLiquidation: state.updateLiquidation,
    }))
  );

  const [targetStatus, setTargetStatus] = useState(liquidation.status);

  const handleSubmit = async () => {
    if (targetStatus === liquidation.status) {
      onClose();
      return;
    }
    const dataUpdate = cloneDeep(liquidation);
    dataUpdate.status = targetStatus;
    await updateLiquidation(dataUpdate.id, dataUpdate);
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
          <DialogTitle>Edit Liquidation Status</DialogTitle>
          <DialogDescription>
            Please select the status of this liquidation request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="device-name" className="text-right">
              Status
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={targetStatus}
              onValueChange={(value) => setTargetStatus(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(liquidationStautses).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

export default EditLiquidationStatus;
