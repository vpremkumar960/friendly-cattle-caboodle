import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Image, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Records = () => {
  const [cows, setCows] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return `${age} years`;
  };

  const handleDelete = async (cowId: string) => {
    try {
      const { error } = await supabase
        .from('cows')
        .delete()
        .eq('id', cowId);

      if (error) throw error;
      toast.success("Cow record deleted successfully");
      fetchCows();
    } catch (error) {
      console.error('Error deleting cow:', error);
      toast.error("Failed to delete cow record");
    }
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
            <TableHead>Age</TableHead>
            <TableHead>Deworming Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cows.map((cow) => (
            <TableRow key={cow.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/cow-details/${cow.id}`)}>
              <TableCell className="flex items-center gap-2">
                {cow.image_url && (
                  <Image
                    className="w-4 h-4 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(cow.image_url);
                    }}
                  />
                )}
                {cow.name}
              </TableCell>
              <TableCell>{cow.breed}</TableCell>
              <TableCell>{cow.gender}</TableCell>
              <TableCell>{cow.dob}</TableCell>
              <TableCell>{calculateAge(cow.dob)}</TableCell>
              <TableCell>{cow.deworming_status}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cow.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Cow" 
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Records;