'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api2 } from "@/lib/api";
import { toast } from "sonner";

interface CreateMedicalRecordFormProps {
  patientId: string;
  appointmentId?: string; // Optional in backend, can be use in no appointments/walk in
  onSuccess?: () => void;
}

export default function DialogCreateMedicalRecord({ 
  patientId, 
  appointmentId, 
  onSuccess 
}: CreateMedicalRecordFormProps) {
  const [open, setOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [notes, setNotes] = useState('');
  
  // Vital Signs
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');
  const [oxygenSaturation, setOxygenSaturation] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !chiefComplaint) {
      toast.error("Visit Date and Chief Complaint are required");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        patientId,
        visitDate,
        chiefComplaint,
        notes: notes || undefined,
        diagnosis
      };

      // Add appointmentId only if provided and not empty
      if (appointmentId && appointmentId.trim() !== '') {
        payload.appointmentId = appointmentId;
      }

      // Add vital signs only if at least one field is filled
      const hasVitalSigns = bloodPressure || heartRate || temperature || 
                            respiratoryRate || oxygenSaturation || weight || 
                            height || bmi;
      
      if (hasVitalSigns) {
        payload.vitalSigns = {
          bloodPressure: bloodPressure || undefined,
          heartRate: heartRate ? Number(heartRate) : undefined,
          temperature: temperature ? Number(temperature) : undefined,
          respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
          oxygenSaturation: oxygenSaturation ? Number(oxygenSaturation) : undefined,
          weight: weight ? Number(weight) : undefined,
          height: height ? Number(height) : undefined,
          bmi: bmi ? Number(bmi) : undefined,
        };
      }

      await api2.post('/medical-records', payload);

      toast.success("Medical record created successfully!");
      setOpen(false);
      
      // Reset form
      setVisitDate('');
      setChiefComplaint('');
      setNotes('');
      setBloodPressure('');
      setHeartRate('');
      setTemperature('');
      setRespiratoryRate('');
      setOxygenSaturation('');
      setWeight('');
      setHeight('');
      setBmi('');
      setDiagnosis('');

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create medical record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Medical Record</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Medical Record</DialogTitle>
          {patientId && <DialogTitle className="text-sm">Patient Id: {patientId}</DialogTitle>}
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            
            <div className="flex flex-col">
              <Label htmlFor="visitDate">Visit Date *</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
              <Input
                id="chiefComplaint"
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g., Persistent cough and fever"
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes or observations"
                rows={3}
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Resulting diagnosis"
                rows={3}
              />
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Vital Signs (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="120/80"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="72"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="37.0"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  type="number"
                  value={respiratoryRate}
                  onChange={(e) => setRespiratoryRate(e.target.value)}
                  placeholder="16"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  value={oxygenSaturation}
                  onChange={(e) => setOxygenSaturation(e.target.value)}
                  placeholder="98"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="175"
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="bmi">BMI</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  placeholder="22.9"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Medical Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}