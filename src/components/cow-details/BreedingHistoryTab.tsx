import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import BreedingHistoryTable from "./breeding/BreedingHistoryTable";
import BreedingHistoryTableMobile from "./breeding/BreedingHistoryTableMobile";
import BreedingRecordForm from "./breeding/BreedingRecordForm";

interface BreedingHistoryTabProps {
  cowId: string;
  breedingHistory: any[];
  onUpdate?: () => void;
}

const BreedingHistoryTab = ({ cowId, breedingHistory, onUpdate }: BreedingHistoryTabProps) => {
  const [showAddBreedingDialog, setShowAddBreedingDialog] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Breeding History</h3>
        <Dialog open={showAddBreedingDialog} onOpenChange={setShowAddBreedingDialog}>
          <DialogTrigger asChild>
            <Button>Add Record</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Breeding Record</DialogTitle>
            </DialogHeader>
            <BreedingRecordForm
              cowId={cowId}
              onSuccess={() => {
                if (onUpdate) onUpdate();
                setShowAddBreedingDialog(false);
              }}
              onClose={() => setShowAddBreedingDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isMobile ? (
        <BreedingHistoryTableMobile breedingHistory={breedingHistory} />
      ) : (
        <BreedingHistoryTable breedingHistory={breedingHistory} />
      )}
    </Card>
  );
};

export default BreedingHistoryTab;