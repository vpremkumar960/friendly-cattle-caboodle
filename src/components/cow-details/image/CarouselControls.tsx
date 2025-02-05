import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselControlsProps {
  currentIndex: number;
  totalImages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const CarouselControls = ({ 
  currentIndex, 
  totalImages, 
  onPrevious, 
  onNext 
}: CarouselControlsProps) => {
  if (totalImages <= 1) return null;

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-opacity ${
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-opacity ${
          currentIndex === totalImages - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}
        onClick={onNext}
        disabled={currentIndex === totalImages - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {Array.from({ length: totalImages }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default CarouselControls;