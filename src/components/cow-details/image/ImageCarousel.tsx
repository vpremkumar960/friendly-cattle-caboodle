import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, ChevronRight } from "lucide-react";
import CarouselControls from "./CarouselControls";
import ImageDisplay from "./ImageDisplay";

interface ImageCarouselProps {
  images: string[];
  onEdit?: () => void;
}

const ImageCarousel = ({ images, onEdit }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    setDisplayImages(images?.length > 0 ? images : ['/placeholder.svg']);
  }, [images]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < displayImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="relative group">
      <ImageDisplay 
        src={displayImages[currentIndex]} 
        alt={`Image ${currentIndex + 1}`}
      />
      
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      <CarouselControls
        currentIndex={currentIndex}
        totalImages={displayImages.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default ImageCarousel;