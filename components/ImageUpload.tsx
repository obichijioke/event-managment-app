import { useState, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/utils/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onDelete?: () => void;
  defaultImage?: string;
  bucket?: string;
  folder?: string;
}

export function ImageUpload({
  onUpload,
  onDelete,
  defaultImage,
  bucket = "images",
  folder = "uploads",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Upload image
        const { url, path } = await uploadImage(file, bucket, folder);
        setImagePath(path);
        onUpload(url);
      } catch (error) {
        console.error("Error uploading image:", error);
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, folder, onUpload]
  );

  const handleDelete = useCallback(async () => {
    if (!imagePath) return;

    try {
      setIsUploading(true);
      await deleteImage(imagePath, bucket);
      setPreview(null);
      setImagePath(null);
      onDelete?.();
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsUploading(false);
    }
  }, [bucket, imagePath, onDelete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="max-w-xs"
        />
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {preview && (
        <div className="relative w-full max-w-xs">
          <div className="relative aspect-video">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2"
            onClick={handleDelete}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
