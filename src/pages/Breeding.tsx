
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AddBreedingRecord from "@/components/breeding/AddBreedingRecord";
import BreedingTable from "@/components/breeding/BreedingTable";

const Breeding = () => {
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showCalvingDialog, setShowCalvingDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [existingCows, setExistingCows] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBreedingRecords();
    fetchExistingCows();
  }, []);

  const fetchBreedingRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('breeding_records')
        .select(`
          *,
          cows (
            name
          )
        `)
        .order('insemination_date', { ascending: false });

      if (error) throw error;
      setBreedingRecords(data || []);
    } catch (error) {
      console.error('Error fetching breeding records:', error);
      toast.error("Failed to fetch breeding records");
    }
  };

  const fetchExistingCows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cows, error } = await supabase
        .from('cows')
        .select('*')
        .eq('gender', 'female');

      if (error) throw error;
      setExistingCows(cows || []);
    } catch (error) {
      console.error('Error fetching cows:', error);
      toast.error("Failed to fetch cows");
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedRecord) {
      toast.error("No record selected");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('breeding_records')
        .update({ status })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      setShowStatusDialog(false);
      if (status === 'Success') {
        setShowCalvingDialog(true);
      }
      fetchBreedingRecords();
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalvingUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const calvingDate = formData.get('calvingDate')?.toString() || '';
    const calfGender = formData.get('calfGender')?.toString() || '';
    const calfName = formData.get('calfName')?.toString() || '';
    
    try {
      const { error } = await supabase
        .from('breeding_records')
        .update({
          calving_date: calvingDate,
          calf_gender: calfGender,
          calf_name: calfName,
          status: 'Success'
        })
        .eq('id', selectedRecord.id);

      if (error) throw error;

      setShowCalvingDialog(false);
      setSelectedRecord(null);
      fetchBreedingRecords();
      toast.success("Calving details updated successfully!");
    } catch (error) {
      console.error('Error updating calving details:', error);
      toast.error("Failed to update calving details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecordClick = (record: any) => {
    if (record.status === 'Success' && record.calving_date && record.calf_gender && record.calf_name) {
      toast.info("This record is complete and cannot be modified");
      return;
    }
    
    setSelectedRecord(record);
    if (record.status === 'Success' && (!record.calving_date || !record.calf_gender || !record.calf_name)) {
      setShowCalvingDialog(true);
    } else {
      setShowStatusDialog(true);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('breeding_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      toast.success("Record deleted successfully");
      fetchBreedingRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error("Failed to delete record");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Breeding Records</h1>
        <AddBreedingRecord
          existingCows={existingCows}
          onRecordAdded={fetchBreedingRecords}
        />
      </div>

      <BreedingTable
        breedingRecords={breedingRecords}
        onRecordClick={handleRecordClick}
        onDeleteRecord={handleDeleteRecord}
      />

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handleStatusUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCalvingDialog} onOpenChange={setShowCalvingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Calving Details</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCalvingUpdate} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Calving Date</label>
              <Input type="date" name="calvingDate" required />
            </div>
            <div>
              <label className="text-sm font-medium">Calf Gender</label>
              <Select name="calfGender">
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Calf Name</label>
              <Input name="calfName" placeholder="Enter calf name" required />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Breeding;
