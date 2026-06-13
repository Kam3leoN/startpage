const DEFAULT_MAX_BYTES = 256 * 1024;

/** Reads an image file as a data URL, rejecting files above maxBytes. */
export function readImageAsDataUrl(
  file: File,
  maxBytes = DEFAULT_MAX_BYTES
): Promise<string | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);
  if (file.size > maxBytes) return Promise.resolve(null);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : null);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
