import React from 'react';
import type { FileItem } from '../lib/types';
import { 
  IconImage, 
  IconAudio, 
  IconVideo, 
  IconFileText, 
  IconTable, 
  IconCode, 
  IconArchive, 
  IconArrowRight, 
  IconDownload, 
  IconTrash, 
  IconCheckCircle, 
  IconAlertCircle, 
  IconLoader,
  IconEye
} from './Icons';

interface FileCardProps {
  item: FileItem;
  onChangeTarget: (id: string, target: string) => void;
  onConvertSingle: (id: string) => void;
  onRemove: (id: string) => void;
  onPreview: (item: FileItem) => void;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const FileCard: React.FC<FileCardProps> = ({
  item,
  onChangeTarget,
  onConvertSingle,
  onRemove,
  onPreview,
}) => {
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'image':
        return <IconImage size={20} className="text-emerald-400" />;
      case 'video':
        return <IconVideo size={20} className="text-cyan-400" />;
      case 'audio':
        return <IconAudio size={20} className="text-amber-400" />;
      case 'spreadsheet':
        return <IconTable size={20} className="text-purple-400" />;
      case 'data':
        return <IconCode size={20} className="text-indigo-400" />;
      case 'archive':
        return <IconArchive size={20} className="text-rose-400" />;
      default:
        return <IconFileText size={20} className="text-blue-400" />;
    }
  };

  const getCategoryBadgeClass = () => {
    switch (item.category) {
      case 'image': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'video': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'audio': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'spreadsheet': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'data': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'archive': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const handleDownload = () => {
    if (!item.resultBlob || !item.resultName) return;
    const url = URL.createObjectURL(item.resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.resultName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasValidTargets = item.availableFormats.length > 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-md transition-all hover:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* File Info */}
        <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
          <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0 flex items-center justify-center">
            {getCategoryIcon()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-100 truncate" title={item.name}>
                {item.name}
              </h4>
              <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getCategoryBadgeClass()} shrink-0`}>
                {item.extension}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span>{formatFileSize(item.size)}</span>
              {item.resultSize && (
                <>
                  <span>&bull;</span>
                  <span className="text-emerald-400 font-medium">
                    Đích: {formatFileSize(item.resultSize)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Format Selector: CHỈ HIỂN THỊ ĐỊNH DẠNG ĐƯỢC PHÉP CHUYỂN */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-300 uppercase">
            .{item.extension}
          </div>

          <IconArrowRight size={14} className="text-slate-500" />

          {hasValidTargets ? (
            <select
              value={item.targetFormat}
              disabled={item.status === 'converting' || item.status === 'success'}
              onChange={(e) => onChangeTarget(item.id, e.target.value)}
              className="bg-slate-800 border border-indigo-500/50 hover:border-indigo-400 text-indigo-300 text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {item.availableFormats.map((fmt) => (
                <option key={fmt} value={fmt} className="bg-slate-900 text-slate-100">
                  .{fmt.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
              Không thể chuyển
            </span>
          )}
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center gap-2 shrink-0">
          {item.status === 'idle' && hasValidTargets && (
            <button
              onClick={() => onConvertSingle(item.id)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              Chuyển đổi
            </button>
          )}

          {item.status === 'converting' && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <IconLoader size={14} className="animate-spin" />
              <span>Đang xử lý {item.progress}%</span>
            </div>
          )}

          {item.status === 'success' && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <IconCheckCircle size={14} />
                <span>Xong</span>
              </span>

              {item.resultUrl && (
                <button
                  onClick={() => onPreview(item)}
                  title="Xem trước kết quả"
                  className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                >
                  <IconEye size={16} />
                </button>
              )}

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <IconDownload size={14} />
                <span>Tải về</span>
              </button>
            </div>
          )}

          {item.status === 'error' && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg" title={item.error}>
              <IconAlertCircle size={14} className="shrink-0" />
              <span className="truncate max-w-[150px]">{item.error || 'Lỗi chuyển đổi'}</span>
            </div>
          )}

          {/* Remove item */}
          <button
            onClick={() => onRemove(item.id)}
            disabled={item.status === 'converting'}
            title="Xóa tệp này"
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition disabled:opacity-40"
          >
            <IconTrash size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar khi converting */}
      {item.status === 'converting' && (
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
