'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DialogCreate from "@/components/appointment/create-appointment";
import AppointmentCard from "./appointment-card";

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

export interface roleBasedProps {
  role: "patient" | "staff" | "admin";
  id?: string;
}

export default function AllAppointmentsPage({ role, id }: roleBasedProps) {
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');


  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  //const limit = 10; // same sa backend limit
  //const [limit, setLimit] = useState(10);

  const fetchAppointments = async () => {
    try {
      let endpoint = role === 'patient' ? '/appointments/my-appointments' : '/appointments'; // Role Checking, One Component
      if (id) {
        endpoint = '/appointments/user-appointments/' + id;
      }
      const response = await api2.get(endpoint, {
        params: {
          page,
          search: search || undefined,
          status: status === 'None' ? undefined : status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      const data = response.data.data.data; //1 data: actual response obj, 2 data: placeholder on ResponseType, 3 data: actual data
      setAppointments(data);
      setHasNextPage(response.data.data.nextPage); //if returned data is full, assume there is a next page
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [status, startDate, endDate, page]);

  // debouncer on search
  const debounceSearch = () => {
    const delay = setTimeout(() => {
      fetchAppointments();
    }, 500);
    return () => clearTimeout(delay);
  };

  // Reset
  useEffect(() => {
    setPage(1);
  }, [search, status, startDate, endDate]);

  if(!appointments){
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 flex items-center justify-center md:block mt-4 md:mt-0">
        <h1 className="text-3xl font-semibold">{role === "patient" ? "My" : "All"} Appointments</h1> {/* Role Checking, One Component */}
        <p className="text-sm text-muted-foreground mb-4">
          Manage and review all appointments
        </p>
        {role === "patient" && <DialogCreate onSuccess={() => fetchAppointments()} />} {/* Role Checking, One Component */}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search complaint / notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onInput={debounceSearch}
          />

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no-show">No Show</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="late">Late</SelectItem>
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
          <AppointmentCard key={appointment._id} appointment={appointment} role={role} fetchAppointments={fetchAppointments} />
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
