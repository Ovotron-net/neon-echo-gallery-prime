
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/types";
import { useImages } from "@/contexts/ImageContext";

interface ImageModalProps {
  mode: "add" | "edit" | "view";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image?: Image;
}

const ImageModal = ({ mode, open, onOpenChange, image }: ImageModalProps) => {
  const { addImage, updateImage } = useImages();
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    url: string;
  }>({
    title: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    if (image && (mode === "edit" || mode === "view")) {
      setFormData({
        title: image.title,
        description: image.description,
        url: image.url,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        url: "",
      });
    }
  }, [image, mode, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "add") {
      addImage(formData);
    } else if (mode === "edit" && image) {
      updateImage(image.id, formData);
    }
    
    onOpenChange(false);
  };

  const isViewOnly = mode === "view";
  const title = isViewOnly
    ? "Image Details"
    : mode === "add"
    ? "Add New Image"
    : "Edit Image";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neon-gray border-neon-green/30 text-white sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-neon-green font-medium">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {mode !== "view" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="url" className="text-gray-300">Image URL</Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    className="bg-neon-dark border-neon-green/30 focus-visible:ring-neon-green/50 text-white"
                  />
                </div>
                {formData.url && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-md border border-neon-green/20">
                    <img
                      src={formData.url}
                      alt="Preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL";
                      }}
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-gray-300">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Image title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="bg-neon-dark border-neon-green/30 focus-visible:ring-neon-green/50 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your image"
                    value={formData.description}
                    onChange={handleChange}
                    className="bg-neon-dark border-neon-green/30 focus-visible:ring-neon-green/50 text-white min-h-[100px]"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={formData.url}
                    alt={formData.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg text-neon-green">{formData.title}</h3>
                  <p className="text-gray-300">{formData.description}</p>
                  {image && (
                    <p className="text-xs text-gray-400">
                      Added on {image.createdAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {!isViewOnly && (
            <DialogFooter>
              <Button 
                type="submit" 
                className="neon-btn-filled"
              >
                {mode === "add" ? "Add Image" : "Save Changes"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
