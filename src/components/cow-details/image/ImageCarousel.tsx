
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
    const imageArray = Array.isArray(images) ? images : [images];
    setDisplayImages(imageArray?.length > 0 ? imageArray.filter(Boolean) : ['/placeholder.svg']);
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
          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white/90"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {displayImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90"
            onClick={handleNext}
            disabled={currentIndex === displayImages.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {displayImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
