import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Edit, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImageCarouselProps {
  images: string[];
  onEdit?: () => void;
}

const ImageCarousel = ({ images, onEdit }: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

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
      <div 
        className="cursor-pointer"
        onClick={() => setShowImageModal(true)}
      >
        <img 
          src={images[currentImageIndex]} 
          alt="Cow" 
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
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

      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-4">
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
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
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

export default ImageCarousel;