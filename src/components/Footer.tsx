import React from 'react';
import { IconShieldCheck, IconHeart } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/70 py-8 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <IconShieldCheck size={16} className="text-emerald-400" />
          <span>
            UyConvert &bull; Bộ công cụ chuyển đổi tệp vạn năng chuẩn Uy Tín của Uy &bull; 100% Client-Side
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Tạo dựng bởi Uy &bull; WebAssembly & Web APIs</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            Made with <IconHeart size={14} className="text-rose-500" /> for Uy & everyone
          </span>
        </div>
      </div>
    </footer>
  );
};
