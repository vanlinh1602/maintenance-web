import { Edit, Plus } from 'lucide-react';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useCatalogStore } from '@/features/catalog/hooks';
import { useDeviceStore } from '@/features/device/hooks';
import {
  AddRequestNote,
  EditRequestStatus,
  ReplacementDevice,
  RequestAssign,
  ShecduledRequest,
} from '@/features/request/components';
import { useRequestStore } from '@/features/request/hooks';
import { useUserStore } from '@/features/user/hooks';
import { priorities, requestStatuses } from '@/lib/options';

export default function MaintenanceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { handling, requests, getRequest, updateRequest } = useRequestStore(
    useShallow((state) => ({
      handling: state.handling,
      requests: state.data,
      getRequest: state.getRequest,
      updateRequest: state.updateRequest,
    }))
  );

  const { devices, getDevices, updateDevice } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
      updateDevice: state.updateDevice,
    }))
  );

  const { requestType, deviceType, users } = useCatalogStore(
    useShallow((state) => ({
      requestType: state.data.request.type,
      deviceType: state.data.device.type,
      users: state.data.users,
    }))
  );

  const { userInfo, isMaintenance, isManager } = useUserStore(
    useShallow((state) => ({
      userInfo: state.info,
      isMaintenance: state.isMaintenance,
      isManager: state.isManager,
    }))
  );

  const request = useMemo(() => requests[id!] || {}, [requests, id]);
  const device = useMemo(
    () => devices[request.deviceId!] || {},
    [devices, request.deviceId]
  );

  useEffect(() => {
    if (id && !request?.id) {
      getRequest(id);
    }
    if (!Object.keys(devices).length) {
      getDevices();
    }
  }, [devices, request.id, getRequest, getDevices, id]);

  const [updateStatus, setUpdateStatus] = useState(false);
  const [assignTo, setAssignTo] = useState(false);
  const [addNote, setAddNote] = useState(false);
  const [shecduledDate, setShecduledDate] = useState(false);
  const [selectReplacement, setSelectReplacement] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {handling && <Waiting />}
      {updateStatus && (
        <EditRequestStatus
          onClose={() => setUpdateStatus(false)}
          onSubmit={(status, note) => {
            const notes = request.notes || [];
            notes.push({
              userId: userInfo!.id,
              message: `Change status to ${
                requestStatuses[status]?.name || status
              }${note ? `: ${note}` : ''}`,
              timestamp: moment().valueOf(),
            });
            updateRequest(request.id, { status, notes });
            setUpdateStatus(false);
          }}
        />
      )}
      {assignTo && (
        <RequestAssign
          onClose={() => setAssignTo(false)}
          onSubmit={(user) => {
            const notes = request.notes || [];
            notes.push({
              userId: userInfo!.id,
              message: `Assigned to ${users[user]?.name}`,
              timestamp: moment().valueOf(),
            });
            updateRequest(request.id, { assignedTo: user, notes });
            setAssignTo(false);
          }}
        />
      )}
      {addNote && (
        <AddRequestNote
          onClose={() => setAddNote(false)}
          onSubmit={(note) => {
            const notes = request.notes || [];
            notes.push({
              userId: userInfo!.id,
              message: note,
              timestamp: moment().valueOf(),
            });
            updateRequest(request.id, { notes });
            setAddNote(false);
          }}
        />
      )}
      {shecduledDate && (
        <ShecduledRequest
          onClose={() => setShecduledDate(false)}
          onSubmit={(date) => {
            const notes = request.notes || [];
            notes.push({
              userId: userInfo!.id,
              message: `Scheduled maintenance on ${moment(date).format(
                'MMMM DD, yyyy'
              )}`,
              timestamp: moment().valueOf(),
            });
            updateRequest(request.id, { scheduledDate: date, notes });
            setShecduledDate(false);
          }}
        />
      )}
      {selectReplacement && (
        <ReplacementDevice
          currentDevice={id!}
          onClose={() => setSelectReplacement(false)}
          onSubmit={(deviceId) => {
            const notes = request.notes || [];
            notes.push({
              userId: userInfo!.id,
              message: `Replaced with ${devices[deviceId]?.name || deviceId}`,
              timestamp: moment().valueOf(),
            });
            updateRequest(request.id, { replacementDeviceId: deviceId, notes });
            updateDevice(deviceId, { employeeId: device.employeeId });
            setSelectReplacement(false);
          }}
        />
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Button
            className="text-3xl font-bold p-0"
            variant="link"
            onClick={() => navigate(`/device/${device.id}`)}
          >
            {device.name}
          </Button>
          <p className="text-xl text-muted-foreground">
            {deviceType[device.type]?.name}
          </p>
        </div>
        <Badge
          style={{ backgroundColor: requestType[request.type]?.color }}
          className="text-lg py-1 px-3"
        >
          {requestType[request.type]?.name}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Create Date</Label>
                <p>{moment(request.createdAt).format('MMMM DD, yyyy')}</p>
              </div>
              <div>
                <Label>Creator</Label>
                <p>{users[request.creator]?.name || request.creator}</p>
              </div>
              <div>
                <Label>Priority</Label>
                <p style={{ color: priorities[request.priority]?.color }}>
                  {priorities[request.priority]?.name}
                </p>
              </div>
              <div>
                <Label>Assign To</Label>
                <p>{users[request.assignedTo || '']?.name}</p>
              </div>
              <div>
                <Label>Shecduled Date</Label>
                <p>
                  {request.scheduledDate
                    ? moment(request.scheduledDate).format('MMMM DD, yyyy')
                    : 'Not scheduled'}
                </p>
              </div>
              <div>
                <Label>Status</Label>
                <p style={{ color: requestStatuses[request.status]?.color }}>
                  {requestStatuses[request.status]?.name}
                </p>
              </div>
              <div>
                <Label className="flex">
                  Replacement Device
                  <Edit
                    onClick={() => setSelectReplacement(true)}
                    className="h-4 w-4 ml-2"
                  />
                </Label>
                <Button
                  variant="link"
                  className="p-0 m-0"
                  onClick={() =>
                    navigate(`/device/${request.replacementDeviceId}`)
                  }
                >
                  {devices[request.replacementDeviceId || '']?.name ||
                    request.replacementDeviceId}
                </Button>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <p>{request.description}</p>
            </div>
            <div className="space-x-2">
              {(isMaintenance && request.status !== 'pending') || isManager ? (
                <Button onClick={() => setUpdateStatus(true)}>
                  Update Status
                </Button>
              ) : null}
              {isManager && (
                <Button onClick={() => setAssignTo(true)} variant="secondary">
                  Assign To
                </Button>
              )}
              {isMaintenance && request.status !== 'pending' && (
                <Button
                  onClick={() => setShecduledDate(true)}
                  variant="secondary"
                >
                  Schedule
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              Request Notes
              <Button
                variant="outline"
                onClick={() => setAddNote(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {request.notes?.map((note, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">
                      {users[note.userId]?.name || note.userId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {moment(request.createdAt).format('MMMM DD, yyyy')}
                    </p>
                  </div>
                  <p className="mt-2">{note.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
