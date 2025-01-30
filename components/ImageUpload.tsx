import { useState, useCallback } from "react";
import { uploadImage, deleteImage } from "@/lib/utils/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (url: string | string[]) => void;
  onDelete?: (url?: string) => void;
  defaultImage?: string;
  defaultImages?: string[];
  multiple?: boolean;
  bucket?: string;
  folder?: string;
  maxImages?: number;
}

export function ImageUpload({
  onUpload,
  onDelete,
  defaultImage,
  defaultImages,
  multiple = false,
  bucket = "images",
  folder = "uploads",
  maxImages = 10,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(
    multiple ? defaultImages || [] : defaultImage ? [defaultImage] : []
  );
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files?.length) return;

      try {
        setIsUploading(true);

        // Convert FileList to array and limit to maxImages if multiple
        const fileArray = Array.from(files);
        const filesToUpload = multiple
          ? fileArray.slice(0, maxImages - previews.length)
          : [fileArray[0]];

        // Upload all selected images
        const uploadPromises = filesToUpload.map(async (file) => {
          const objectUrl = URL.createObjectURL(file);
          const { url, path } = await uploadImage(file, bucket, folder);
          return { url, path, preview: objectUrl };
        });

        const results = await Promise.all(uploadPromises);

        if (multiple) {
          const newPreviews = [...previews, ...results.map((r) => r.preview)];
          const newPaths = [...imagePaths, ...results.map((r) => r.path)];
          const newUrls = results.map((r) => r.url);

          setPreviews(newPreviews);
          setImagePaths(newPaths);
          onUpload([...previews, ...newUrls]);
        } else {
          setPreviews([results[0].preview]);
          setImagePaths([results[0].path]);
          onUpload(results[0].url);
        }
      } catch (error) {
        console.error("Error uploading image(s):", error);
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, folder, multiple, maxImages, previews, imagePaths, onUpload]
  );

  const handleDelete = useCallback(
    async (index: number) => {
      if (!imagePaths[index]) return;

      try {
        setIsUploading(true);
        await deleteImage(imagePaths[index], bucket);

        const newPreviews = previews.filter((_, i) => i !== index);
        const newPaths = imagePaths.filter((_, i) => i !== index);

        setPreviews(newPreviews);
        setImagePaths(newPaths);

        if (multiple) {
          onDelete?.(previews[index]);
        } else {
          onDelete?.();
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [bucket, imagePaths, previews, multiple, onDelete]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading || (multiple && previews.length >= maxImages)}
            multiple={multiple}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed disabled:opacity-0"
          />
          <Button
            variant="outline"
            className={cn(
              "relative w-full flex items-center gap-2",
              multiple &&
                previews.length >= maxImages &&
                "opacity-50 cursor-not-allowed"
            )}
            disabled={isUploading || (multiple && previews.length >= maxImages)}
          >
            <ImagePlus className="h-4 w-4" />
            {isUploading
              ? "Uploading..."
              : multiple
              ? previews.length >= maxImages
                ? "Maximum Images Reached"
                : "Add Images"
              : "Add Image"}
          </Button>
        </div>
        {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>

      {multiple && (
        <p
          className={cn(
            "text-sm",
            previews.length >= maxImages
              ? "text-destructive font-medium"
              : "text-muted-foreground"
          )}
        >
          {previews.length} of {maxImages} images uploaded
          {previews.length >= maxImages && " (Maximum reached)"}
        </p>
      )}

      {previews.length > 0 && (
        <div
          className={`grid ${
            multiple
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          } gap-4`}
        >
          {previews.map((preview, index) => (
            <div
              key={preview}
              className="group relative aspect-video bg-muted rounded-lg overflow-hidden"
            >
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(index)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
