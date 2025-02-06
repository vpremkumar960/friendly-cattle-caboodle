
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CowImage from "./cow-details/CowImage";
import HealthTab from "./cow-details/HealthTab";
import MilkingTab from "./cow-details/MilkingTab";
import BreedingHistoryTab from "./cow-details/BreedingHistoryTab";

const CowDetails = ({ cowId, cowData, onUpdate }: { cowId: string; cowData: any; onUpdate?: () => void }) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Combine main image and additional images
    const allImages = [
      cowData?.image_url,
      ...(cowData?.additional_images || [])
    ].filter(Boolean);
    
    setImages(allImages.length > 0 ? allImages : ["/placeholder.svg"]);
  }, [cowData]);

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <CowImage 
            cowId={cowId}
            images={images}
            onUpdate={onUpdate}
          />
          <h2 className="text-xl font-semibold mb-2">{cowData?.name}</h2>
        </div>
        
        <div className="w-full md:w-3/4">
          <Tabs defaultValue="health" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="milking">Milking</TabsTrigger>
              <TabsTrigger value="breeding-history">Breeding History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="health">
              <HealthTab
                cowId={cowId}
                initialStatus={cowData?.deworming_status}
                initialDate={cowData?.last_deworming_date}
                onUpdate={onUpdate}
              />
            </TabsContent>
            
            <TabsContent value="milking">
              <MilkingTab
                cowId={cowId}
                initialStatus={cowData?.state}
                initialProduction={cowData?.milking_per_year}
                onUpdate={onUpdate}
              />
            </TabsContent>

            <TabsContent value="breeding-history" className="overflow-x-auto">
              <BreedingHistoryTab
                cowId={cowId}
                onUpdate={onUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CowDetails;
