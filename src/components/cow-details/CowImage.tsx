import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageCarousel from "./image/ImageCarousel";

interface CowImageProps {
  cowId: string;
  images: string[];
  onUpdate?: () => void;
}

const CowImage = ({ cowId, images = [], onUpdate }: CowImageProps) => {
  const [showImageEditDialog, setShowImageEditDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    setDisplayImages(images?.length > 0 ? images : ['/placeholder.svg']);
  }, [images]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("You must be logged in to upload images");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${cowId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase
        .storage
        .from('cow-images')
        .upload(fileName, file, {
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage
        .from('cow-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('cows')
        .update({ image_url: publicUrl })
        .eq('id', cowId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setShowImageEditDialog(false);
      toast.success("Image uploaded successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <ImageCarousel 
        images={displayImages}
        onEdit={() => setShowImageEditDialog(true)}
      />

      <Dialog open={showImageEditDialog} onOpenChange={setShowImageEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button 
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Select Image"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CowImage;