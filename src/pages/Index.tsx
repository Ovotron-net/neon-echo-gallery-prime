
import { ImageProvider } from "@/contexts/ImageContext";
import Gallery from "@/components/gallery/Gallery";
import AddImageButton from "@/components/gallery/AddImageButton";

const Index = () => {
  return (
    <ImageProvider>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-neon-green mb-2">
                  <span className="inline-block">Neon</span>
                  <span className="text-white ml-2">Gallery</span>
                </h1>
                <p className="text-gray-400 max-w-md">
                  A futuristic minimalist image collection with complete CRUD functionality
                </p>
              </div>
              <AddImageButton />
            </div>
          </header>

          <main>
            <Gallery />
          </main>
        </div>
      </div>
    </ImageProvider>
  );
};

export default Index;
