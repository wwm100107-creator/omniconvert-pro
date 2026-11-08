import JSZip from 'jszip';

export interface FileToZip {
  name: string;
  blob: Blob;
}

/**
 * Đóng gói danh sách file thành 1 file ZIP
 */
export async function createZipArchive(files: FileToZip[]): Promise<Blob> {
  const zip = new JSZip();

  for (const item of files) {
    zip.file(item.name, item.blob);
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });
}
