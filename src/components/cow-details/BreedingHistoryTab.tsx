import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BreedingHistoryTabProps {
  cowId: string;
  breedingHistory: any[];
  onUpdate?: () => void;
}

const BreedingHistoryTab = ({ cowId, breedingHistory, onUpdate }: BreedingHistoryTabProps) => {
  const [showAddBreedingDialog, setShowAddBreedingDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBreedingRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: cowExists, error: cowCheckError } = await supabase
        .from('cows')
        .select('id')
        .eq('id', cowId)
        .single();

      if (cowCheckError || !cowExists) {
        toast.error("Invalid cow selected. Please refresh and try again.");
        return;
      }

      const formData = new FormData(e.currentTarget);
      const status = formData.get('status')?.toString() || 'Pending';
      
      const newRecord = {
        cow_id: cowId,
        insemination_date: formData.get('inseminationDate')?.toString() || '',
        bull_semen: formData.get('bullSemen')?.toString() || '',
        status: status,
        calf_gender: status === 'Success' ? formData.get('calfGender')?.toString() : null,
        calf_name: status === 'Success' ? formData.get('calfName')?.toString() : null,
      };
      
      const { error } = await supabase
        .from('breeding_records')
        .insert(newRecord);

      if (error) {
        console.error('Error adding breeding record:', error);
        throw error;
      }

      setShowAddBreedingDialog(false);
      toast.success("Breeding record added successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error in handleAddBreedingRecord:', error);
      toast.error("Failed to add breeding record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Breeding History</h3>
        <Dialog open={showAddBreedingDialog} onOpenChange={setShowAddBreedingDialog}>
          <DialogTrigger asChild>
            <Button>Add Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Breeding Record</DialogTitle>
              <DialogDescription>Enter breeding record details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBreedingRecord} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Insemination Date</label>
                <Input type="date" name="inseminationDate" required />
              </div>
              <div>
                <label className="text-sm font-medium">Bull Semen</label>
                <Input name="bullSemen" required />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select name="status" onValueChange={(value) => {
                  const form = document.querySelector('form');
                  if (form) {
                    const calfFields = form.querySelectorAll('[data-calf-field]');
                    calfFields.forEach((field: any) => {
                      field.style.display = value === 'Success' ? 'block' : 'none';
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Success">Success</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div data-calf-field style={{ display: 'none' }}>
                <label className="text-sm font-medium">Calf Gender</label>
                <Select name="calfGender">
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div data-calf-field style={{ display: 'none' }}>
                <label className="text-sm font-medium">Calf Name</label>
                <Input name="calfName" placeholder="Enter calf name" />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insemination Date</TableHead>
            <TableHead>Bull Semen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Expected Calving</TableHead>
            <TableHead>Calf Gender</TableHead>
            <TableHead>Calf Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breedingHistory.map((record: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{record.insemination_date}</TableCell>
              <TableCell>{record.bull_semen}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.expected_calving_date || '-'}</TableCell>
              <TableCell>{record.calf_gender || '-'}</TableCell>
              <TableCell>{record.calf_name || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default BreedingHistoryTab;