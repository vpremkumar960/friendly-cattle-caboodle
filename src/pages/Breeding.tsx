import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Breeding = () => {
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showCalvingDialog, setShowCalvingDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [existingCows, setExistingCows] = useState<any[]>([]);

  useEffect(() => {
    fetchBreedingRecords();
    fetchExistingCows();
  }, []);

  const fetchBreedingRecords = async () => {
    const { data, error } = await supabase
      .from('breeding_records')
      .select(`
        *,
        cows (
          name
        )
      `)
      .order('insemination_date', { ascending: false });

    if (error) {
      toast.error("Failed to fetch breeding records");
      return;
    }

    setBreedingRecords(data || []);
  };

  const fetchExistingCows = async () => {
    const { data, error } = await supabase
      .from('cows')
      .select('*');

    if (error) {
      toast.error("Failed to fetch cows");
      return;
    }

    setExistingCows(data || []);
  };

  const handleAddRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const cowId = formData.get('cowId')?.toString() || '';
    const inseminationDate = formData.get('inseminationDate')?.toString() || '';
    const bullSemen = formData.get('bullSemen')?.toString() || '';
    
    const newRecord = {
      cow_id: cowId,
      insemination_date: inseminationDate,
      bull_semen: bullSemen,
      status: 'Pending'
    };
    
    const { error } = await supabase
      .from('breeding_records')
      .insert(newRecord);

    if (error) {
      toast.error("Failed to add breeding record");
      return;
    }

    toast.success("Breeding record added successfully!");
    fetchBreedingRecords();
    (e.target as HTMLFormElement).reset();
  };

  const handleStatusUpdate = async (status: string) => {
    const { error } = await supabase
      .from('breeding_records')
      .update({ status })
      .eq('id', selectedRecord.id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    if (status === 'Success') {
      setShowStatusDialog(false);
      setShowCalvingDialog(true);
    } else {
      setShowStatusDialog(false);
      fetchBreedingRecords();
      toast.success("Status updated successfully!");
    }
  };

  const handleCalvingUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('breeding_records')
      .update({
        calving_date: formData.get('calvingDate'),
        calf_gender: formData.get('calfGender')
      })
      .eq('id', selectedRecord.id);

    if (error) {
      toast.error("Failed to update calving details");
      return;
    }

    setShowCalvingDialog(false);
    fetchBreedingRecords();
    toast.success("Calving details updated successfully!");
  };

  const handleRecordClick = (record: any) => {
    setSelectedRecord(record);
    if (record.status === 'Success' && !record.calving_date) {
      setShowCalvingDialog(true);
    } else {
      setShowStatusDialog(true);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Breeding Records</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Breeding Record</DialogTitle>
              <DialogDescription>Select a cow and enter breeding details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <Label htmlFor="cowId">Select Cow</Label>
                <Select name="cowId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cow" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCows.map((cow) => (
                      <SelectItem key={cow.id} value={cow.id}>
                        {cow.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inseminationDate">Insemination Date</Label>
                <Input type="date" id="inseminationDate" name="inseminationDate" required />
              </div>
              <div>
                <Label htmlFor="bullSemen">Bull Semen Code</Label>
                <Input id="bullSemen" name="bullSemen" required />
              </div>
              <Button type="submit">Add Record</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cow Name</TableHead>
              <TableHead>Insemination Date</TableHead>
              <TableHead>Bull Semen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Calving</TableHead>
              <TableHead>Calving Date</TableHead>
              <TableHead>Calf Gender</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingRecords.map((record: any) => (
              <TableRow 
                key={record.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRecordClick(record)}
              >
                <TableCell>{record.cows?.name}</TableCell>
                <TableCell>{record.insemination_date}</TableCell>
                <TableCell>{record.bull_semen}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.expected_calving_date || '-'}</TableCell>
                <TableCell>{record.calving_date || '-'}</TableCell>
                <TableCell>{record.calf_gender || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Select the new status for this breeding record</DialogDescription>
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
            <DialogDescription>Enter the calving date and calf details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCalvingUpdate} className="space-y-4">
            <div>
              <Label htmlFor="calvingDate">Calving Date</Label>
              <Input type="date" id="calvingDate" name="calvingDate" required />
            </div>
            <div>
              <Label htmlFor="calfGender">Calf Gender</Label>
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
            <Button type="submit">Update</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Breeding;
