'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { api2 } from "@/lib/api";
import { toast } from "sonner";

interface CreateAppointmentFormProps {
  onSuccess?: () => void;
}


const COMMON_COMPLAINTS: Record<string, string> = {
  headache: "Headache",
  fever: "Fever",
  cough: "Cough",
  soreThroat: "Sore Throat",
  stomachPain: "Stomach Pain",
  dizziness: "Dizziness",
  nausea: "Nausea",
  others: "Others",
};

export default function DialogCreate({ onSuccess }: CreateAppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [otherComplaint, setOtherComplaint] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleComplaint = (key: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || selectedComplaints.length === 0) {
      toast.error("Date and at least one complaint are required");
      return;
    }

    const complaints = selectedComplaints
      .filter((c) => c !== "others")
      .map((c) => COMMON_COMPLAINTS[c]);

    if (selectedComplaints.includes("others") && otherComplaint) {
      complaints.push(otherComplaint);
    }

    const chiefComplaint = complaints.join(", ");

    setLoading(true);
    try {
      await api2.post("/appointments", {
        date,
        chiefComplaint,
        notes,
      });

      toast.success("Appointment created successfully!");

      setOpen(false);
      setDate("");
      setSelectedComplaints([]);
      setOtherComplaint("");
      setNotes("");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to create appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Appointment</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Complaint selection */}
          <div className="flex flex-col space-y-2">
            <Label>Chief Complaint</Label>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(COMMON_COMPLAINTS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedComplaints.includes(key)}
                    onCheckedChange={() => toggleComplaint(key)}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Others input */}
            {selectedComplaints.includes("others") && (
              <Input
                placeholder="Enter other complaint"
                value={otherComplaint}
                onChange={(e) => setOtherComplaint(e.target.value)}
              />
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}