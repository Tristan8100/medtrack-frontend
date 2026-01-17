'use client';

import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Lock, Shield, CheckCircle2, KeyRound } from 'lucide-react';

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api2.get('/users/my-profile');
      const userData = res.data.data || res.data;
      setUser(userData);
      setProfileForm({
        name: userData.name,
        email: userData.email,
      });
    } catch (err: any) {
      toast.error('Failed to load profile', {
        description: err?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PROFILE UPDATE ---------------- */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setUpdatingProfile(true);

      if (profileForm.name === user.name) {
        toast.info('No changes to save');
        return;
      }

      const res = await api2.patch('/users', {
        name: profileForm.name,
      });

      const updatedUser = res.data.data || res.data;
      setUser(updatedUser);

      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error('Failed to update profile', {
        description: err?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  /* ---------------- PASSWORD UPDATE ---------------- */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUpdatingPassword(true);

      await api2.patch('/users/password', passwordForm);

      toast.success('Password updated successfully');

      setPasswordForm({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      toast.error('Failed to update password', {
        description: err?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-500 mb-8">Manage your profile and security</p>

        <div className="space-y-6">
          {/* USER SUMMARY */}
          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 self-start sm:self-auto">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm capitalize">{user?.role}</span>
              </div>
            </CardContent>
          </Card>

          {/* FORMS */}
          <div className="space-y-6">
            {/* EDIT PROFILE */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input value={profileForm.email} disabled />
                  </div>

                  <Button type="submit" disabled={updatingProfile} className="w-full">
                    {updatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Save Profile
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* CHANGE PASSWORD */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5" /> Change Password
                </CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" disabled={updatingPassword} className="w-full">
                    {updatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" /> Update Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
