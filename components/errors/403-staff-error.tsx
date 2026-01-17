import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="bg-muted p-6 rounded-full">
                <ShieldAlert className="w-16 h-16 text-muted-foreground" strokeWidth={1.5} />
              </div>
            </div>

            {/* Error Code */}
            <div>
              <h1 className="text-8xl font-bold text-foreground/20 mb-2">403</h1>
              <CardTitle className="text-3xl mb-2">Access Restricted</CardTitle>
              <CardDescription className="text-lg">
                You don't have permission to view this page
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <p className="text-center text-muted-foreground">
              This page requires <span className="font-semibold text-foreground">administrator</span> privileges. Your current role is <span className="font-semibold text-foreground">staff</span>.
            </p>

            {/* Info Alert */}
            <Alert>
              <AlertDescription>
                <span className="font-semibold">Need access?</span> Contact your system administrator to request the necessary permissions.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>

              <Link href="/admin/dashboard">
                <Button
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              Error Code: 403
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}