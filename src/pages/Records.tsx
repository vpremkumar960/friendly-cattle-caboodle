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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Records = () => {
  const [selectedCow, setSelectedCow] = useState<any>(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    try {
      const { data, error } = await supabase
        .from('cows')
        .select('*')
        .order('name');
      
      if (error) {
        toast.error("Failed to fetch cows");
        return;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching cows:', error);
      toast.error("Failed to fetch cows");
    }
  };

  const calculateAge = (dob: string) => {
    const years = differenceInYears(new Date(), new Date(dob));
    const months = differenceInMonths(new Date(), new Date(dob)) % 12;
    return `${years}.${months} years`;
  };

  const getStateDisplay = (cow: any) => {
    return cow.gender === 'male' ? 'Bull' : cow.state;
  };

  const getProductionDisplay = (cow: any) => {
    return cow.gender === 'male' ? 'N/A' : `${cow.milking_per_year}L/year`;
  };

  const filteredRecords = records.filter((cow: any) => 
    cow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Input 
          className="w-full md:w-64" 
          placeholder="Search records..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 md:w-24"></TableHead>
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
                  <div className="w-16 h-16 md:w-20 md:h-20 relative">
                    <img 
                      src={record.image_url || "/placeholder.svg"} 
                      alt={record.name} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{record.dob ? calculateAge(record.dob) : 'N/A'}</TableCell>
                <TableCell>{record.gender}</TableCell>
                <TableCell>{getStateDisplay(record)}</TableCell>
                <TableCell>{getProductionDisplay(record)}</TableCell>
                <TableCell>{record.deworming_status || 'Not Set'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedCow && (
        <Dialog 
          open={!!selectedCow} 
          onOpenChange={(open) => {
            if (!open) {
              setSelectedCow(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCow.name}</DialogTitle>
            </DialogHeader>
            <CowDetails 
              cowId={selectedCow.id} 
              cowData={selectedCow} 
              onUpdate={fetchCows}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Records;