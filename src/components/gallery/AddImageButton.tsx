
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ImageModal from "./ImageModal";

const AddImageButton = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setShowAddModal(true)}
        className="neon-btn"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Image
      </Button>
      
      <ImageModal
        mode="add"
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </>
  );
};

export default AddImageButton;
