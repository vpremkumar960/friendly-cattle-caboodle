import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Cow } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Breeding = () => {
  const [breedingRecords, setBreedingRecords] = useState([
    { 
      name: "Lakshmi",
      lastInseminationDate: "2024-01-15",
      expectedCalfingDate: "2024-10-15",
      calf: "Female",
      calfedDate: "2023-01-15",
      status: "Successful"
    },
  ]);

  const handleAddRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord = {
      name: formData.get("name") as string,
      lastInseminationDate: formData.get("lastInseminationDate") as string,
      expectedCalfingDate: formData.get("expectedCalfingDate") as string,
      calf: formData.get("calf") as string,
      calfedDate: formData.get("calfedDate") as string,
      status: "Pending"
    };
    setBreedingRecords([...breedingRecords, newRecord]);
    (e.target as HTMLFormElement).reset();
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
                <Label htmlFor="name">Cow Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="lastInseminationDate">Last Insemination Date</Label>
                <Input id="lastInseminationDate" name="lastInseminationDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="expectedCalfingDate">Expected Calfing Date</Label>
                <Input id="expectedCalfingDate" name="expectedCalfingDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="calf">Calf Gender</Label>
                <Select name="calf">
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
                <Label htmlFor="calfedDate">Calfed Date</Label>
                <Input id="calfedDate" name="calfedDate" type="date" />
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
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Insemination</TableHead>
              <TableHead>Expected Calfing</TableHead>
              <TableHead>Calf</TableHead>
              <TableHead>Calfed Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Cow className="w-6 h-6 text-gray-500" />
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.lastInseminationDate}</TableCell>
                <TableCell>{record.expectedCalfingDate}</TableCell>
                <TableCell>{record.calf}</TableCell>
                <TableCell>{record.calfedDate}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Breeding;