'use client';

import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function MyProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api2.get('/users/my-profile');
      const userData = response.data.data || response.data;
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        password: '',
      });
    } catch (error: any) {
      toast.error('Failed to load profile', {
        description: error?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setUpdating(true);
      
      // Only send fields that have changed
      const updateData: any = {};
      
      if (formData.name !== user.name) {
        updateData.name = formData.name;
      }
      
      if (formData.email !== user.email) {
        updateData.email = formData.email;
      }
      
      if (formData.password) {
        updateData.password = formData.password;
      }

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save');
        return;
      }

      const response = await api2.patch(`/users`, updateData);
      const updatedUser = response.data.data || response.data;
      
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        password: '',
      });
      
      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved',
      });
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error?.response?.data?.message || 'An error occurred',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Update your personal information and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
              <p className="text-sm text-muted-foreground">
                Only fill this if you want to change your password
              </p>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={user?.role || ''}
                disabled
                className="capitalize"
              />
              <p className="text-sm text-muted-foreground">
                Your role cannot be changed
              </p>
            </div>

            <Button type="submit" disabled={updating} className="w-full">
              {updating ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}