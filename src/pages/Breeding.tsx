import { useState } from "react";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addDays } from "date-fns";
import { toast } from "sonner";

const Breeding = () => {
  const [breedingRecords, setBreedingRecords] = useState([
    { 
      id: 1,
      cowName: "Lakshmi",
      lastInseminationDate: "2024-01-15",
      expectedCalvingDate: "2024-10-30",
      bullSemen: "HF-123",
      status: "Pending",
      inseminationStatus: "Success" // New field
    },
  ]);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [showCalvingDialog, setShowCalvingDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const calculateExpectedCalvingDate = (inseminationDate: string) => {
    const date = new Date(inseminationDate);
    return addDays(date, 280).toISOString().split('T')[0];
  };

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inseminationDate = formData.get("lastInseminationDate") as string;
    
    const newRecord = {
      id: breedingRecords.length + 1,
      cowName: formData.get("cowName") as string,
      lastInseminationDate: inseminationDate,
      expectedCalvingDate: calculateExpectedCalvingDate(inseminationDate),
      bullSemen: formData.get("bullSemen") as string,
      status: "Pending",
      inseminationStatus: "Pending"
    };
    
    setBreedingRecords([...breedingRecords, newRecord]);
    toast.success("Breeding record added successfully!");
    (e.target as HTMLFormElement).reset();
  };

  const handleRecordClick = (record: any) => {
    setSelectedRecord(record);
    const today = new Date();
    const calvingDate = new Date(record.expectedCalvingDate);
    
    if (today >= calvingDate && record.inseminationStatus === "Success") {
      setShowCalvingDialog(true);
    } else {
      setShowStatusDialog(true);
    }
  };

  const handleStatusUpdate = (status: string) => {
    const updatedRecords = breedingRecords.map(record => {
      if (record.id === selectedRecord.id) {
        return {
          ...record,
          inseminationStatus: status
        };
      }
      return record;
    });
    
    setBreedingRecords(updatedRecords);
    setShowStatusDialog(false);
    toast.success("Insemination status updated successfully!");
  };

  const handleCalvingUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedRecords = breedingRecords.map(record => {
      if (record.id === selectedRecord.id) {
        return {
          ...record,
          calfGender: formData.get("calfGender") as string,
          calvingDate: formData.get("calvingDate") as string,
          status: "Completed"
        };
      }
      return record;
    });
    
    setBreedingRecords(updatedRecords);
    setShowCalvingDialog(false);
    toast.success("Calving details updated successfully!");
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
            </DialogHeader>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <Label htmlFor="cowName">Cow Name</Label>
                <Input id="cowName" name="cowName" required />
              </div>
              <div>
                <Label htmlFor="lastInseminationDate">Insemination Date</Label>
                <Input 
                  id="lastInseminationDate" 
                  name="lastInseminationDate" 
                  type="date" 
                  required 
                />
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
              <TableHead>Last Insemination</TableHead>
              <TableHead>Expected Calving</TableHead>
              <TableHead>Bull Semen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Insemination Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingRecords.map((record) => (
              <TableRow 
                key={record.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleRecordClick(record)}
              >
                <TableCell>{record.cowName}</TableCell>
                <TableCell>{record.lastInseminationDate}</TableCell>
                <TableCell>{record.expectedCalvingDate}</TableCell>
                <TableCell>{record.bullSemen}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.inseminationStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Insemination Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={(value) => handleStatusUpdate(value)}>
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

      {showCalvingDialog && (
        <Dialog open={showCalvingDialog} onOpenChange={setShowCalvingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Calving Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCalvingUpdate} className="space-y-4">
              <div>
                <Label htmlFor="calvingDate">Calving Date</Label>
                <Input id="calvingDate" name="calvingDate" type="date" required />
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
      )}
    </div>
  );
};

export default Breeding;