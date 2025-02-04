import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BreedingRecordFormProps {
  cowId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const BreedingRecordForm = ({ cowId, onSuccess, onClose }: BreedingRecordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    inseminationDate: '',
    bullSemen: '',
    status: 'Pending',
    calfGender: '',
    calfName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: cowExists, error: cowCheckError } = await supabase
        .from('cows')
        .select('id')
        .eq('id', cowId)
        .single();

      if (cowCheckError || !cowExists) {
        toast.error("Invalid cow selected. Please refresh and try again.");
        return;
      }

      const newRecord = {
        cow_id: cowId,
        insemination_date: formData.inseminationDate,
        bull_semen: formData.bullSemen,
        status: formData.status,
        calf_gender: formData.status === 'Success' ? formData.calfGender : null,
        calf_name: formData.status === 'Success' ? formData.calfName : null,
      };
      
      const { error } = await supabase
        .from('breeding_records')
        .insert(newRecord);

      if (error) throw error;

      toast.success("Breeding record added successfully!");
      onSuccess();
      onClose();
      
    } catch (error) {
      console.error('Error in handleAddBreedingRecord:', error);
      toast.error("Failed to add breeding record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Insemination Date</label>
        <Input 
          type="date" 
          value={formData.inseminationDate}
          onChange={(e) => handleInputChange('inseminationDate', e.target.value)}
          required 
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bull Semen</label>
        <Input 
          value={formData.bullSemen}
          onChange={(e) => handleInputChange('bullSemen', e.target.value)}
          required 
        />
      </div>
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select 
          value={formData.status}
          onValueChange={(value) => handleInputChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.status === 'Success' && (
        <>
          <div>
            <label className="text-sm font-medium">Calf Gender</label>
            <Select
              value={formData.calfGender}
              onValueChange={(value) => handleInputChange('calfGender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Calf Name</label>
            <Input
              value={formData.calfName}
              onChange={(e) => handleInputChange('calfName', e.target.value)}
              placeholder="Enter calf name"
            />
          </div>
        </>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Record"}
      </Button>
    </form>
  );
};

export default BreedingRecordForm;