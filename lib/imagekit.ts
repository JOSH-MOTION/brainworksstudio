// lib/imagekit.ts - FIXED VERSION
import ImageKit from 'imagekit';

// Initialize ImageKit client
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
}

// FIXED: Better file handling for large files
export async function uploadToImageKit(
  file: File | Buffer, 
  fileName: string, 
  folder: string = '/brain-works-studio'
): Promise<UploadResponse> {
  try {
    let fileData: string | Buffer;

    // Handle File objects
    if (file instanceof File) {
      // Check file size (max 25MB for ImageKit free tier)
      const MAX_SIZE = 25 * 1024 * 1024; // 25MB
      if (file.size > MAX_SIZE) {
        throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum of 25MB`);
      }

      // Convert to Buffer properly
      const arrayBuffer = await file.arrayBuffer();
      fileData = Buffer.from(arrayBuffer);
      
      console.log(`Uploading file: ${fileName}, Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    } else {
      fileData = file; // Already a Buffer
    }

    // Upload with retry logic
    let retries = 3;
    let lastError: Error | null = null;

    while (retries > 0) {
      try {
        const response = await imagekit.upload({
          file: fileData,
          fileName,
          folder,
          useUniqueFileName: true,
          tags: ['portfolio'],
        });

        console.log(`Successfully uploaded: ${fileName}`);
        return {
          url: response.url,
          fileId: response.fileId,
          name: response.name,
        };
      } catch (error: any) {
        lastError = error;
        retries--;
        if (retries > 0) {
          console.log(`Upload failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
    }

    throw lastError || new Error('Upload failed after multiple retries');
  } catch (error: any) {
    console.error('ImageKit upload failed:', {
      message: error.message,
      fileName,
    });
    throw new Error(`Failed to upload ${fileName}: ${error.message}`);
  }
}

// Server-side delete helper
export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
    console.log(`Deleted file ${fileId} from ImageKit`);
  } catch (error: any) {
    console.error('ImageKit deletion failed:', {
      message: error.message,
      fileId,
    });
    throw new Error(`Failed to delete file ${fileId}`);
  }
}

// Helper to validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 25 * 1024 * 1024; // 25MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum of 25MB`
    };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`
    };
  }

  return { valid: true };
}