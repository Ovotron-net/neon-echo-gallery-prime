
import { useImages } from "@/contexts/ImageContext";
import ImageCard from "./ImageCard";

const Gallery = () => {
  const { images } = useImages();

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-8 border border-dashed border-neon-green/30 rounded-lg p-8">
        <h3 className="text-xl font-medium text-gray-300">No images yet</h3>
        <p className="text-gray-400 mt-2">Add your first image to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in">
      {images.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};

export default Gallery;
