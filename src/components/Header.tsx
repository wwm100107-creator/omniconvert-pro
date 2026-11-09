import React from 'react';
import { IconShieldCheck, IconHelpCircle, IconLayers } from './Icons';
import { UyLogo } from './UyLogo';

interface HeaderProps {
  onOpenMatrix: () => void;
  onOpenLogic: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMatrix, onOpenLogic }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <UyLogo className="w-9 h-9 shrink-0 drop-shadow-sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-100">
                UyConvert
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                By Uy &bull; Minimalist
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Công cụ chuyển đổi tệp đa năng tối giản &bull; 100% In-Browser
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMatrix}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <IconLayers size={14} className="text-indigo-400" />
            <span>Tra cứu Ma trận Đuôi</span>
          </button>

          <button
            onClick={onOpenLogic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
          >
            <IconHelpCircle size={14} className="text-slate-400" />
            <span>Giải thích Logic (Tiếng Việt)</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <IconShieldCheck size={14} />
            <span>100% Riêng tư & Bảo mật</span>
          </div>
        </div>
      </div>
    </header>
  );
};
