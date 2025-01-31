import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AddCow = () => {
  const [gender, setGender] = useState<string>("");
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      
      const newCow = {
        name: formData.get('name'),
        breed: formData.get('breed'),
        dob: formData.get('dob'),
        gender: formData.get('gender'),
        state: gender === 'male' ? 'Bull' : formData.get('state'),
        sire: formData.get('sire'),
        dam: formData.get('dam'),
        milking_per_year: gender === 'female' ? formData.get('milkingPerYear') : null,
      };

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userData.user.id)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('cows')
        .insert([{ ...newCow, user_id: profileData.id }])
        .select()
        .single();

      if (error) throw error;

      toast.success("Cow added successfully!");
      navigate('/records');
    } catch (error) {
      console.error('Error adding cow:', error);
      toast.error("Failed to add cow");
    } finally {
      setIsSubmitting(false);
    }
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
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Enter cow name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" name="breed" placeholder="Enter breed" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" onValueChange={setGender} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {gender === 'female' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select name="state" required>
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
                  <Input 
                    id="milkingPerYear" 
                    name="milkingPerYear" 
                    type="number" 
                    placeholder="Enter milking per year" 
                    required 
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="sire">Sire (Father)</Label>
              <Input id="sire" name="sire" placeholder="Enter sire name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dam">Dam (Mother)</Label>
              <Input id="dam" name="dam" placeholder="Enter dam name" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="images">Cow Images (Up to 3)</Label>
              <Input 
                id="images" 
                name="images"
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