'use client';

import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'staff' | 'admin';
  phoneNumber?: string;
}

interface DialogUpdateUserProps {
  user: User;
  onSuccess?: (updatedUser: User) => void;
}

export default function DialogUpdateUser({ user, onSuccess }: DialogUpdateUserProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const payload = { name, phoneNumber };

      const response = await api2.put(`/users/staff/${user._id}`, payload);
      toast.success('User updated successfully');

      setOpen(false);

      if (onSuccess) {
        onSuccess(response.data.data || response.data);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to update user', {
        description: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Staff User</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
