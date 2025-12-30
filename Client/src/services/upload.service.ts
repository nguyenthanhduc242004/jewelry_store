const API_BASE_URL: string | undefined = (import.meta as any)?.env?.VITE_API_BASE_URL || undefined;

function buildUrl(path: string): string {
  if (API_BASE_URL) {
    return new URL(path, API_BASE_URL).toString();
  }
  return path;
}

async function uploadImage(file: File, options?: { signal?: AbortSignal }): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(buildUrl("/api/uploads"), {
    method: "POST",
    body: formData,
    credentials: "include",
    signal: options?.signal
  });

  if (!response.ok) {
    let message = "Failed to upload image";
    try {
      const data = await response.json();
      if (typeof data?.error === "string" && data.error.trim().length > 0) {
        message = data.error;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const data = (await response.json()) as { url?: string };
  if (!data.url) {
    throw new Error("Upload did not return a URL");
  }
  return data.url;
}

export const UploadService = {
  uploadImage
};
