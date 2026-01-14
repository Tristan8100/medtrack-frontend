'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface Appointment {
  _id: string;
  patientId: string;
  staffId: string | null;
  date: Date;
  status: string;
  chiefComplaint: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // UI filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination state
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 10; // same as backend limit

  const fetchAppointments = async () => {
    try {
      const response = await api2.get('/appointments', {
        params: {
          page,
          search: search || undefined,
          status: status === 'None' ? undefined : status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      const data = response.data.data;
      setAppointments(data);
      setHasNextPage(data.length === limit); // if returned data is full, assume there is a next page
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch appointments when filters or page change
  useEffect(() => {
    fetchAppointments();
  }, [search, status, startDate, endDate, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, startDate, endDate]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Manage and review all appointments
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search complaint / notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              setStatus('');
              setStartDate('');
              setEndDate('');
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Appointments */}
      <div className="grid gap-4">
        {appointments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No appointments found.
          </p>
        )}

        {appointments.map((appointment) => (
          <Card key={appointment._id} className="p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Appointment ID</p>
                <p className="font-mono text-xs">{appointment._id}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : appointment.status === 'approved'
                    ? 'bg-blue-100 text-blue-700'
                    : appointment.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {appointment.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><span className="font-medium">Patient:</span> {appointment.patientId}</p>
              <p><span className="font-medium">Staff:</span> {appointment.staffId ?? '—'}</p>

              <p>
                <span className="font-medium">Date:</span>{' '}
                {new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(new Date(appointment.date))}
              </p>

              <p>
                <span className="font-medium">Created:</span>{' '}
                {new Intl.DateTimeFormat('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(appointment.created_at))}
              </p>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm">
                <span className="font-medium">Chief Complaint:</span>{' '}
                {appointment.chiefComplaint}
              </p>
              <p className="text-sm text-muted-foreground">{appointment.notes}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>

        <span>Page {page}</span>

        <Button
          disabled={!hasNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
