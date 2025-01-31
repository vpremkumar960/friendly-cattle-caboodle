import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MilkingTabProps {
  cowId: string;
  initialStatus: string;
  initialProduction: number;
  onUpdate?: () => void;
}

const MilkingTab = ({ cowId, initialStatus, initialProduction, onUpdate }: MilkingTabProps) => {
  const handleMilkingUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStatus = formData.get('status')?.toString() || '';
    const production = formData.get('production')?.toString() || '0';
    
    const { error } = await supabase
      .from('cows')
      .update({ 
        state: newStatus,
        milking_per_year: parseFloat(production)
      })
      .eq('id', cowId);

    if (error) {
      toast.error("Failed to update milking details");
      return;
    }

    toast.success("Milking details updated successfully!");
    if (onUpdate) onUpdate();
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleMilkingUpdate} className="space-y-4">
        <h3 className="font-semibold mb-4">Milking Records</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select name="status" defaultValue={initialStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Milking">Milking</SelectItem>
                <SelectItem value="Dry">Dry</SelectItem>
                <SelectItem value="Pregnant">Pregnant</SelectItem>
                <SelectItem value="Milking Pregnant">Milking Pregnant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Production (L/year)</label>
            <Input 
              name="production" 
              defaultValue={initialProduction}
              type="number"
              placeholder="e.g., 3000"
            />
          </div>
          <Button type="submit">Update Milking Details</Button>
        </div>
      </form>
    </Card>
  );
};

export default MilkingTab;