'use client';

import { useState, useEffect } from "react";
import { api2 } from "@/lib/api";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    onUpdated: (limit: number) => void;
}

export default function UpdateReservationLimitDialog({ onUpdated }: Props) {
    const [open, setOpen] = useState(false);
    const [limit, setLimit] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch current limit whenever the dialog opens
    useEffect(() => {
        if (!open) return;

        const fetchCurrentLimit = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api2.get("/system-settings");
                const fetchedLimit = response.data.data?.reservationLimit;
                if (typeof fetchedLimit === "number") {
                    setLimit(fetchedLimit);
                } else {
                    setLimit(null);
                }
            } catch (err: any) {
                setError(err?.response?.data?.message || "Failed to fetch current limit");
                setLimit(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentLimit();
    }, [open]);

    const handleSubmit = async () => {
        if (limit === null || isNaN(limit) || limit <= 0) {
            setError("Limit must be a positive number");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const response = await api2.post("/system-settings", {
                reservationLimit: limit
            });
            const updatedLimit = response.data.data.reservationLimit;
            onUpdated(updatedLimit);
            setOpen(false);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update limit");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <DialogTrigger asChild>
                <Button variant="outline" disabled={loading}>
                    {loading ? "Loading..." : limit !== null ? `Limit: ${limit}` : "Update Limit"}
                    {limit === null && " (Not set)"}
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Update Reservation Limit {limit !== null && `(${limit})`}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    {error && <p className="text-red-500">{error}</p>}

                    <Input
                        type="number"
                        min={1}
                        placeholder="Enter new limit"
                        value={limit ?? ""}
                        onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setLimit(!isNaN(val) ? val : null);
                        }}
                        disabled={loading || saving}
                    />
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={saving || loading || limit === null}>
                        {saving ? "Saving..." : "Update"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}