import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import CarouselControls from "./CarouselControls";

interface CowImageCarouselProps {
  images: string[];
  onEdit?: () => void;
}

const CowImageCarousel = ({ images, onEdit }: CowImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    setDisplayImages(images?.length > 0 ? images : ['/placeholder.svg']);
  }, [images]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < displayImages.length - 1 ? prev + 1 : prev));
  };

  if (!displayImages || displayImages.length === 0) {
    return (
      <Card className="relative w-full h-64 flex items-center justify-center bg-gray-100">
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
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card className="relative w-full h-64 overflow-hidden">
        <img
          src={displayImages[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
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
      </Card>

      <CarouselControls
        currentIndex={currentIndex}
        totalImages={displayImages.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default CowImageCarousel;