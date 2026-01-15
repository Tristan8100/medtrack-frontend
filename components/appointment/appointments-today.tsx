'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AppointmentCard from "@/components/appointment/appointment-card";

export interface Appointment {
  _id: string;
  patientId: Patient;
  staffId: string | null;
  date: Date;
  status: string;
  chiefComplaint: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

export interface Patient {
  _id: string;
  name: string;
}

interface roleBasedProps {
  role: "patient" | "staff" | "admin";
}

export default function TodayAppointmentsPage({ role }: roleBasedProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const limit = 10;

  // today YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const fetchAppointments = async () => {
    try {
      const endpoint = role === 'patient' ? '/appointments/my-appointments' : '/appointments'; // Role Checking, One Component
      const response = await api2.get(endpoint, {
        params: {
          page,
          startDate: today,
          endDate: today,
        },
      });

      const data = response.data.data;
      setAppointments(data);
      setHasNextPage(data.length === limit);
    } catch (error) {
      console.error('Error fetching today appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [page]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">Today’s Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Appointments scheduled for today
        </p>
      </div>

      {/* Appointments */}
      <div className="grid gap-4">
        {appointments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No appointments for today.
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
