import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CowDetails = ({ cowId, cowData }: { cowId: string; cowData: any }) => {
  const [breedingHistory, setBreedingHistory] = useState(cowData?.breedingHistory || []);
  const [showAddBreedingDialog, setShowAddBreedingDialog] = useState(false);
  const [milkingStatus, setMilkingStatus] = useState(cowData?.milkingStatus || 'Milking');
  const [avgProduction, setAvgProduction] = useState(cowData?.avgProduction || '25L/day');

  const handleAddBreedingRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord = {
      inseminationDate: formData.get('inseminationDate'),
      status: formData.get('status'),
      calfBirthDate: formData.get('calfBirthDate'),
      calfGender: formData.get('calfGender'),
      calfName: formData.get('calfName')
    };
    
    setBreedingHistory([...breedingHistory, newRecord]);
    setShowAddBreedingDialog(false);
    toast.success("Breeding record added successfully!");
  };

  const handleMilkingUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setMilkingStatus(formData.get('status') as string);
    setAvgProduction(formData.get('production') as string);
    toast.success("Milking details updated successfully!");
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/4">
        <img 
          src={cowData?.image || "/placeholder.svg"} 
          alt={cowData?.name} 
          className="w-full h-auto rounded-lg object-cover mb-4"
        />
        <h2 className="text-xl font-semibold mb-2">{cowData?.name}</h2>
        <p className="text-gray-600">ID: {cowId}</p>
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
              <h3 className="font-semibold mb-2">Health Records</h3>
              <div className="space-y-2">
                <p>Vaccination Status: {cowData?.vaccinationStatus || 'Up to date'}</p>
                <p>General Health: {cowData?.health || 'Good'}</p>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="insemination">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Current Insemination</h3>
              <div className="space-y-2">
                <p>Last Insemination: {cowData?.lastInsemination || '2024-01-15'}</p>
                <p>Bull Semen: {cowData?.bullSemen || 'HF-123'}</p>
                <p>Expected Calving: {cowData?.expectedCalving || '2024-10-30'}</p>
              </div>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Average Production</label>
                    <Input 
                      name="production" 
                      defaultValue={avgProduction}
                      placeholder="e.g., 25L/day"
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
                        <label className="text-sm font-medium">Status</label>
                        <Select name="status">
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Calf Birth Date</label>
                        <Input type="date" name="calfBirthDate" />
                      </div>
                      <div>
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
                      <div>
                        <label className="text-sm font-medium">Calf Name</label>
                        <Input name="calfName" />
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
                    <TableHead>Status</TableHead>
                    <TableHead>Calf Birth Date</TableHead>
                    <TableHead>Calf Gender</TableHead>
                    <TableHead>Calf Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breedingHistory.map((record: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{record.inseminationDate}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.calfBirthDate || '-'}</TableCell>
                      <TableCell>{record.calfGender || '-'}</TableCell>
                      <TableCell>{record.calfName || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CowDetails;