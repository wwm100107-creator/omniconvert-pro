import React, { useRef, useState } from 'react';
import { UploadCloud, Image, Music, Video, FileText, Table } from 'lucide-react';

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
        className={`group relative rounded-2xl border-2 border-dashed p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-500/10 shadow-2xl shadow-indigo-500/20 scale-[1.01]'
            : 'border-slate-700 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/70 shadow-lg'
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition duration-300">
            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition" />
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition">
              Kéo & Thả tệp tin vào đây hoặc <span className="text-indigo-400 underline underline-offset-4">Chọn từ máy tính</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              Hỗ trợ chuyển đổi hàng loạt mọi định dạng tệp: Ảnh, Âm thanh, Video, Tài liệu, Bảng tính & Dữ liệu. Hệ thống sẽ tự động lọc và chỉ hiển thị định dạng tương thích 100%!
            </p>
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-4 border-t border-slate-800/80 w-full max-w-2xl">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              <Image className="w-3.5 h-3.5" />
              Ảnh: PNG, JPG, WEBP, BMP, ICO, SVG, PDF...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
              <Video className="w-3.5 h-3.5" />
              Video: MP4, WebM, MOV, MKV, AVI, GIF...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              <Music className="w-3.5 h-3.5" />
              Âm thanh: MP3, WAV, OGG, AAC, FLAC...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              <FileText className="w-3.5 h-3.5" />
              Tài liệu: DOCX, TXT, MD, HTML, PDF...
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
              <Table className="w-3.5 h-3.5" />
              Bảng tính: XLSX, XLS, CSV, TSV, JSON...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
