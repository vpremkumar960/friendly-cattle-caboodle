import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CowImageProps {
  cowId: string;
  images: string[];
  onUpdate?: () => void;
}

const CowImage = ({ cowId, images, onUpdate }: CowImageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageEditDialog, setShowImageEditDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        toast.error("You must be logged in to upload images");
        return;
      }

      // Upload the file
      const fileExt = file.name.split('.').pop();
      const fileName = `${cowId}-${Date.now()}.${fileExt}`;
      const { error: uploadError, data } = await supabase
        .storage
        .from('cow-images')
        .upload(fileName, file, {
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('cow-images')
        .getPublicUrl(fileName);

      // Update the cow record with the new image URL
      const { error: updateError } = await supabase
        .from('cows')
        .update({ image_url: publicUrl })
        .eq('id', cowId)
        .eq('user_id', user.id); // Add user_id check

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

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div className="relative">
      <img 
        src={images[currentImageIndex]} 
        alt="Cow" 
        className="w-full h-auto rounded-lg object-cover mb-4"
      />
      <div className="absolute top-0 right-0 p-2">
        <Dialog open={showImageEditDialog} onOpenChange={setShowImageEditDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
              <DialogDescription>
                Choose an image file to upload for this cow.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Select Image"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateImage('prev')}
          disabled={currentImageIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateImage('next')}
          disabled={currentImageIndex === images.length - 1}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CowImage;