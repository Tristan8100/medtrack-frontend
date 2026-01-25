'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Staff {
  _id: string;
  name: string;
  email?: string;
}

interface Appointment {
  _id: string;
  date: string;
  status: string;
  chiefComplaint: string;
  notes?: string | null;
  staffId?: Staff | null;
  created_at: string;
}

interface DashboardData {
  upcoming?: Appointment | null;
  stats: Record<string, number>;
  recent: Appointment[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: <Clock className="w-4 h-4" /> },
  scheduled: { label: 'Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Calendar className="w-4 h-4" /> },
  completed: { label: 'Completed', color: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertCircle className="w-4 h-4" /> },
  declined: { label: 'Declined', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: <AlertCircle className="w-4 h-4" /> },
  'no-show': { label: 'No Show', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <AlertCircle className="w-4 h-4" /> },
  late: { label: 'Late', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock className="w-4 h-4" /> },
};

export default function PatientDashboard() {
  const [data, setData] = useState<DashboardData>({
    upcoming: null,
    stats: {
      pending: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      declined: 0,
      'no-show': 0,
      late: 0,
    },
    recent: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api2.get('/appointments/my-dashboard');
      setData(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1 flex items-center justify-center md:block mt-4 md:mt-0">
          <h1 className="text-3xl font-semibold">
            Your Health Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your appointments and medical history
          </p>
        </div>

        {/* Upcoming Appointment Section */}
        {data.upcoming ? (
          <Card className="border border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Upcoming Appointment</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date & Time</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="text-base font-semibold text-foreground">
                        {formatDate(data.upcoming.date).date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-base font-semibold text-foreground">
                        {formatDate(data.upcoming.date).time}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                    <Badge className={`${statusConfig[data.upcoming.status]?.color || statusConfig.pending.color} border px-3 py-1.5 flex items-center gap-2 w-fit`}>
                      {statusConfig[data.upcoming.status]?.icon}
                      <span className="capitalize">{data.upcoming.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Chief Complaint</p>
                  <p className="text-base text-foreground">{data.upcoming.chiefComplaint}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Healthcare Provider</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-base text-foreground font-medium">
                      {data.upcoming.staffId?.name || 'TBA'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <p className="text-blue-900">No upcoming appointments scheduled. Schedule one now to get started.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Appointment Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(data.stats).map(([status, count]) => (
              <Card key={status} className="border border-border hover:shadow-sm transition-shadow">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary mb-2">{count}</p>
                  <p className="text-sm font-medium text-muted-foreground capitalize">{status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Appointments */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Appointments</h2>
          {data.recent.length > 0 ? (
            <div className="space-y-4">
              {data.recent.map((appt) => (
                <Card key={appt._id} className="border border-border hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${statusConfig[appt.status]?.color || statusConfig.pending.color} border px-2.5 py-0.5 flex items-center gap-1.5 text-xs w-fit`}>
                              {statusConfig[appt.status]?.icon}
                              <span className="capitalize">{appt.status}</span>
                            </Badge>
                          </div>
                          <p className="font-semibold text-foreground text-base mb-1">{appt.chiefComplaint}</p>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(appt.date).date} at {formatDate(appt.date).time}</span>
                            </div>
                            {appt.staffId && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{appt.staffId.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {appt.notes && (
                        <div className="pt-3 border-t border-border">
                          <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                          <p className="text-sm text-foreground">{appt.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-border bg-gray-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-600">No appointment history yet.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
