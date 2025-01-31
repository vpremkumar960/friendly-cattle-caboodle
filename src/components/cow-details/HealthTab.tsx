import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthTabProps {
  cowId: string;
  initialStatus: string;
  initialDate: string;
  onUpdate?: () => void;
}

const HealthTab = ({ cowId, initialStatus, initialDate, onUpdate }: HealthTabProps) => {
  const handleDewormingUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const status = formData.get('status')?.toString() || '';
    const date = formData.get('date')?.toString() || '';

    const { error } = await supabase
      .from('cows')
      .update({ 
        deworming_status: status,
        last_deworming_date: date
      })
      .eq('id', cowId);

    if (error) {
      toast.error("Failed to update deworming status");
      return;
    }

    toast.success("Deworming status updated successfully!");
    if (onUpdate) onUpdate();
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleDewormingUpdate} className="space-y-4">
        <h3 className="font-semibold mb-4">Health Records</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Deworming Status</label>
            <Select name="status" defaultValue={initialStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Done">Not Done</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
                <SelectItem value="Due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Last Deworming Date</label>
            <Input 
              type="date"
              name="date"
              defaultValue={initialDate}
            />
          </div>
          <Button type="submit">Update Deworming Status</Button>
        </div>
      </form>
    </Card>
  );
};

export default HealthTab;