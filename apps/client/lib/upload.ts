const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export function isValidVideoFile(file: File): boolean {
  if (!file) return false;

  if (!VIDEO_TYPES.includes(file.type)) {
    throw new Error('Invalid video format. Please upload MP4, MOV, AVI, or WebM files.');
  }

  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`Video file too large. Maximum size is ${MAX_VIDEO_SIZE / (1024 * 1024)}MB.`);
  }

  return true;
}

export function isValidImageFile(file: File): boolean {
  if (!file) return false;

  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('Invalid image format. Please upload JPG, PNG, WebP, or GIF files.');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image file too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`);
  }

  return true;
}

export async function uploadFile(file: File, type: 'video' | 'image' = 'image'): Promise<string> {
  try {
    if (type === 'video') {
      isValidVideoFile(file);
    } else {
      isValidImageFile(file);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const userData = localStorage.getItem('moovefit-user');
    let authToken = '';
    if (userData) {
      const user = JSON.parse(userData);
      authToken = user.token || '';
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';
    const response = await fetch(`${apiUrl}/api/upload`, {
      method: 'POST',
      headers: {
        ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.url || data.fileUrl || '';
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
