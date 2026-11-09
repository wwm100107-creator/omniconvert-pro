import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { UyLogo } from './components/UyLogo';
import { DropZone } from './components/DropZone';
import { FileCard } from './components/FileCard';
import { MatrixModal } from './components/MatrixModal';
import { LogicExplanationModal } from './components/LogicExplanationModal';
import { PreviewModal } from './components/PreviewModal';
import { Footer } from './components/Footer';
import type { FileItem } from './lib/types';
import { getFileCategory, getValidTargetFormats } from './lib/conversion-matrix';
import { executeConversion } from './lib/converterEngine';
import { createZipArchive } from './lib/converters/archiveConverter';
import { 
  IconPlay, 
  IconArchive, 
  IconTrash, 
  IconRefresh, 
  IconShieldCheck, 
  IconZap, 
  IconLayers 
} from './components/Icons';

export const App: React.FC = () => {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [isLogicOpen, setIsLogicOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null);

  // Xử lý khi có file mới được chọn hoặc kéo thả
  const handleFilesSelected = (newFiles: File[]) => {
    const items: FileItem[] = newFiles.map((f) => {
      const parts = f.name.split('.');
      const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
      const category = getFileCategory(ext);
      const availableFormats = getValidTargetFormats(ext);
      const targetFormat = availableFormats.length > 0 ? availableFormats[0] : '';

      return {
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: f.size,
        extension: ext,
        category,
        targetFormat,
        availableFormats,
        status: 'idle',
        progress: 0,
      };
    });

    setFileList((prev) => [...prev, ...items]);
  };

  // Thay đổi đuôi đích cho 1 file
  const handleChangeTarget = (id: string, target: string) => {
    setFileList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, targetFormat: target } : item))
    );
  };

  // Xóa 1 file
  const handleRemove = (id: string) => {
    setFileList((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item?.resultUrl) {
        URL.revokeObjectURL(item.resultUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  // Xóa toàn bộ file
  const handleClearAll = () => {
    fileList.forEach((item) => {
      if (item.resultUrl) URL.revokeObjectURL(item.resultUrl);
    });
    setFileList([]);
  };

  // Chuyển đổi 1 file đơn lẻ
  const handleConvertSingle = async (id: string) => {
    const targetItem = fileList.find((i) => i.id === id);
    if (!targetItem || !targetItem.targetFormat) return;

    setFileList((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'converting', progress: 10, error: undefined } : i))
    );

    try {
      const result = await executeConversion(targetItem.file, targetItem.targetFormat, (percent) => {
        setFileList((prev) =>
          prev.map((i) => (i.id === id ? { ...i, progress: percent } : i))
        );
      });

      const url = URL.createObjectURL(result.blob);

      setFileList((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'success',
                progress: 100,
                resultBlob: result.blob,
                resultUrl: url,
                resultName: result.fileName,
                resultSize: result.size,
              }
            : i
        )
      );

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err: any) {
      setFileList((prev) =>
        prev.map((i) =>
          i.id === id
            ? {
                ...i,
                status: 'error',
                progress: 0,
                error: err?.message || 'Lỗi không xác định khi chuyển đổi',
              }
            : i
        )
      );
    }
  };

  // Chuyển đổi tất cả file hợp lệ
  const handleConvertAll = async () => {
    const pendingItems = fileList.filter(
      (i) => i.status !== 'success' && i.availableFormats.length > 0 && i.targetFormat
    );

    if (pendingItems.length === 0) return;

    setIsConvertingAll(true);

    for (const item of pendingItems) {
      await handleConvertSingle(item.id);
    }

    setIsConvertingAll(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Tải về tất cả file đã hoàn thành dưới dạng file ZIP
  const handleDownloadAllZip = async () => {
    const completedItems = fileList.filter((i) => i.status === 'success' && i.resultBlob && i.resultName);
    if (completedItems.length === 0) return;

    const filesToZip = completedItems.map((i) => ({
      name: i.resultName!,
      blob: i.resultBlob!,
    }));

    const zipBlob = await createZipArchive(filesToZip);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UyConvert_Batch_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalFiles = fileList.length;
  const completedFiles = fileList.filter((i) => i.status === 'success').length;
  const canConvertAny = fileList.some((i) => i.status === 'idle' && i.availableFormats.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Header
        onOpenMatrix={() => setIsMatrixOpen(true)}
        onOpenLogic={() => setIsLogicOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-3.5">
          <div className="flex justify-center">
            <UyLogo className="w-14 h-14" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
            <IconZap size={14} className="text-indigo-400" />
            <span>UyConvert &bull; Minimalist File Transcoding &bull; By Uy</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Chuyển Đổi Mọi Định Dạng Cùng <span className="text-slate-300">Uy</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hệ thống chuyển đổi file đa định dạng tối giản: Xử lý trực tiếp trên trình duyệt, bảo toàn dữ liệu 100%, không bị lỗi, không tải lên server.
          </p>
        </div>

        {/* DropZone */}
        <DropZone onFilesSelected={handleFilesSelected} />

        {/* File List Section */}
        {totalFiles > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="font-semibold text-slate-100">{totalFiles} tệp đã chọn</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-medium">{completedFiles} hoàn tất</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {completedFiles > 0 && (
                  <button
                    onClick={handleDownloadAllZip}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-emerald-600/30 transition"
                  >
                    <IconArchive size={14} />
                    <span>Tải về tất cả (.ZIP)</span>
                  </button>
                )}

                {canConvertAny && (
                  <button
                    onClick={handleConvertAll}
                    disabled={isConvertingAll}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {isConvertingAll ? (
                      <IconRefresh size={14} className="animate-spin" />
                    ) : (
                      <IconPlay size={14} />
                    )}
                    <span>Chuyển đổi tất cả</span>
                  </button>
                )}

                <button
                  onClick={handleClearAll}
                  disabled={isConvertingAll}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                >
                  <IconTrash size={14} />
                  <span>Xóa hết</span>
                </button>
              </div>
            </div>

            {/* List of cards */}
            <div className="space-y-3">
              {fileList.map((item) => (
                <FileCard
                  key={item.id}
                  item={item}
                  onChangeTarget={handleChangeTarget}
                  onConvertSingle={handleConvertSingle}
                  onRemove={handleRemove}
                  onPreview={(previewTarget) => setPreviewItem(previewTarget)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-900">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IconShieldCheck size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Không Bao Giờ Lỗi File</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mã hóa lại cấu trúc nhị phân thực thụ theo chuẩn IANA & W3C, không dùng thủ thuật đổi đuôi giả mạo gây hỏng tệp.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <IconLayers size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">Bộ Lọc Ma Trận Động</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tự động phân loại định dạng và chỉ hiển thị các đuôi đích có khả năng chuyển đổi thành công.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <IconZap size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-200">100% In-Browser & Bảo Mật</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Xử lý hoàn toàn trong trình duyệt của bạn với WebAssembly và Web APIs. Tệp không bao giờ gửi ra máy chủ ngoài.
            </p>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <MatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />

      <LogicExplanationModal
        isOpen={isLogicOpen}
        onClose={() => setIsLogicOpen(false)}
      />

      <PreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};

export default App;
