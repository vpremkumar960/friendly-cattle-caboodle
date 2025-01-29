import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CowDetails = ({ cowId, cowData }: { cowId: string; cowData: any }) => {
  return (
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
            <p>Last Checkup: {cowData?.lastCheckup || '2024-01-15'}</p>
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
          <h3 className="font-semibold mb-2">Milking Records</h3>
          <div className="space-y-2">
            <p>Average Production: {cowData?.avgProduction || '25L/day'}</p>
            <p>Last Week Average: {cowData?.lastWeekAvg || '23L/day'}</p>
            <p>Current Status: {cowData?.milkingStatus || 'Milking'}</p>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="breeding-history">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Breeding History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insemination Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Calf Birth Date</TableHead>
                <TableHead>Calf Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(cowData?.breedingHistory || []).map((record: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{record.inseminationDate}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.calfBirthDate || '-'}</TableCell>
                  <TableCell>{record.calfGender || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CowDetails;