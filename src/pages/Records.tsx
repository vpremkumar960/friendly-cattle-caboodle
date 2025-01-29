import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CowDetails from "@/components/CowDetails";

const Records = () => {
  const [selectedCow, setSelectedCow] = useState<any>(null);
  const [records, setRecords] = useState([
    { 
      id: 1,
      name: "Lakshmi", 
      state: "Milking", 
      production: "25L/day", 
      health: "Good", 
      lastCheckup: "2024-01-15",
      image: "/placeholder.svg" // This should be replaced with actual cow image
    },
  ]);

  const handleCowClick = (cow: any) => {
    setSelectedCow(cow);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Input className="max-w-xs" placeholder="Search records..." />
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Last Checkup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow 
                key={record.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleCowClick(record)}
              >
                <TableCell>
                  <img 
                    src={record.image} 
                    alt={record.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.state}</TableCell>
                <TableCell>{record.production}</TableCell>
                <TableCell>{record.health}</TableCell>
                <TableCell>{record.lastCheckup}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedCow && (
        <Dialog open={!!selectedCow} onOpenChange={() => setSelectedCow(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedCow.name}</DialogTitle>
            </DialogHeader>
            <CowDetails cowId={selectedCow.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Records;