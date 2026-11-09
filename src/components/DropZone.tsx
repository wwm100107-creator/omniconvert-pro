import React, { useRef, useState } from 'react';
import { 
  IconUploadCloud, 
  IconImage, 
  IconAudio, 
  IconVideo, 
  IconFileText, 
  IconTable 
} from './Icons';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative rounded-2xl border border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/5 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition duration-300">
            <IconUploadCloud size={28} className="text-slate-300 group-hover:text-white transition" />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-white transition">
              Kéo & Thả tệp tin vào đây hoặc <span className="text-indigo-400 underline underline-offset-4">Chọn từ máy tính</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              Hỗ trợ chuyển đổi hàng loạt mọi định dạng tệp: Ảnh, Âm thanh, Video, Tài liệu, Bảng tính & Dữ liệu. Hệ thống tự động lọc và chỉ hiển thị định dạng tương thích 100%!
            </p>
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-4 border-t border-slate-800/80 w-full max-w-2xl">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 text-xs font-medium border border-slate-800">
              <IconImage inline size={14} />
              Ảnh: PNG, JPG, WEBP, BMP, ICO, SVG, PDF...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-cyan-400 text-xs font-medium border border-slate-800">
              <IconVideo inline size={14} />
              Video: MP4, WebM, MOV, MKV, AVI, GIF...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-medium border border-slate-800">
              <IconAudio inline size={14} />
              Âm thanh: MP3, WAV, OGG, AAC, FLAC...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-blue-400 text-xs font-medium border border-slate-800">
              <IconFileText inline size={14} />
              Tài liệu & Sơ đồ: DOCX, PDF, .IO, DRAWIO, MD...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-purple-400 text-xs font-medium border border-slate-800">
              <IconTable inline size={14} />
              Bảng tính: XLSX, XLS, CSV, TSV, JSON...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
