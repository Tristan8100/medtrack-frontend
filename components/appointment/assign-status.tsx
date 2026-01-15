'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { api2 } from '@/lib/api';

export interface Appointment {
  _id: string;
  patientId: UserAppoint;
  staffId: UserAppoint | null;
  date: Date;
  status: string;
  chiefComplaint: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserAppoint {
  _id: string;
  name: string;
}

export interface StatusDialogProps {
  appointment: Appointment;
  role: 'patient' | 'staff' | 'admin';
  onUpdated?: () => void;
}

const STATUS_OPTIONS = ['pending', 'scheduled', 'completed', 'cancelled', 'no-show', 'declined', 'late'];

export default function AppointmentModal({ appointment, role, onUpdated }: StatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError('');

      await api2.patch(`/appointments/${appointment._id}`, { status });
      setOpen(false);
      onUpdated?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Determine allowed statuses based on role
  const allowedStatuses = role === 'patient'
    ? ['cancelled'] // patient can only cancel
    : STATUS_OPTIONS.filter(s => s !== 'cancelled'); // staff/admin cannot cancel

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] space-y-4">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p><strong>Patient:</strong> {appointment.patientId.name}</p>
          <p><strong>Appointment Date:</strong> {new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            }).format(new Date(appointment.date))}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
          <p><strong>Chief Complaint:</strong> {appointment.chiefComplaint}</p>
          <p><strong>Notes:</strong> {appointment.notes || 'N/A'}</p>
          <p><strong>Created At:</strong> {new Date(appointment.created_at).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(appointment.updated_at).toLocaleString()}</p>
        </div>

        {/* Status Selector */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {allowedStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
