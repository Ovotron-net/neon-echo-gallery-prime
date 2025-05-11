
import { useState, useEffect, useRef } from "react";
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
import { Upload, ImagePlus } from "lucide-react";

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
    source?: 'url' | 'upload';
  }>({
    title: "",
    description: "",
    url: "",
  });
  
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('url');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (image && (mode === "edit" || mode === "view")) {
      setFormData({
        title: image.title,
        description: image.description,
        url: image.url,
        source: image.source || 'url',
      });
      setPreviewUrl(image.url);
      setUploadType(image.source || 'url');
    } else {
      setFormData({
        title: "",
        description: "",
        url: "",
      });
      setPreviewUrl('');
      setUploadType('url');
    }
  }, [image, mode, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a FileReader to read the image file
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      setFormData(prev => ({ 
        ...prev, 
        url: dataUrl,
        source: 'upload'
      }));
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "add") {
      addImage({
        ...formData,
        source: uploadType
      });
    } else if (mode === "edit" && image) {
      updateImage(image.id, formData);
    }
    
    onOpenChange(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const switchToUrlUpload = () => {
    setUploadType('url');
    setPreviewUrl('');
    setFormData(prev => ({
      ...prev,
      url: '',
      source: 'url'
    }));
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
                {mode === "add" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={uploadType === 'url' ? "default" : "outline"}
                      className={`${uploadType === 'url' ? 'bg-neon-green text-black' : 'border-neon-green/30 text-neon-green'}`}
                      onClick={switchToUrlUpload}
                    >
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={uploadType === 'upload' ? "default" : "outline"}
                      className={`${uploadType === 'upload' ? 'bg-neon-green text-black' : 'border-neon-green/30 text-neon-green'}`}
                      onClick={() => setUploadType('upload')}
                    >
                      Upload
                    </Button>
                  </div>
                )}
                
                {uploadType === 'url' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="url" className="text-gray-300">Image URL</Label>
                    <Input
                      id="url"
                      name="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.url}
                      onChange={handleChange}
                      required={uploadType === 'url'}
                      className="bg-neon-dark border-neon-green/30 focus-visible:ring-neon-green/50 text-white"
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <div 
                      className="border-2 border-dashed border-neon-green/30 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-neon-green/50 transition-colors"
                      onClick={triggerFileInput}
                    >
                      {previewUrl ? (
                        <div className="w-full aspect-video relative overflow-hidden rounded-md">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <ImagePlus className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-neon-green mb-2" />
                          <p className="text-gray-300 text-sm">Click to upload an image</p>
                          <p className="text-gray-400 text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {(formData.url || previewUrl) && uploadType === 'url' && (
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
                disabled={isUploading || (uploadType === 'url' && !formData.url) || (uploadType === 'upload' && !previewUrl)}
              >
                {isUploading ? "Uploading..." : mode === "add" ? "Add Image" : "Save Changes"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
