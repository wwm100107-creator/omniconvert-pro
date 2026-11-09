import React, { useEffect, useState } from 'react';
import { IconClose, IconDownload, IconFileText, IconCheckCircle } from './Icons';
import type { FileItem } from '../lib/types';
import { formatFileSize } from './FileCard';

interface PreviewModalProps {
  item: FileItem | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ item, onClose }) => {
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    if (!item?.resultBlob) {
      setTextContent(null);
      return;
    }

    const ext = item.targetFormat.toLowerCase();
    if (['txt', 'html', 'md', 'json', 'csv', 'tsv', 'xml', 'yaml', 'yml'].includes(ext)) {
      item.resultBlob.text().then((t) => setTextContent(t.slice(0, 50000))); // tối đa 50k ký tự
    } else {
      setTextContent(null);
    }
  }, [item]);

  if (!item || !item.resultBlob || !item.resultUrl) return null;

  const targetExt = item.targetFormat.toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'ico', 'svg'].includes(targetExt);
  const isAudio = ['mp3', 'wav', 'ogg', 'weba', 'aac'].includes(targetExt);
  const isVideo = ['mp4', 'webm'].includes(targetExt);

  const handleDownload = () => {
    if (!item.resultBlob || !item.resultName) return;
    const a = document.createElement('a');
    a.href = item.resultUrl!;
    a.download = item.resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-bold text-slate-100 truncate max-w-md">
                {item.resultName}
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                .{targetExt}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Dung lượng: {formatFileSize(item.resultSize || item.resultBlob.size)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <IconDownload size={14} />
              <span>Tải về</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <IconClose size={20} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="overflow-y-auto p-6 flex items-center justify-center min-h-[300px] bg-slate-950/40">
          {isImage && (
            <div className="flex flex-col items-center">
              <img
                src={item.resultUrl}
                alt={item.resultName}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
              />
            </div>
          )}

          {isAudio && (
            <div className="w-full max-w-md p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <IconCheckCircle size={24} />
              </div>
              <h4 className="font-semibold text-slate-200 text-sm mb-4">
                Phát thử âm thanh đã chuyển đổi
              </h4>
              <audio controls src={item.resultUrl} className="w-full" autoPlay />
            </div>
          )}

          {isVideo && (
            <div className="w-full max-w-xl">
              <video
                controls
                src={item.resultUrl}
                className="w-full rounded-lg border border-slate-800 shadow-xl"
              />
            </div>
          )}

          {textContent !== null && (
            <div className="w-full h-full">
              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 overflow-auto max-h-[60vh] whitespace-pre-wrap">
                {textContent}
              </pre>
            </div>
          )}

          {!isImage && !isAudio && !isVideo && textContent === null && (
            <div className="text-center py-12 text-slate-400">
              <IconFileText size={48} className="mx-auto text-indigo-400 mb-2 opacity-80" />
              <p className="text-sm font-medium text-slate-300">
                Tệp {targetExt.toUpperCase()} đã chuyển đổi thành công!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Nhấn nút Tải về ở trên để lưu tệp về máy tính của bạn.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
