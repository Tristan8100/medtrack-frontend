import UsersPage from "@/components/users/userRoles";
import { Users } from "lucide-react";

export default function PatientsPage() {
  return (
    <>
      <UsersPage searchRole="patient" title="Patients" description="Manage all patients" />
    </>
  );
}