'use client';

import { useEffect, useState, useRef } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Lock, Shield, CheckCircle2, KeyRound, SunMoon, Phone, BadgeCheck } from 'lucide-react';
import { ModeToggle } from '../theme-toggle';

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  phone_verified_at?: Date | null | undefined;
}

const OTP_LENGTH = 6;

export default function MyProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // OTP states
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
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
        phoneNumber: userData.phoneNumber,
      });
    } catch (err: any) {
      toast.error('Failed to load profile', {
        description: err?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setUpdatingProfile(true);
      const payload: any = { name: profileForm.name };
      if (profileForm.phoneNumber !== user.phoneNumber) {
        payload.phoneNumber = profileForm.phoneNumber;
      }
      if (Object.keys(payload).length === 0) {
        toast.info('No changes to save');
        return;
      }
      const res = await api2.patch('/users', payload);
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


  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdatingPassword(true);
      await api2.patch('/users/password', passwordForm);
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error('Failed to update password', {
        description: err?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setUpdatingPassword(false);
    }
  };


  const handleSendVerification = async () => {
    try {
      setSendingCode(true);
      await api2.post('/users/phone-verification');
      toast.success('Verification code sent to your phone');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpModalOpen(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      const errMessage = err.response?.data?.response?.message || err.response?.data?.message;
      toast.error(errMessage || 'adgsghshsfhsfhshsf');
    } finally {
      setSendingCode(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Allow only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    // Move to next input
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    // Allow paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) return;
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newDigits = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { newDigits[i] = char; });
    setOtpDigits(newDigits);
    const nextEmpty = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[nextEmpty]?.focus();
  };

  const handleVerifyCode = async () => {
    const code = otpDigits.join('');
    if (code.length < OTP_LENGTH) {
      toast.error('Please enter the full verification code');
      return;
    }
    try {
      setVerifyingCode(true);
      await api2.post('/users/phone-verification/verify', {
        phoneNumber: user?.phoneNumber,
        code,
      });
      toast.success('Phone number verified successfully');
      setOtpModalOpen(false);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      fetchUserProfile();
    } catch (err: any) {
      toast.error('Verification failed', {
        description: err?.response?.data?.message || 'Invalid or expired code',
      });
      // Clear OTP on failure
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    await handleSendVerification();
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

          <Card>
            <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-500">{user?.phoneNumber}</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 self-start sm:self-auto">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm capitalize">{user?.role}</span>
              </div>
            </CardContent>
          </Card>


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
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                      }
                      className="flex-1"
                    />
                    {user?.phone_verified_at ? (
                      <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium whitespace-nowrap">
                        <BadgeCheck className="w-4 h-4" />
                        Verified
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendVerification}
                        disabled={sendingCode}
                        className="whitespace-nowrap"
                      >
                        {sendingCode ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Phone className="w-4 h-4 mr-1.5" />
                            Verify
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {!user?.phone_verified_at && (
                    <p className="text-xs text-muted-foreground">
                      Your phone number is not verified yet.
                    </p>
                  )}
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
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
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
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
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


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SunMoon className="w-5 h-5" /> System Settings
              </CardTitle>
              <CardDescription>Update your system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ModeToggle />
            </CardContent>
          </Card>
        </div>
      </div>


      <Dialog open={otpModalOpen} onOpenChange={(open) => { if (!verifyingCode) setOtpModalOpen(open); }}>
        <DialogContent className='flex flex-col items-center'>
          <DialogTitle></DialogTitle>
          <div className="sm:w-[100%] w-[100%]">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-2">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>

            <div className="text-center w-full">
              Verify your phone number
            </div>

            <div className="text-center w-full break-words">
              We sent a {OTP_LENGTH}-digit code to{" "}
              <span className="font-medium text-foreground break-all">
                {user?.phoneNumber}
              </span>.
              Enter it below to verify your number.
            </div>
          </div>
          <div className="flex justify-center gap-2 my-4" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-10 h-12 sm:w-11 sm:h-14 text-center text-xl font-semibold border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            ))}
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={verifyingCode || otpDigits.join('').length < OTP_LENGTH}
            className="w-full"
          >
            {verifyingCode ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <BadgeCheck className="w-4 h-4 mr-2" /> Confirm Verification
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-1">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={sendingCode}
              className="text-blue-600 hover:underline font-medium disabled:opacity-50"
            >
              {sendingCode ? 'Sending...' : 'Resend code'}
            </button>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}