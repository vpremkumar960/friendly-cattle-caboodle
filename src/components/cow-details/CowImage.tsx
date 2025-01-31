import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

  const handleImageEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newImageUrl = formData.get('imageUrl')?.toString() || '';

    const { error } = await supabase
      .from('cows')
      .update({ image_url: newImageUrl })
      .eq('id', cowId);

    if (error) {
      toast.error("Failed to update image");
      return;
    }

    setShowImageEditDialog(false);
    toast.success("Image updated successfully!");
    if (onUpdate) onUpdate();
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
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleImageEdit} className="space-y-4">
              <Input name="imageUrl" placeholder="Enter image URL" />
              <Button type="submit">Update Image</Button>
            </form>
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