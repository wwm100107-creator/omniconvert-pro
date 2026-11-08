import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950/70 py-8 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            UyConvert Pro &bull; Bộ công cụ chuyển đổi tệp vạn năng chuẩn Uy Tín của Uy &bull; 100% Client-Side
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Tạo dựng bởi Uy &bull; WebAssembly & Web APIs</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Uy & everyone
          </span>
        </div>
      </div>
    </footer>
  );
};
