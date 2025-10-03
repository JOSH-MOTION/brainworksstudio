// lib/imagekit.ts
import ImageKit from 'imagekit';

// Initialize ImageKit client with environment variables
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
});

// Interface for upload response
interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
}

// Server-side upload helper
export async function uploadToImageKit(file: File | Buffer, fileName: string): Promise<UploadResponse> {
  try {
    // Ensure file is either a base64 string or Buffer
    let fileData: string | Buffer;
    if (file instanceof File) {
      const buffer = await file.arrayBuffer();
      fileData = Buffer.from(buffer).toString('base64'); // Convert File to base64 string
    } else {
      fileData = file; // Already a Buffer
    }

    const response = await imagekit.upload({
      file: fileData,
      fileName,
      folder: '/brain-works-studio',
      useUniqueFileName: true,
      tags: ['portfolio'],
    });

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
    };
  } catch (error: any) {
    console.error('ImageKit upload failed:', {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to upload image to ImageKit: ${error.message}`);
  }
}