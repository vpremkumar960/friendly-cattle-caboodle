import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CowImageCarouselProps {
  images: string[];
  onEdit?: () => void;
}

const CowImageCarousel = ({ images = [], onEdit }: CowImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const hasMultipleImages = images.length > 1;

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (direction === 'next' && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (!images.length) {
    return (
      <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative group">
        <img 
          src={images[currentImageIndex]} 
          alt="Cow" 
          className="w-full h-64 object-cover rounded-lg cursor-pointer"
          onClick={() => setShowImageModal(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        
        {hasMultipleImages && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              disabled={currentImageIndex === 0}
              className="bg-white/80 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              disabled={currentImageIndex === images.length - 1}
              className="bg-white/80 hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <img 
              src={images[currentImageIndex]} 
              alt="Cow" 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            {hasMultipleImages && (
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigateImage('prev')}
                  disabled={currentImageIndex === 0}
                  className="bg-white/80 hover:bg-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => navigateImage('next')}
                  disabled={currentImageIndex === images.length - 1}
                  className="bg-white/80 hover:bg-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CowImageCarousel;