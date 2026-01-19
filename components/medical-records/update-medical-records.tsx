'use client';

import { useState } from 'react';
import { api2 } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { MedicalRecord } from './all-medical-records';
import { toast } from 'sonner';

interface Props {
  record: MedicalRecord;
  onUpdated: () => void;
}

export default function UpdateMedicalRecord({ record, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    visitDate: record.visitDate.slice(0, 10),
    chiefComplaint: record.chiefComplaint,
    diagnosis: record.diagnosis ?? '',
    notes: record.notes ?? '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    console.log(form.visitDate);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await api2.put(`/medical-records/${record._id}`, form);

      setOpen(false);
      onUpdated(); //parent refresh
    } catch (err : any) {
      console.error('Failed to update medical record', err);
      //setError(err.message || 'Failed to update medical record');
      toast.error(err.response?.data?.message || 'Failed to update medical record');
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async () => {
    try {
      setLoading(true);
      await api2.delete(`/medical-records/${record._id}`);
      setOpen(false);
      onUpdated(); //parent refresh
    } catch (err : any) {
      console.error('Failed to delete medical record', err);
      toast.error(err.response?.data?.message || 'Failed to delete medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View / Edit</Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Medical Record</DialogTitle>
        </DialogHeader>

        {/* READ-ONLY INFO */}
        <div className="space-y-1 text-sm">
          <p><strong>Patient:</strong> {record.patientId.name}</p>
          <p><strong>Staff:</strong> {record.staffCreatedId.name}</p>
          <p><strong>Created:</strong> {new Date(record.created_at).toLocaleString()}</p>
        </div>

        {/* EDITABLE FIELDS */}
        <div className="space-y-3 mt-4">
          <Input
            type="date"
            name="visitDate"
            value={form.visitDate}
            onChange={handleChange}
          />

          <Input
            name="chiefComplaint"
            placeholder="Chief complaint"
            value={form.chiefComplaint}
            onChange={handleChange}
          />

          <Input
            name="diagnosis"
            placeholder="Diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
          />

          <Textarea
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        {/* VITAL SIGNS (READ ONLY FOR NOW) */}
        {record.vitalSigns && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <p>BP: {record.vitalSigns.bloodPressure ?? 'N/A'}</p>
            <p>HR: {record.vitalSigns.heartRate ?? 'N/A'}</p>
            <p>Temp: {record.vitalSigns.temperature ?? 'N/A'}</p>
            <p>Resp: {record.vitalSigns.respiratoryRate ?? 'N/A'}</p>
            <p>O2 Sat: {record.vitalSigns.oxygenSaturation ?? 'N/A'}</p>
            <p>BMI: {record.vitalSigns.bmi ?? 'N/A'}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={deleteRecord}
            variant="destructive"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Record'}
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
