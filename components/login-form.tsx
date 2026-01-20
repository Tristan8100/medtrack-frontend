import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { login } = useAuth(); // for saving user and token
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const attemptAdminLogin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post("/api/admin-login", credentials);
      login(res.data.admin_info, res.data.token);
      router.push("/admin/dashboard");
      console.log("Admin login successful");
    } catch (err: any) {
      console.warn("User login failed, attempting admin login...");

      const status = err.response?.status;
      //const message = err.response?.data?.message;
      if (status === 401) {
        attemptStaffLogin({ email, password });
      } else if (status === 403) {
        sendOtp('admin');
      }
    }
  };

  const attemptStaffLogin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.post("/api/staff-login", credentials);
      login(res.data.admin_info, res.data.token);
      router.push("/admin/dashboard");
      console.log("Staff login successful");
    } catch (err: any) {
      console.error("Staff login failed", err);
      const status = err.response?.status;
      //const message = err.response?.data?.message;
      if (status === 401) {
        setError("Invalid credentials. Please try again.");
      } else if (status === 403) {
        sendOtp('staff');
      }
      
    }
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post("/api/login", credentials).then((res) => res.data),
    onSuccess: (data) => {
      if (data.token) {
        login(data.user_info, data.token); // Set user and token in useAuth
        router.push("/user/dashboard");
        console.log("User login successful");
      }
    },
    onError: (err: any) => {
      console.warn("User login failed, attempting admin login...");

      const status = err.response?.status;
      //const message = err.response?.data?.message;
      if (status === 401) {
        attemptAdminLogin({ email, password });
      } else if (status === 403) {
        // api.post("/api/send-otp", { email })
        //   .then((otpRes) => {
        //     localStorage.setItem("email", email);
        //     router.push("/auth/verify-otp");
        //   })
        //   .catch(() => {
        //     setError("Failed to send OTP. Please try again later.");
        //   });
        
        sendOtp('patient');
      }
    },
  });

  const sendOtp = (role: string) => {
    console.warn(role, "NOT REGISTERED");
    console.log("Sending OTP to", email);
    localStorage.setItem("email", email);
    router.push("/auth/verify-otp");
  };

  // handle form submission, will call the mutation of user login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Use your user or admin credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loginMutation.isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
            {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
          </form>
          <div className="text-center text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline underline-offset-4">
              register
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Forgot your password?{" "}
        <Link href="/forgot-password/send-reset-link" className="underline underline-offset-4">
          Reset Password
        </Link>
      </div>
    </div>
  );
}