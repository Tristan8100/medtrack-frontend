'use client';

import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DialogUpdateUser from './update-staff';
import RegisterStaffDialog from './create-staff';
import DeleteStaffDialog from './delete-staff';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'staff' | 'admin';
  phoneNumber?: string;
  created_at: Date;
}

export interface UserProps {
  searchRole: 'patient' | 'staff' | 'admin';
  title: string;
  description: string;
}

export default function UsersPage({ searchRole, title, description }: UserProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  //const [role, setRole] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await api2.get(`/users/all?role=${searchRole}`, {
        params: {
          page,
          search: search || undefined,
          //role: role || undefined,
        },
      });

      const payload = response.data.data;

      setUsers(payload.data);
      setHasNextPage(payload.nextPage);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };


  useEffect(() => {
    setPage(1);
    fetchUsers();
  }, [page, {/*role*/}]);//onchange

  useEffect(() => {
    setPage(1);
    const delay = setTimeout(() => {
        console.log('Search changed:', search);
      setPage(1);
      fetchUsers();
    }, 1000);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 flex items-center justify-center md:block mt-4 md:mt-0">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        {searchRole === 'staff' && (
          <RegisterStaffDialog onSuccess={fetchUsers} />
        )}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Role filtering
          <Select value={role} onValueChange={(value) => setRole(value === 'none' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All</SelectItem>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select> */}

          <Button
            variant="outline"
            onClick={() => {
              setSearch('');
              //setRole('');
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Users list */}
      <div className="grid gap-3">
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No users found.
          </p>
        )}

        {users.map((user) => (
          <Card key={user._id} className="p-4">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <span className="text-sm capitalize">{user.role}</span>
              {searchRole === 'patient' &&
                <Link href={`/admin/patients/${user._id}`}>
                  <Button>View</Button>
                </Link>
              }
              {searchRole=== 'staff' &&
              <div>
                <DialogUpdateUser user={user} onSuccess={fetchUsers} />
                <DeleteStaffDialog staffId={user._id} staffName={user.name} onSuccess={fetchUsers} />
              </div>
              }
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>

        <span>Page {page}</span>

        <Button
          disabled={!hasNextPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
