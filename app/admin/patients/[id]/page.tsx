'use client';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, User, Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AllAppointmentsPage from "@/components/appointment/all-appointments";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  phoneNumber: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export default function PatientsPage() {
    const params = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await api2.get(`/users/${id}`);
            const userData = response.data.data || response.data;
            setUser(userData);
        } catch (error: any) {
            toast.error('Failed to load user', {
                description: error?.response?.data?.message || 'An error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!user || !id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground text-sm">User not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-semibold">Patient Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage patient records.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                    <CardDescription>Personal details and account status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                <p className="text-base font-semibold">{user.name}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                                <p className="text-base font-semibold">{user.email}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Phone className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                <p className="text-base font-semibold">{user.phoneNumber}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Account Role</p>
                                <Badge variant="secondary" className="capitalize">
                                    {user.role}
                                </Badge>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${user.email_verified_at ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                                {user.email_verified_at ? (
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-destructive" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Email Verification</p>
                                <Badge variant={user.email_verified_at ? "default" : "destructive"}>
                                    {user.email_verified_at ? 'Verified' : 'Not Verified'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AllAppointmentsPage role="staff" id={id} />
        </div>
    );
}