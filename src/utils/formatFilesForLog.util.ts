export function formatFilesForLog(files: any) {
  if (!files) return files;

  // If it's an array of files (like Multer often gives)
  if (Array.isArray(files)) {
    return files.map(({ buffer, ...rest }) => ({
      ...rest,
      buffer: buffer ? `<Buffer length=${buffer.length}>` : undefined, // replace buffer with metadata
    }));
  }

  // If it's an object with multiple file fields (profileImage, aadharImage, etc.)
  const sanitized: Record<string, any> = {};
  for (const key in files) {
    if (Array.isArray(files[key])) {
      sanitized[key] = files[key].map(({ buffer, ...rest }) => ({
        ...rest,
        buffer: buffer ? `<Buffer length=${buffer.length}>` : undefined,
      }));
    }
  }
  return sanitized;
}
