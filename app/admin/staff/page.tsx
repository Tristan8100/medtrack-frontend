'use client';

import ForbiddenPage from "@/components/errors/403-staff-error";
import UsersPage from "@/components/users/userRoles";
import { api2 } from "@/lib/api";
import { useEffect, useState } from "react";

export default function StaffPage() {
    const [data, setData] = useState("");
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api2.get("/api/verify-admin");
            setData(response.data.data.data);
        } catch (error : any) {
            if (error?.response?.status === 403) {
                setError(true);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return (
            <ForbiddenPage />
        )
    }

    return (
        <>
            <UsersPage searchRole="staff" title="Staff" description="Manage all staffs" />
        </>
    );
}