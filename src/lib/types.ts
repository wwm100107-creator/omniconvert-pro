export type FileCategory = 
  | 'image' 
  | 'audio' 
  | 'video' 
  | 'document' 
  | 'spreadsheet' 
  | 'data' 
  | 'archive';

export interface FormatInfo {
  extension: string;
  name: string;
  category: FileCategory;
  mimeType: string;
  description: string;
}

export interface ConversionRule {
  from: string; // extension without dot
  targetFormats: string[]; // extensions without dot
  category: FileCategory;
  note?: string;
}

export type FileStatus = 'idle' | 'converting' | 'success' | 'error';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  category: FileCategory;
  targetFormat: string;
  availableFormats: string[];
  status: FileStatus;
  progress: number;
  resultBlob?: Blob;
  resultUrl?: string;
  resultName?: string;
  resultSize?: number;
  error?: string;
  previewUrl?: string;
}
