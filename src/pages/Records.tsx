import { useState, useEffect } from "react";
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
import { differenceInYears, differenceInMonths } from "date-fns";

const Records = () => {
  const [selectedCow, setSelectedCow] = useState<any>(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedCows = localStorage.getItem('cows');
    if (savedCows) {
      setRecords(JSON.parse(savedCows));
    }
  }, []);

  const calculateAge = (dob: string) => {
    const years = differenceInYears(new Date(), new Date(dob));
    const months = differenceInMonths(new Date(), new Date(dob)) % 12;
    return `${years}.${months} years`;
  };

  const getStateDisplay = (cow: any) => {
    return cow.gender === 'male' ? 'Bull' : cow.state;
  };

  const getProductionDisplay = (cow: any) => {
    return cow.gender === 'male' ? 'N/A' : `${cow.milkingPerYear}L/year`;
  };

  const filteredRecords = records.filter((cow: any) => 
    cow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Input 
          className="max-w-xs" 
          placeholder="Search records..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Production</TableHead>
              <TableHead>Health</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record: any) => (
              <TableRow 
                key={record.id} 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedCow(record)}
              >
                <TableCell>
                  <img 
                    src={record.image || "/placeholder.svg"} 
                    alt={record.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{calculateAge(record.dob)}</TableCell>
                <TableCell>{record.gender}</TableCell>
                <TableCell>{getStateDisplay(record)}</TableCell>
                <TableCell>{getProductionDisplay(record)}</TableCell>
                <TableCell>{record.health}</TableCell>
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
            <CowDetails cowId={selectedCow.id} cowData={selectedCow} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Records;