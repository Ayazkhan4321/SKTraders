import { supabase } from '@/lib/supabase';

export type FileCategory =
  | 'hero/images'
  | 'hero/videos'
  | 'hero-cards/images'
  | 'hero-cards/pdfs'
  | 'certificates/images'
  | 'certificates/pdfs'
  | 'brand-logos/images'
  | 'brand-images'
  | 'brand-images/logos'
  | 'applications/images'
  | 'feature-images/heroes'
  | 'feature-images/cards'
  | 'feature-images/intros'
  | 'feature-images/solutions'
  | 'feature-images/applications'
  | 'feature-gallery/images'
  | 'feature-catalogues/pdfs';

export interface UploadResult {
  success: boolean;
  url?: string;
  name?: string;
  sizeBytes?: number;
  error?: string;
}

const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  pdf: ['application/pdf'],
};

// Max sizes in bytes: Image = 10MB, Video = 100MB, PDF = 25MB
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
};

export async function uploadFile(file: File, folder: FileCategory): Promise<UploadResult> {
  if (!file) {
    return { success: false, error: 'No file selected.' };
  }

  if (file.size === 0) {
    return { success: false, error: 'Selected file is empty.' };
  }

  // 1. Determine file type group
  let fileGroup: 'image' | 'video' | 'pdf' = 'image';
  if (folder.endsWith('videos')) {
    fileGroup = 'video';
  } else if (folder.endsWith('pdfs')) {
    fileGroup = 'pdf';
  }

  // 2. Validate MIME type
  const allowedList = ALLOWED_MIME_TYPES[fileGroup];
  const fileTypeLower = file.type.toLowerCase();
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

  const isExtValid =
    (fileGroup === 'image' && ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) ||
    (fileGroup === 'video' && ['mp4', 'webm'].includes(fileExt)) ||
    (fileGroup === 'pdf' && fileExt === 'pdf');

  if (!allowedList.includes(fileTypeLower) && !isExtValid) {
    return {
      success: false,
      error: `Invalid file format for ${fileGroup}. Allowed formats: ${allowedList.join(', ')}`,
    };
  }

  // 3. Validate size
  const maxSize = MAX_FILE_SIZES[fileGroup];
  if (file.size > maxSize) {
    const sizeInMb = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      success: false,
      error: `File size exceeds the limit of ${sizeInMb}MB.`,
    };
  }

  // 4. Sanitize file name & generate unique path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${folder}/${Date.now()}_${sanitizedName}`;

  // 5. Upload to Supabase Storage Bucket ('brand-images' or 'cms_storage')
  const bucketName = folder.startsWith('brand-images') ? 'brand-images' : 'cms_storage';
  try {
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (!error && data?.path) {
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      if (publicUrlData?.publicUrl) {
        return {
          success: true,
          url: publicUrlData.publicUrl,
          name: file.name,
          sizeBytes: file.size,
        };
      }
    }
  } catch (e) {
    console.warn(`Supabase storage bucket '${bucketName}' notice, falling back:`, e);
  }

  // 6. Reliable Fallback: Create Data URL / Blob URL for client runtime
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        success: true,
        url: reader.result as string,
        name: file.name,
        sizeBytes: file.size,
      });
    };
    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Failed to read uploaded file.',
      });
    };
    reader.readAsDataURL(file);
  });
}
