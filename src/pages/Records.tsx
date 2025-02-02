import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Records = () => {
  const [cows, setCows] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCows();
  }, []);

  const fetchCows = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCows(data || []);
    } catch (error) {
      console.error('Error fetching cows:', error);
      toast.error("Failed to fetch cow records");
    }
  };

  const handleAddCow = () => {
    navigate('/add-cow');
  };

  const handleCowClick = (cowId: string) => {
    navigate(`/cow/${cowId}`);  // Updated route path
  };

  const getHealthStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'not done':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <Button onClick={handleAddCow}>
          <Plus className="w-4 h-4 mr-2" />
          Add Cow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cows.map((cow) => (
          <Card
            key={cow.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCowClick(cow.id)}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  {cow.image_url && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(cow.image_url);
                      }}
                      className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                    >
                      <img 
                        src={cow.image_url} 
                        alt={cow.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{cow.name}</h3>
                    <p className="text-sm text-gray-500">{cow.breed}</p>
                  </div>
                </div>
                <Badge className={getHealthStatusColor(cow.deworming_status)}>
                  {cow.deworming_status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">State</p>
                  <p className="text-sm text-gray-500">{cow.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Production (L/year)</p>
                  <p className="text-sm text-gray-500">{cow.milking_per_year || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-gray-500">{cow.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Deworming</p>
                  <p className="text-sm text-gray-500">
                    {cow.last_deworming_date ? new Date(cow.last_deworming_date).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Cow" 
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Records;