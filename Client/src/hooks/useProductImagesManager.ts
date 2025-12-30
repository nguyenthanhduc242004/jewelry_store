import { useState } from "react";
import { UploadService } from "../services";

type ImageForm = {
  images: string[];
  mainImage: string;
};

export default function useProductImagesManager<T extends ImageForm>(
  setForm: React.Dispatch<React.SetStateAction<T>>,
) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddImage = async (file?: File) => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError(null);
    setDeleteError(null);

    try {
      const url = await UploadService.uploadImage(file);
      setForm((prev) => {
        const nextImages = [...prev.images, url];
        return {
          ...prev,
          images: nextImages,
          mainImage: prev.mainImage || url,
        };
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    setDeleteError(null);
    setForm((prev) => {
      const removedUrl = prev.images[index];
      const nextImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: nextImages,
        mainImage: prev.mainImage === removedUrl ? nextImages[0] ?? "" : prev.mainImage,
      };
    });
  };

  const setMainImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      mainImage: url,
    }));
  };

  return {
    uploading,
    uploadError,
    deleteError,
    handleAddImage,
    handleRemoveImage,
    setMainImage,
  };
}
