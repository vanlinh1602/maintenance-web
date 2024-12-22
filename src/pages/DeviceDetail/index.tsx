import { format } from 'date-fns';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import { Device } from '@/features/device/type';
import { RequestRepair } from '@/features/request/components';
import { useRequestStore } from '@/features/request/hooks';
import { useUserStore } from '@/features/user/hooks';
import { deviceStatuses, requestStatuses } from '@/lib/options';

export default function DeviceDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { devices, getFilterDevice, updateDevice, handling } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      handling: state.handling,
      getFilterDevice: state.getFilterDevice,
      updateDevice: state.updateDevice,
    }))
  );

  const { requests, getRequestByFilter } = useRequestStore(
    useShallow((state) => ({
      getRequestByFilter: state.getRequestByFilter,
      requests: state.data,
    }))
  );

  const { users, rooms, deviceTypes, requestTypes } = useCatalogStore(
    useShallow((state) => ({
      rooms: state.data.rooms,
      users: state.data.users,
      deviceTypes: state.data.device.type,
      requestTypes: state.data.request.type,
    }))
  );

  const device: Device = useMemo(() => devices[id || ''] || {}, [devices, id]);
  const deviceRequests = useMemo(
    () => Object.values(requests).filter(({ deviceId }) => deviceId === id),
    [requests, id]
  );

  const { isMaintenance, isManager } = useUserStore(
    useShallow((state) => ({
      isManager: state.isManager,
      isMaintenance: state.isMaintenance,
    }))
  );

  useEffect(() => {
    if (!device.id) {
      getFilterDevice({ id });
    }
    getRequestByFilter({ deviceId: id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [createRequest, setCreateRequest] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {handling ? <Waiting /> : null}
      {createRequest && (
        <RequestRepair
          device={device}
          onClose={() => setCreateRequest(false)}
        />
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{device.name}</h1>
          <p className="text-xl text-muted-foreground">
            {deviceTypes[device.type]?.name}
          </p>
        </div>
        <Badge
          className="text-xs py-1 px-3"
          style={{
            backgroundColor: deviceStatuses[device.status]?.color,
          }}
        >
          {deviceStatuses[device.status]?.name}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div>Device Details</div>
              <div className="space-x-2">
                {isMaintenance || isManager ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (!device.employeeId) {
                        toast({
                          title: 'Device is not assigned to anyone',
                        });
                        return;
                      }
                      updateDevice(device.id, {
                        employeeId: '',
                      }).then(() => {
                        toast({
                          title: 'Device recall successfully',
                        });
                      });
                    }}
                  >
                    Device recall
                  </Button>
                ) : null}
                <Button onClick={() => setCreateRequest(true)}>
                  Create Request
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Model</Label>
                <p>{deviceTypes[device.type]?.name}</p>
              </div>
              <div>
                <Label>Serial Number</Label>
                <p>{device.serial}</p>
              </div>
              <div>
                <Label>Purchase Date</Label>
                <p>
                  {device.purchaseDate
                    ? format(new Date(device.purchaseDate), 'dd/LL/y')
                    : null}
                </p>
              </div>
              <div>
                <Label>Location</Label>
                <p>{rooms[device.roomId || '']?.name}</p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p>{users[device.employeeId || '']?.name}</p>
              </div>
              <div>
                <Label>Assign Date</Label>
                <p>
                  {device.assignedDate
                    ? format(new Date(device.assignedDate), 'dd/LL/y')
                    : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex space-x-3 justify-between">
              <div>
                <div>
                  <Label>Warranty ExpireDate</Label>
                  <p>
                    {device.warrantyExpireDate
                      ? format(new Date(device.warrantyExpireDate), 'dd/LL/y')
                      : null}
                  </p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p>{device.description}</p>
                </div>
              </div>
              <img
                src={device.image}
                alt={device.name}
                className="w-80 object-cover rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceRequests.map((request, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {requestTypes[request.type]?.name || request.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {moment(request.createdAt).format('ll')}
                      </p>
                    </div>
                    <Badge
                      style={{
                        backgroundColor: requestStatuses[request.status]?.color,
                      }}
                    >
                      {requestStatuses[request.status]?.name}
                    </Badge>
                  </div>
                  <p className="mt-2">{request.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
