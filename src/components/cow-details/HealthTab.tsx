import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface HealthTabProps {
  cowId: string;
  initialStatus: string;
  initialDate: string;
  onUpdate?: () => void;
}

const HealthTab = ({ cowId, initialStatus, initialDate, onUpdate }: HealthTabProps) => {
  const [dewormingHistory, setDewormingHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchDewormingHistory();
  }, [cowId]);

  const fetchDewormingHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('deworming_history')
        .select('*')
        .eq('cow_id', cowId)
        .order('deworming_date', { ascending: false });

      if (error) throw error;
      setDewormingHistory(data || []);
    } catch (error) {
      console.error('Error fetching deworming history:', error);
      toast.error("Failed to fetch deworming history");
    }
  };

  const handleDewormingUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const status = formData.get('status')?.toString() || '';
    const date = formData.get('date')?.toString() || '';

    try {
      // Update cow's deworming status
      const { error: updateError } = await supabase
        .from('cows')
        .update({ 
          deworming_status: status,
          last_deworming_date: date
        })
        .eq('id', cowId);

      if (updateError) throw updateError;

      // If status is "Done", add to deworming history
      if (status === 'Done') {
        const { error: historyError } = await supabase
          .from('deworming_history')
          .insert({
            cow_id: cowId,
            deworming_date: date
          });

        if (historyError) throw historyError;
      }

      toast.success("Deworming status updated successfully!");
      if (onUpdate) onUpdate();
      fetchDewormingHistory();
    } catch (error) {
      console.error('Error in handleDewormingUpdate:', error);
      toast.error("Failed to update deworming status");
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleDewormingUpdate} className="space-y-4">
        <h3 className="font-semibold mb-4">Health Records</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deworming Status</label>
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
            <label className="block text-sm font-medium mb-1">Deworming Date</label>
            <Input 
              type="date"
              name="date"
              defaultValue={initialDate}
            />
          </div>
          <Button type="submit">Update Deworming Status</Button>
        </div>
      </form>

      <div className="mt-6">
        <h4 className="font-medium mb-3">Deworming History</h4>
        <div className="space-y-2">
          {dewormingHistory.map((record, index) => (
            <div key={record.id} className="text-sm text-gray-600">
              {format(new Date(record.deworming_date), 'MMM dd, yyyy')}
              {index === 0 && <span className="ml-2 text-green-500">(Latest)</span>}
            </div>
          ))}
          {dewormingHistory.length === 0 && (
            <p className="text-sm text-gray-500">No deworming history available</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HealthTab;