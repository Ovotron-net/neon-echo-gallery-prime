
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageType } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import ImageModal from "./ImageModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface ImageCardProps {
  image: ImageType;
}

const ImageCard = ({ image }: ImageCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card 
        className="group overflow-hidden bg-neon-gray border-0 transition-all duration-300 neon-border neon-border-hover"
      >
        <CardContent className="p-0 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-t from-neon-dark/80 to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
          >
            <h3 className="text-white font-bold text-lg truncate">{image.title}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{image.description}</p>
          </div>
          <img
            src={image.url}
            alt={image.title}
            className="w-full aspect-square object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
            onClick={() => setShowDetails(true)}
          />
        </CardContent>
        <CardFooter className="p-2 flex justify-between bg-neon-gray border-t border-neon-green/20">
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-neon-green hover:bg-transparent"
            onClick={() => setShowEditModal(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-400 hover:text-red-500 hover:bg-transparent"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <ImageModal
        mode="view"
        open={showDetails}
        onOpenChange={setShowDetails}
        image={image}
      />

      <ImageModal
        mode="edit"
        open={showEditModal}
        onOpenChange={setShowEditModal}
        image={image}
      />

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        imageId={image.id}
        imageTitle={image.title}
      />
    </>
  );
};

export default ImageCard;
