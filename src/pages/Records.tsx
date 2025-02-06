
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List, Milk, Heart, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CowDetails from "@/components/CowDetails";
import { differenceInMonths } from "date-fns";
import { calculateAge } from "@/utils/dateUtils";
import CowAnimation from "@/components/animations/CowAnimation";

const Records = () => {
  const [cows, setCows] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCow, setSelectedCow] = useState<any>(null);
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

  const handleCowClick = (cow: any) => {
    setSelectedCow(cow);
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

  const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const months = differenceInMonths(new Date(), new Date(dob));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} months`;
    } else if (remainingMonths === 0) {
      return `${years} years`;
    } else {
      return `${years}.${Math.floor(remainingMonths / 12 * 10)} years`;
    }
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cows.map((cow) => (
        <Card
          key={cow.id}
          className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
          onClick={() => handleCowClick(cow)}
        >
          <div className="relative h-48 bg-gray-100">
            <img
              src={cow.image_url || '/placeholder.svg'}
              alt={cow.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              <Badge className="bg-white/90 text-black hover:bg-white">
                <Milk className="w-4 h-4 mr-1" />
                {cow.state || 'N/A'}
              </Badge>
              <Badge className="bg-white/90 text-black hover:bg-white">
                <Heart className="w-4 h-4 mr-1" />
                {cow.breed || 'N/A'}
              </Badge>
              <Badge className="bg-white/90 text-black hover:bg-white">
                <Activity className="w-4 h-4 mr-1" />
                {cow.deworming_status}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{cow.name}</h3>
                <p className="text-sm text-gray-500">Age: {calculateAge(cow.dob)}</p>
              </div>
              <Badge className={getHealthStatusColor(cow.deworming_status)}>
                {cow.deworming_status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Production</p>
                <p className="font-medium">{cow.milking_per_year || 'N/A'} L/year</p>
              </div>
              <div>
                <p className="text-gray-500">Last Deworming</p>
                <p className="font-medium">
                  {cow.last_deworming_date ? new Date(cow.last_deworming_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {cows.map((cow) => (
        <Card
          key={cow.id}
          className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleCowClick(cow)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={cow.image_url || '/placeholder.svg'}
                alt={cow.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{cow.name}</h3>
                  <p className="text-sm text-gray-500">{cow.breed}</p>
                </div>
                <Badge className={getHealthStatusColor(cow.deworming_status)}>
                  {cow.deworming_status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium">State</p>
                  <p className="text-sm text-gray-500">{cow.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Production</p>
                  <p className="text-sm text-gray-500">{cow.milking_per_year || 'N/A'} L/year</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Deworming</p>
                  <p className="text-sm text-gray-500">
                    {cow.last_deworming_date ? new Date(cow.last_deworming_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cow Records</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleAddCow}>
            <Plus className="w-4 h-4 mr-2" />
            Add Cow
          </Button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg">
        <CowAnimation />
      </div>

      {viewMode === 'grid' ? <GridView /> : <ListView />}

      <Dialog open={!!selectedCow} onOpenChange={(open) => !open && setSelectedCow(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cow Details</DialogTitle>
          </DialogHeader>
          {selectedCow && (
            <CowDetails
              cowId={selectedCow.id}
              cowData={selectedCow}
              onUpdate={() => {
                fetchCows();
                setSelectedCow(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

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
