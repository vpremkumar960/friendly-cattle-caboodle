import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BreedingHistoryTabProps {
  cowId: string;
  breedingHistory: any[];
  onUpdate?: () => void;
}

const BreedingHistoryTab = ({ cowId, breedingHistory, onUpdate }: BreedingHistoryTabProps) => {
  const [showAddBreedingDialog, setShowAddBreedingDialog] = useState(false);
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

  const handleAddBreedingRecord = async (e: React.FormEvent<HTMLFormElement>) => {
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

      setShowAddBreedingDialog(false);
      toast.success("Breeding record added successfully!");
      if (onUpdate) onUpdate();
      
      setFormData({
        inseminationDate: '',
        bullSemen: '',
        status: 'Pending',
        calfGender: '',
        calfName: ''
      });
    } catch (error) {
      console.error('Error in handleAddBreedingRecord:', error);
      toast.error("Failed to add breeding record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRecordEditable = (record: any) => {
    return record.status !== 'Success';
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Breeding History</h3>
        <Dialog open={showAddBreedingDialog} onOpenChange={setShowAddBreedingDialog}>
          <DialogTrigger asChild>
            <Button>Add Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Breeding Record</DialogTitle>
              <DialogDescription>Enter breeding record details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddBreedingRecord} className="space-y-4">
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
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[400px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insemination Date</TableHead>
              <TableHead>Bull Semen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Calving</TableHead>
              <TableHead>Calf Gender</TableHead>
              <TableHead>Calf Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breedingHistory.map((record: any) => (
              <TableRow key={record.id}>
                <TableCell>{record.insemination_date}</TableCell>
                <TableCell>{record.bull_semen}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'Success' ? 'bg-green-100 text-green-800' :
                    record.status === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>{record.expected_calving_date || '-'}</TableCell>
                <TableCell>{record.calf_gender || '-'}</TableCell>
                <TableCell>{record.calf_name || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default BreedingHistoryTab;