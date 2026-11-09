import React, { useState } from 'react';
import { 
  IconClose, 
  IconSearch, 
  IconLayers, 
  IconCheck, 
  IconAlertTriangle 
} from './Icons';
import { CONVERSION_MATRIX, SUPPORTED_FORMATS } from '../lib/conversion-matrix';

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatrixModal: React.FC<MatrixModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const entries = Object.entries(CONVERSION_MATRIX).filter(([ext]) => {
    const meta = SUPPORTED_FORMATS[ext];
    const matchesSearch = ext.includes(searchTerm.toLowerCase()) || 
      meta?.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meta?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <IconLayers size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Ma Trận Định Dạng Tương Thích Tuyệt Đối
              </h3>
              <p className="text-xs text-slate-400">
                Chỉ những định dạng đích có trong ma trận này mới được phép hiển thị và chuyển đổi để tránh gây hỏng file
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 bg-slate-900/60">
          <div className="relative flex-1">
            <IconSearch size={16} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm đuôi file (ví dụ: png, mp4, docx, xlsx, io)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'image', 'video', 'audio', 'document', 'spreadsheet', 'data'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'Tất cả' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1 divide-y divide-slate-800/60">
          {entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Không tìm thấy định dạng nào khớp với bộ lọc
            </div>
          ) : (
            entries.map(([sourceExt, targetList]) => {
              const meta = SUPPORTED_FORMATS[sourceExt];
              return (
                <div key={sourceExt} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 w-60 shrink-0">
                    <span className="font-mono text-xs font-bold uppercase px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-indigo-300">
                      .{sourceExt}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {meta?.label || sourceExt}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {meta?.description || 'Tệp dữ liệu'}
                      </div>
                    </div>
                  </div>

                  {/* Target Formats Allowed */}
                  <div className="flex-1 flex flex-wrap items-center gap-1.5">
                    {targetList.map((target) => (
                      <span
                        key={target}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      >
                        <IconCheck size={12} />
                        .{target.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2 text-xs text-slate-400">
          <IconAlertTriangle size={16} className="text-amber-400 shrink-0" />
          <span>
            Quy tắc an toàn dữ liệu: Bất kỳ định dạng nào không nằm trong danh sách chuyển đổi hợp lệ ở trên sẽ <strong>hoàn toàn không được hiển thị</strong> trong menu để ngăn chặn việc người dùng tạo ra các tệp bị lỗi hoặc hỏng cấu trúc.
          </span>
        </div>
      </div>
    </div>
  );
};
