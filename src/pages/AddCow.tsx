import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AddCow = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Cow added successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Cow</h1>
        <p className="text-gray-500">Enter the details of the new cow</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tagNumber">Tag Number</Label>
              <Input id="tagNumber" placeholder="Enter tag number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" placeholder="Enter breed" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" placeholder="Enter weight" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sire">Sire</Label>
              <Input id="sire" placeholder="Enter sire details" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dam">Dam</Label>
              <Input id="dam" placeholder="Enter dam details" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Add Cow</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCow;