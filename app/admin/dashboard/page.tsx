'use client';

import { useEffect, useState } from "react";
import { api2 } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Calendar, 
    TrendingUp, 
    Users, 
    AlertCircle,
    Activity,
    FileText
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const response = await api2.get("/analytics");
            setData(response.data);
        } catch (error: any) {
            setError(error?.response?.data?.message || "Failed to load analytics");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-12 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-96" />
                    ))}
                </div>
            </div>
        );
    }

    const { appointments, diagnoses } = data;

    // Prepare data for charts
    const statusData = appointments.statusBreakdown.breakdown.map((item: any) => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
        percentage: item.percentage
    }));

    const diagnosisData = diagnoses.distribution.map((item: any) => ({
        name: item.diagnosis,
        value: item.count,
        percentage: item.percentage
    }));

    const last7DaysData = appointments.last7Days.map((item: any) => ({
        date: item.period,
        count: item.count
    }));

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your clinic's performance and statistics
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Appointments
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {appointments.statusBreakdown.total}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avg. Appointments/Day
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {appointments.averagePerDay.average}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Last {appointments.averagePerDay.lookbackDays} days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            No-Show Rate
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {appointments.noShowRate.noShowRate}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {appointments.noShowRate.noShows} of {appointments.noShowRate.totalAppointments} appointments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Diagnoses
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {diagnoses.total}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Unique medical records
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Appointment Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Status Distribution</CardTitle>
                        <CardDescription>
                            Breakdown of all appointment statuses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Diagnoses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Diagnoses</CardTitle>
                        <CardDescription>
                            Most common diagnoses (Top {diagnoses.topCount})
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={diagnosisData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.name}: ${entry.percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {diagnosisData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Last 7 Days Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Appointments - Last 7 Days</CardTitle>
                    <CardDescription>
                        Daily appointment volume for the past week
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={last7DaysData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#0088FE" name="Appointments" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Status Breakdown Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Status Breakdown</CardTitle>
                    <CardDescription>
                        Complete overview of appointment statuses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {appointments.statusBreakdown.breakdown.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-4 h-4 rounded-full" 
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-medium capitalize">{item.status}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-muted-foreground">{item.count} appointments</span>
                                    <span className="font-semibold">{item.percentage}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}