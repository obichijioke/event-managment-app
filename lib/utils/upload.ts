import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(
  file: File,
  bucket: string = "general",
  folder: string = "uploads"
) {
  try {
    const supabase = createClient();

    // Generate a unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${uuidv4()}.${fileExt}`;

    // Upload the file
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return { url: publicUrl, path: fileName };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImage(path: string, bucket: string = "general") {
  try {
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export async function uploadMultipleImages(
  files: File[],
  bucket: string = "general",
  folder: string = "uploads"
) {
  try {
    const uploadPromises = files.map((file) =>
      uploadImage(file, bucket, folder)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
}
