import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";

const AddCow = () => {
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);

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
              <Label htmlFor="state">State</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="calf">Calf</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="milking-pregnant">Milking Pregnant</SelectItem>
                  <SelectItem value="milking">Milking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="milkingPerYear">Milking Per Year (Liters)</Label>
              <Input id="milkingPerYear" type="number" placeholder="Enter milking per year" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="images">Cow Images (Up to 3)</Label>
              <Input 
                id="images" 
                type="file" 
                multiple 
                accept="image/*"
                onChange={(e) => setSelectedImages(e.target.files)}
                className="cursor-pointer"
                required
              />
              <p className="text-sm text-gray-500">Select up to 3 images of the cow</p>
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