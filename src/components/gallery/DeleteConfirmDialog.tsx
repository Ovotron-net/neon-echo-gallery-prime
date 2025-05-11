
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useImages } from "@/contexts/ImageContext";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageId: string;
  imageTitle: string;
}

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  imageId,
  imageTitle,
}: DeleteConfirmDialogProps) => {
  const { deleteImage } = useImages();

  const handleDelete = () => {
    deleteImage(imageId);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-neon-gray border-neon-green/30 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-neon-green">Delete Image</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to delete "{imageTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-gray-300 border-gray-600 hover:bg-neon-light hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-900/50 text-white hover:bg-red-900/80 border border-red-700/50"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
