import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";

const CowDetails = ({ cowId, cowData }: { cowId: string; cowData: any }) => {
  const [breedingHistory, setBreedingHistory] = useState([]);
  const [showAddBreedingDialog, setShowAddBreedingDialog] = useState(false);
  const [milkingStatus, setMilkingStatus] = useState(cowData?.state || 'Milking');
  const [avgProduction, setAvgProduction] = useState(cowData?.milkingPerYear ? `${cowData.milkingPerYear}L/year` : '0L/year');
  const [dewormingStatus, setDewormingStatus] = useState(cowData?.dewormingStatus || 'Not Done');
  const [lastDewormingDate, setLastDewormingDate] = useState(cowData?.lastDewormingDate || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([cowData?.image_url || "/placeholder.svg"]);
  const [showImageEditDialog, setShowImageEditDialog] = useState(false);

  useEffect(() => {
    fetchBreedingHistory();
  }, [cowId]);

  const fetchBreedingHistory = async () => {
    const { data, error } = await supabase
      .from('breeding_records')
      .select('*')
      .eq('cow_id', cowId)
      .order('insemination_date', { ascending: false });

    if (error) {
      toast.error("Failed to fetch breeding history");
      return;
    }

    setBreedingHistory(data || []);
  };

  const handleAddBreedingRecord = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const status = formData.get('status')?.toString() || 'Pending';
    
    const newRecord = {
      cow_id: cowId,
      insemination_date: formData.get('inseminationDate')?.toString() || '',
      bull_semen: formData.get('bullSemen')?.toString() || '',
      status: status,
      calf_name: status === 'Success' ? formData.get('calfName')?.toString() : null,
      calf_gender: status === 'Success' ? formData.get('calfGender')?.toString() : null,
    };
    
    const { error } = await supabase
      .from('breeding_records')
      .insert(newRecord);

    if (error) {
      toast.error("Failed to add breeding record");
      return;
    }

    setShowAddBreedingDialog(false);
    toast.success("Breeding record added successfully!");
    fetchBreedingHistory();
  };

  const handleImageEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newImageUrl = formData.get('imageUrl')?.toString() || '';

    const { error } = await supabase
      .from('cows')
      .update({ image_url: newImageUrl })
      .eq('id', cowId);

    if (error) {
      toast.error("Failed to update image");
      return;
    }

    setImages([newImageUrl, ...images]);
    setShowImageEditDialog(false);
    toast.success("Image updated successfully!");
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

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

    setMilkingStatus(newStatus);
    setAvgProduction(`${production}L/year`);
    toast.success("Milking details updated successfully!");
  };

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

    setDewormingStatus(status);
    setLastDewormingDate(date);
    toast.success("Deworming status updated successfully!");
  };

  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <div className="w-1/4">
          <div className="relative">
            <img 
              src={images[currentImageIndex]} 
              alt={cowData?.name} 
              className="w-full h-auto rounded-lg object-cover mb-4"
            />
            <div className="absolute top-0 right-0 p-2">
              <Dialog open={showImageEditDialog} onOpenChange={setShowImageEditDialog}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleImageEdit} className="space-y-4">
                    <Input name="imageUrl" placeholder="Enter image URL" />
                    <Button type="submit">Update Image</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateImage('prev')}
                disabled={currentImageIndex === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateImage('next')}
                disabled={currentImageIndex === images.length - 1}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">{cowData?.name}</h2>
        </div>
        
        <div className="w-3/4">
          <Tabs defaultValue="health" className="w-full">
            <TabsList>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="insemination">Insemination</TabsTrigger>
              <TabsTrigger value="milking">Milking</TabsTrigger>
              <TabsTrigger value="breeding-history">Breeding History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="health">
              <Card className="p-4">
                <form onSubmit={handleDewormingUpdate} className="space-y-4">
                  <h3 className="font-semibold mb-4">Health Records</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Deworming Status</label>
                      <Select name="status" defaultValue={dewormingStatus}>
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
                        defaultValue={lastDewormingDate}
                      />
                    </div>
                    <Button type="submit">Update Deworming Status</Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="insemination">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Current Insemination</h3>
                {breedingHistory.length > 0 ? (
                  <div className="space-y-2">
                    <p>Last Insemination: {breedingHistory[0].insemination_date}</p>
                    <p>Bull Semen: {breedingHistory[0].bull_semen}</p>
                    <p>Status: {breedingHistory[0].status}</p>
                    {breedingHistory[0].status === 'Success' && (
                      <p>Expected Calving: {breedingHistory[0].expected_calving_date}</p>
                    )}
                  </div>
                ) : (
                  <p>No insemination records found</p>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="milking">
              <Card className="p-4">
                <form onSubmit={handleMilkingUpdate} className="space-y-4">
                  <h3 className="font-semibold mb-4">Milking Records</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Select name="status" defaultValue={milkingStatus}>
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
                        defaultValue={parseFloat(avgProduction)}
                        type="number"
                        placeholder="e.g., 3000"
                      />
                    </div>
                    <Button type="submit">Update Milking Details</Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="breeding-history">
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
                          <Input type="date" name="inseminationDate" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Bull Semen</label>
                          <Input name="bullSemen" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <Select name="status" onValueChange={(value) => {
                            const form = document.querySelector('form');
                            if (form) {
                              const calfFields = form.querySelectorAll('[data-calf-field]');
                              calfFields.forEach((field: any) => {
                                field.style.display = value === 'Success' ? 'block' : 'none';
                              });
                            }
                          }}>
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
                        <div data-calf-field>
                          <label className="text-sm font-medium">Calf Name</label>
                          <Input name="calfName" />
                        </div>
                        <div data-calf-field>
                          <label className="text-sm font-medium">Calf Gender</label>
                          <Select name="calfGender">
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit">Add Record</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Insemination Date</TableHead>
                      <TableHead>Bull Semen</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expected Calving</TableHead>
                      <TableHead>Calf Name</TableHead>
                      <TableHead>Calf Gender</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {breedingHistory.map((record: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{record.insemination_date}</TableCell>
                        <TableCell>{record.bull_semen}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>{record.expected_calving_date || '-'}</TableCell>
                        <TableCell>{record.calf_name || '-'}</TableCell>
                        <TableCell>{record.calf_gender || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CowDetails;
