
import { createContext, useContext, useState, ReactNode } from "react";
import { Image } from "../types";
import { images as initialImages } from "../data/images";
import { useToast } from "@/components/ui/use-toast";

interface ImageContextType {
  images: Image[];
  addImage: (image: Omit<Image, "id" | "createdAt">) => void;
  updateImage: (id: string, image: Partial<Image>) => void;
  deleteImage: (id: string) => void;
  getImage: (id: string) => Image | undefined;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [images, setImages] = useState<Image[]>(initialImages);
  const { toast } = useToast();

  const addImage = (image: Omit<Image, "id" | "createdAt">) => {
    const newImage: Image = {
      ...image,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
    };
    setImages((prev) => [newImage, ...prev]);
    toast({
      title: "Image added",
      description: "The image has been added to your gallery",
    });
  };

  const updateImage = (id: string, updatedImage: Partial<Image>) => {
    setImages((prev) =>
      prev.map((image) =>
        image.id === id ? { ...image, ...updatedImage } : image
      )
    );
    toast({
      title: "Image updated",
      description: "The image details have been updated",
    });
  };

  const deleteImage = (id: string) => {
    setImages((prev) => prev.filter((image) => image.id !== id));
    toast({
      title: "Image deleted",
      description: "The image has been removed from your gallery",
    });
  };

  const getImage = (id: string) => {
    return images.find((image) => image.id === id);
  };

  return (
    <ImageContext.Provider
      value={{ images, addImage, updateImage, deleteImage, getImage }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImages must be used within an ImageProvider");
  }
  return context;
};
