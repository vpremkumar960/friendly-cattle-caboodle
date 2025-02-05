interface ImageDisplayProps {
  src: string;
  alt: string;
}

const ImageDisplay = ({ src, alt }: ImageDisplayProps) => {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-lg">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-opacity duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder.svg';
        }}
      />
    </div>
  );
};

export default ImageDisplay;