import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import BreedingRecordForm from "./breeding/BreedingRecordForm";
import BreedingHistoryTableMobile from "./breeding/BreedingHistoryTableMobile";
import { useIsMobile } from "@/hooks/use-mobile";

interface BreedingHistoryTabProps {
  cowId: string;
  onUpdate?: () => void;
}

const BreedingHistoryTab = ({ cowId, onUpdate }: BreedingHistoryTabProps) => {
  const [breedingRecords, setBreedingRecords] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchBreedingRecords();
  }, [cowId]);

  const fetchBreedingRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('breeding_records')
        .select('*')
        .eq('cow_id', cowId)
        .order('insemination_date', { ascending: false });

      if (error) throw error;
      setBreedingRecords(data || []);
    } catch (error) {
      console.error('Error fetching breeding records:', error);
      toast.error("Failed to fetch breeding records");
    }
  };

  const handleRecordAdded = () => {
    setShowAddDialog(false);
    fetchBreedingRecords();
    if (onUpdate) onUpdate();
    toast.success("Breeding record added successfully");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Breeding History</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Record
        </Button>
      </div>

      <BreedingHistoryTableMobile breedingRecords={breedingRecords} />

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <BreedingRecordForm
            cowId={cowId}
            onSuccess={handleRecordAdded}
            onClose={() => setShowAddDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreedingHistoryTab;