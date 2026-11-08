import React from 'react';
import { Sparkles, ShieldCheck, HelpCircle, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenMatrix: () => void;
  onOpenLogic: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMatrix, onOpenLogic }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
                UyConvert Pro
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                By Uy &bull; 100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bộ chuyển đổi tệp vạn năng của Uy &bull; Bảo toàn dữ liệu &bull; Chuẩn xác 100%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tra cứu Ma trận Đuôi</span>
          </button>

          <button
            onClick={onOpenLogic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
            <span>Giải thích Logic (Tiếng Việt)</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Riêng tư & Bảo mật</span>
          </div>
        </div>
      </div>
    </header>
  );
};
