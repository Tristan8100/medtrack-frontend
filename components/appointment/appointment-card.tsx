import DialogCreateMedicalRecord from "../medical-records/create-medical-record";
import { Card } from "../ui/card";
import { Appointment } from "./all-appointments";
import AppointmentModal from "./assign-status";

export default function AppointmentCard({
  appointment,
  role,
  fetchAppointments,
}: {
  appointment: Appointment;
  role: "patient" | "staff" | "admin";
  fetchAppointments: () => void;
}) {
  return (
    <Card className="px-3 py-2">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">

        {/* Patient + ID */}
        <div className="flex flex-col min-w-[140px] flex-shrink-0">
          <span className="font-medium truncate">{appointment.patientId.name}</span>
          <span className="text-[10px] text-muted-foreground truncate">
            {appointment._id}
          </span>
        </div>

        {/* Staff */}
        <div className="hidden md:flex flex-col min-w-[120px] flex-shrink-0">
          <span className="text-sm truncate">{appointment.staffId?.name ?? "—"}</span>
        </div>

        {/* Date */}
        <div className="flex flex-col min-w-[120px] flex-shrink-0">
          <span className="text-sm truncate">
            {new Intl.DateTimeFormat("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(new Date(appointment.date))}
          </span>
        </div>

        {/* Complaint */}
        <div className="flex-1 min-w-[100px] text-sm truncate">
          {appointment.chiefComplaint}
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : appointment.status === "completed"
                ? "bg-green-100 text-green-700"
                : appointment.status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {appointment.status}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          {role !== "patient" && (
            <DialogCreateMedicalRecord
              patientId={appointment.patientId._id}
              appointmentId={appointment._id}
              onSuccess={fetchAppointments}
            />
          )}
          <AppointmentModal
            appointment={appointment}
            role={role}
            onUpdated={fetchAppointments}
          />
        </div>

      </div>
    </Card>
  );
}