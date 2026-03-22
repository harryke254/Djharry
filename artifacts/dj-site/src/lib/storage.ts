import { requestUploadUrl } from "@workspace/api-client-react";

export function getStorageUrl(objectPath?: string | null): string {
  if (!objectPath) return `${import.meta.env.BASE_URL}images/default-cover.png`;
  if (objectPath.startsWith('http')) return objectPath;
  return `/api/storage${objectPath}`;
}

export async function uploadFile(file: File, onProgress?: (p: number) => void): Promise<string> {
  // 1. Request presigned URL from our API
  const res = await requestUploadUrl({
    name: file.name,
    size: file.size,
    contentType: file.type || 'application/octet-stream'
  });

  // 2. Perform direct PUT to Google Cloud Storage
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", res.uploadURL, true);
    xhr.setRequestHeader("Content-Type", file.type || 'application/octet-stream');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(res.objectPath);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred during file upload"));
    };

    xhr.send(file);
  });
}
