import DialogCreateMedicalRecord from "../medical-records/create-medical-record";
import { Card } from "../ui/card";
import { Appointment } from "./all-appointments";
import AppointmentModal from "./assign-status";

export default function AppointmentCard({ appointment, role, fetchAppointments }: { 
  appointment: Appointment;
  role: "patient" | "staff" | "admin";
  fetchAppointments: () => void;
}) {
  return (
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
              : appointment.status === 'cancelled'
              ? 'bg-red-100 text-red-700'
              : appointment.status === 'no-show'
              ? 'bg-orange-100 text-orange-700'
              : appointment.status === 'declined'
              ? 'bg-red-100 text-red-700'
              : appointment.status === 'scheduled'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
              
          }`}
        >
          {appointment.status.toUpperCase()}
          <div className="text-red-700">
            {appointment.status === 'pending' && new Date(appointment.date) <= new Date() && '(Expired)'}
            {appointment.status === 'scheduled' && new Date(appointment.date) <= new Date() && 'Missing Status'}
          </div>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <p><span className="font-medium">Patient:</span> {appointment.patientId.name}</p>
        <p><span className="font-medium">Patient Id:</span> {appointment.patientId._id}</p>
        <p><span className="font-medium">Staff:</span> {appointment.staffId?.name ?? '—'}</p>{/* always checkk if exist if implement delete */}

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
          <span className="font-medium">Chief Complaint:</span> {appointment.chiefComplaint}
        </p>
        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
      </div>
      {/* Modal */}
      {role !== 'patient' && <DialogCreateMedicalRecord patientId={appointment.patientId._id} appointmentId={appointment._id} onSuccess={() => fetchAppointments()} /> }

      {/* Modal */}
      <AppointmentModal
        appointment={appointment}
        role={role}
        onUpdated={() => fetchAppointments()} // bubbles to parent
      />
    </Card>
  );
}
