'use client';

import { useEffect, useState, useRef } from "react";
import { api2 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UpdateMedicalRecord from "./update-medical-records";

export interface MedicalRecord {
  _id: string;
  patientId: UserRecord;
  appointmentId: AppointmentRecord | null;
  staffCreatedId: UserRecord;
  visitDate: string; // use string for API compatibility
  chiefComplaint: string;
  notes: string | null;
  diagnosis: string | null;
  vitalSigns: VitalSigns | null;
  created_at: string;
  updated_at: string;
}

export interface UserRecord {
  _id: string;
  name: string;
  email: string;
}

export interface AppointmentRecord {
  _id: string;
  date: string;
  status: string;
}

export interface VitalSigns {
  bloodPressure: string | null;
  heartRate: number | null;
  temperature: number | null;
  respiratoryRate: number | null;
  oxygenSaturation: number | null;
  weight: number | null;
  height: number | null;
  bmi: number | null;
}

export interface RoleBasedProps {
  role: "patient" | "staff" | "admin";
  id?: string;
}

export default function AllMedicalRecordsPage({ role, id }: RoleBasedProps) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[] | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchMedicalRecords = async () => {
    try {
      setError('');
      let endpoint = role === 'patient' ? '/medical-records/my-records' : '/medical-records';
      if (id) endpoint = `/medical-records/user-records/${id}`;

      const response = await api2.get(endpoint, {
        params: {
          page,
          search,
          startDate,
          endDate,
        },
      });

      const data = response.data.data.data;
      setMedicalRecords(data);
      setHasNextPage(response.data.data.nextPage !== null);
    } catch (err: any) {
      console.error('Error fetching medical records:', err);
      setError('Failed to fetch medical records. Please try again.');
    }
  };

  // Debounced search / filter effect
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchMedicalRecords();
    }, 500);
  };



  // Fetch whenever filters or page changes
  useEffect(() => {
    fetchMedicalRecords();
  }, [page, search, startDate, endDate]);

  const resetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  if (!medicalRecords) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 flex items-center justify-center md:block mt-4 md:mt-0">
        <h1 className="text-3xl font-semibold">
          {role === "patient" ? "My" : "All"} Medical Records
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage medical records
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search complaint / notes / diagnosis"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
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
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {/* Medical Records */}
      <div className="grid gap-4">
        {medicalRecords.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No medical records found.
          </p>
        )}

        {medicalRecords.map((record) => (
          <Card key={record._id} className="p-4">
            <p><strong>Patient:</strong> {record.patientId.name}</p>
            <p><strong>Visit Date:</strong> {new Date(record.visitDate).toLocaleDateString()}</p>
            <p><strong>Chief Complaint:</strong> {record.chiefComplaint}</p>
            <p><strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}</p>
            <p><strong>Staff:</strong> {record.staffCreatedId.name}</p>

            {record.vitalSigns && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <p>BP: {record.vitalSigns.bloodPressure || 'N/A'}</p>
                <p>HR: {record.vitalSigns.heartRate || 'N/A'}</p>
                <p>Temp: {record.vitalSigns.temperature || 'N/A'}</p>
                <p>Resp: {record.vitalSigns.respiratoryRate || 'N/A'}</p>
                <p>O2 Sat: {record.vitalSigns.oxygenSaturation || 'N/A'}</p>
                <p>Weight: {record.vitalSigns.weight || 'N/A'}</p>
                <p>Height: {record.vitalSigns.height || 'N/A'}</p>
                <p>BMI: {record.vitalSigns.bmi || 'N/A'}</p>
              </div>
            )}

            {(role === 'staff' || role === 'admin') && (
              <UpdateMedicalRecord
                record={record}
                onUpdated={fetchMedicalRecords}
              />
            )}
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
