import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddBreedingRecordProps {
  existingCows: any[];
  onRecordAdded: () => void;
}

const AddBreedingRecord = ({ existingCows, onRecordAdded }: AddBreedingRecordProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const cowId = formData.get('cowId')?.toString();
      const inseminationDate = formData.get('inseminationDate')?.toString();
      const bullSemen = formData.get('bullSemen')?.toString();

      if (!cowId || !inseminationDate) {
        toast.error("Please fill in all required fields");
        return;
      }

      const selectedCow = existingCows.find(cow => cow.id === cowId);
      if (!selectedCow) {
        toast.error("Selected cow is not valid");
        return;
      }

      const newRecord = {
        cow_id: cowId,
        insemination_date: inseminationDate,
        bull_semen: bullSemen,
        status: 'Pending'
      };

      const { error } = await supabase
        .from('breeding_records')
        .insert(newRecord);

      if (error) throw error;

      toast.success("Breeding record added successfully!");
      onRecordAdded();
      setOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error adding breeding record:', error);
      toast.error("Failed to add breeding record. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const femaleCows = existingCows.filter(cow => cow.gender === 'female');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Label htmlFor="cowId">Select Cow</Label>
            <Select name="cowId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select cow" />
              </SelectTrigger>
              <SelectContent>
                {femaleCows.map((cow) => (
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
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBreedingRecord;