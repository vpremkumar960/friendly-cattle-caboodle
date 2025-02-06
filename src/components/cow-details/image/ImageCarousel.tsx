
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageDisplay from "./ImageDisplay";

interface ImageCarouselProps {
  images: string[];
  onEdit?: () => void;
}

const ImageCarousel = ({ images = [], onEdit }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Filter out any null or undefined values and ensure we have an array
  const validImages = Array.isArray(images) 
    ? images.filter(Boolean) 
    : [images].filter(Boolean);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < validImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // If no valid images, show placeholder
  if (!validImages.length) {
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
      <div className="cursor-pointer" onClick={() => setShowImageModal(true)}>
        <ImageDisplay 
          src={validImages[currentIndex]} 
          alt={`Image ${currentIndex + 1}`}
        />
      </div>
      
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white/90"
          onClick={(e) => {
            e.stopPropagation();
            if (onEdit) onEdit();
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {validImages.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            disabled={currentIndex === 0}
            className="bg-white/80 hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={currentIndex === validImages.length - 1}
            className="bg-white/80 hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
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
              src={validImages[currentIndex]} 
              alt={`Image ${currentIndex + 1}`} 
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            {validImages.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handlePrevious()}
                  disabled={currentIndex === 0}
                  className="bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleNext()}
                  disabled={currentIndex === validImages.length - 1}
                  className="bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
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
