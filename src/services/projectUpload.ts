import { getClerkToken } from '@/services/authToken';

export const PROJECT_FILE_MAX_BYTES = 5 * 1024 * 1024;
export const PROJECT_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? '';

/** Uploads one file straight to R2 through an LMS presigned URL and returns the stored `/api/files/...` path. */
export async function uploadProjectFile(
  file: { uri: string; name: string; mimeType?: string },
  projectId: string,
  stageId: string,
): Promise<string> {
  const blob = await (await fetch(file.uri)).blob();
  if (blob.size > PROJECT_FILE_MAX_BYTES) throw new Error('File must be 5 MB or smaller.');
  const contentType = file.mimeType ?? blob.type;
  if (!PROJECT_FILE_TYPES.includes(contentType)) throw new Error('Use a PNG, JPG, WebP or PDF file.');

  const token = await getClerkToken();
  const presign = await fetch(`${apiBaseUrl}/api/upload/presign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token ?? ''}` },
    // The size is signed into the URL, so it must match the bytes we send.
    body: JSON.stringify({
      type: 'projectSubmission',
      filename: file.name,
      contentType,
      projectId,
      stageId,
      size: blob.size,
    }),
  });
  if (!presign.ok) {
    const body = (await presign.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Could not start the upload.');
  }
  const { uploadUrl, publicUrl } = (await presign.json()) as { uploadUrl: string; publicUrl: string };

  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: blob });
  if (!put.ok) throw new Error('Upload failed. Please try again.');
  return publicUrl;
}
