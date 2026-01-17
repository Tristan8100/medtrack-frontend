'use client';

import { LoginForm } from "@/components/login-form";
import { HeartPulse } from "lucide-react"
import Link from "next/link";
import { ReactNode } from "react";

export default function LoginPage({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Clinic Branding */}
      <div className="relative hidden bg-muted lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <HeartPulse className="h-6 w-6" />
            </Link>
            <span>Medtrack - HealthCare Clinic</span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                Serving Our Community,<br />Digitally Connected
              </h2>
              <p className="text-lg opacity-90">
                Your barangay health unit now at your fingertips. Manage appointments, access health records, and stay connected with our healthcare team.
              </p>
            </div>
            
            <blockquote className="space-y-2 border-l-4 border-white/30 pl-4">
              <p className="text-base italic">
                "Mas madali na ngayon ang pag-check ng schedule ko at pag-access ng health records. Ang bait pa ng staff at mabilis sumagot."
              </p>
              <footer className="text-sm opacity-80">— Rosa Reyes, Residente ng Tibag</footer>
            </blockquote>
            
            <div className="flex gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold">5K+</div>
                <div className="opacity-80">Residents Served</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Mon-Sat</div>
                <div className="opacity-80">8AM - 5PM</div>
              </div>
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="opacity-80">Healthcare Workers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          {children}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Need assistance? Visit us at <span className="font-semibold text-foreground">RHU Tibag, Baliuag, Bulacan</span></p>
            <p className="mt-2">Monday to Saturday: 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}