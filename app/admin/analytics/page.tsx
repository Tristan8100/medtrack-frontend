'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";

export default function AnalyticsPage() {
    const [data, setData] = useState("");
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
            const response = await api2.get("/analytics");
            setData(response.data);
        } catch (error : any) {
            setError(error?.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        console.log(data);
    }, [data])

    if (error) {
        return (
            <h1>{error}</h1>
        )
    }

    if (!data) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <>
            <h1>Analytics</h1>
        </>
    );
}