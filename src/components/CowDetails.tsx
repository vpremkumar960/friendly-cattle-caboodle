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
          {/* Health records content */}
        </Card>
      </TabsContent>
      <TabsContent value="insemination">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Insemination History</h3>
          {/* Insemination records content */}
        </Card>
      </TabsContent>
      <TabsContent value="milking">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Milking Records</h3>
          {/* Milking records content */}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CowDetails;