import { useState } from "react";
import { useImages } from "@/contexts/ImageContext";
import ImageCard from "./ImageCard";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ThumbsUp, Sparkles } from "lucide-react";

type SortOption = "newest" | "votes" | "alphabetical";

const Gallery = () => {
  const { images } = useImages();
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // We're going to sort client-side here for now
  // In a real application with many images, this would be done server-side
  // with proper pagination
  const sortedImages = [...images].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    // For the "votes" option, we would ideally fetch the vote counts from the backend
    // For now, we'll just keep the default sort (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-8 border border-dashed border-neon-green/30 rounded-lg p-8">
        <h3 className="text-xl font-medium text-gray-300">No images yet</h3>
        <p className="text-gray-400 mt-2">Add your first image to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={sortOption === "newest" ? "default" : "outline"}
          onClick={() => setSortOption("newest")}
          className="flex items-center gap-1 text-xs"
        >
          <Sparkles className="h-3 w-3" />
          Newest
        </Button>
        <Button
          size="sm"
          variant={sortOption === "votes" ? "default" : "outline"}
          onClick={() => setSortOption("votes")}
          className="flex items-center gap-1 text-xs"
        >
          <ThumbsUp className="h-3 w-3" />
          Most Popular
        </Button>
        <Button
          size="sm"
          variant={sortOption === "alphabetical" ? "default" : "outline"}
          onClick={() => setSortOption("alphabetical")}
          className="flex items-center gap-1 text-xs"
        >
          <ArrowDownAZ className="h-3 w-3" />
          A-Z
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {sortedImages.map((image) => (
          <ImageCard key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
