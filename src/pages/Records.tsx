import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Records = () => {
  const [cows, setCows] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCows(data || []);
    } catch (error) {
      console.error('Error fetching cows:', error);
      toast.error("Failed to fetch cow records");
    }
  };

  const handleAddCow = () => {
    navigate('/add-cow');
  };

  const handleViewDetails = (cowId: string) => {
    navigate(`/cow-details/${cowId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Button onClick={handleAddCow}>
          <Plus className="w-4 h-4 mr-2" />
          Add Cow
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Deworming Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cows.map((cow) => (
            <TableRow key={cow.id}>
              <TableCell>{cow.name}</TableCell>
              <TableCell>{cow.breed}</TableCell>
              <TableCell>{cow.gender}</TableCell>
              <TableCell>{cow.dob}</TableCell>
              <TableCell>{cow.deworming_status}</TableCell>
              <TableCell>
                <Button variant="outline" onClick={() => handleViewDetails(cow.id)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Records;