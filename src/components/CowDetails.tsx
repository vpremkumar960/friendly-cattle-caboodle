import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const CowDetails = ({ cowId }: { cowId: string }) => {
  return (
    <Tabs defaultValue="health" className="w-full">
      <TabsList>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="insemination">Insemination</TabsTrigger>
        <TabsTrigger value="milking">Milking</TabsTrigger>
      </TabsList>
      <TabsContent value="health">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Health Records</h3>
          <div className="space-y-2">
            <p>Last Checkup: 2024-01-15</p>
            <p>Vaccination Status: Up to date</p>
            <p>General Health: Good</p>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="insemination">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Insemination History</h3>
          <div className="space-y-2">
            <p>Last Insemination: 2024-01-15</p>
            <p>Bull Semen: HF-123</p>
            <p>Expected Calving: 2024-10-30</p>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="milking">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Milking Records</h3>
          <div className="space-y-2">
            <p>Average Production: 25L/day</p>
            <p>Last Week Average: 23L/day</p>
            <p>Current Status: Milking</p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CowDetails;