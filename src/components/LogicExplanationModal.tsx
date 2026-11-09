import React from 'react';
import { 
  IconCheckCircle, 
  IconShieldCheck, 
  IconCpu, 
  IconAlertTriangle, 
  IconCode, 
  IconClose,
  IconImage,
  IconAudio,
  IconVideo,
  IconTable,
  IconFileText
} from './Icons';

interface LogicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogicExplanationModal: React.FC<LogicModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <IconCpu size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Toàn Bộ Kiến Trúc & Logic Kỹ Thuật (Trình Bày Bằng Tiếng Việt)
              </h3>
              <p className="text-xs text-slate-400">
                Nguyên lý chuyển đổi file thật 100% - Tuyệt đối không làm hỏng cấu trúc file
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

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs md:text-sm leading-relaxed">
          {/* Mục 1 */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm md:text-base font-bold text-indigo-300 flex items-center gap-2">
              <IconCheckCircle size={18} className="text-emerald-400 shrink-0" />
              1. Tại sao chuyển đổi không bao giờ bị lỗi (Chống bẫy "Đổi tên file giả mạo")?
            </h4>
            <p className="mt-2 text-slate-300">
              Rất nhiều phần mềm kém chất lượng chỉ đơn thuần là <strong>đổi đuôi tên file</strong> (ví dụ đổi <code className="text-indigo-300 font-mono">anh.png</code> thành <code className="text-indigo-300 font-mono">anh.jpg</code>). Hành vi này không làm thay đổi cấu trúc byte bên trong, dẫn đến phần mềm khác không thể mở được (báo lỗi Corrupt File hoặc Invalid Header).
            </p>
            <p className="mt-2 text-slate-300">
              <strong>UyConvert Pro xử lý chuyển đổi nhị phân thực thụ (True Transcoding):</strong>
            </p>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-400">
              <li>Giải nén và phân tích cấu trúc nhị phân của file gốc vào bộ nhớ RAM.</li>
              <li>Tái cấu trúc dữ liệu theo đặc tả tiêu chuẩn quốc tế của định dạng đích (Header, Metadata, Stream, Palettes).</li>
              <li>Mã hóa và xuất ra file mới hoàn chỉnh 100% tiêu chuẩn, mở được trên mọi hệ điều hành.</li>
            </ul>
          </div>

          {/* Mục 2 */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm md:text-base font-bold text-indigo-300 flex items-center gap-2">
              <IconAlertTriangle size={18} className="text-amber-400 shrink-0" />
              2. Logic Lọc Ma Trận Động: "Đuôi nào chuyển được mới hiển thị"
            </h4>
            <p className="mt-2 text-slate-300">
              Mỗi định dạng dữ liệu có bản chất vật lý khác nhau: Một file âm thanh (sóng dao động âm học) không thể biến thành một file ảnh bitmap trực tiếp nếu không qua một quy trình biểu diễn nhân tạo. Ép người dùng chuyển đổi các định dạng không tương thích sẽ tạo ra file rác.
            </p>
            <p className="mt-2 text-slate-300">
              <strong>Thuật toán lọc ma trận hoạt động như sau:</strong>
            </p>
            <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-400">
              <li>Khi bạn tải file lên, hệ thống tách phần mở rộng và chuẩn hóa về chữ thường (lowercase).</li>
              <li>Hệ thống tra cứu trong <code className="text-indigo-400 font-mono">CONVERSION_MATRIX[extension]</code>.</li>
              <li>Dropdown đích <strong>chỉ render duy nhất</strong> danh sách các đuôi có trong mảng này.</li>
              <li>Nếu tệp không có trong ma trận (ví dụ: <code className="text-rose-400 font-mono">.exe</code>, <code className="text-rose-400 font-mono">.dll</code>), hệ thống lập tức hiển thị nhãn đỏ <em>"Không thể chuyển"</em> và vô hiệu hóa nút chuyển đổi.</li>
            </ol>
          </div>

          {/* Mục 3 */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm md:text-base font-bold text-indigo-300 flex items-center gap-2">
              <IconCode size={18} className="text-cyan-400 shrink-0" />
              3. Chi tiết công nghệ chuyển đổi từng phân hệ tệp tin
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-400 flex items-center mb-1">
                  <IconImage inline size={16} />
                  Hình ảnh (Images)
                </span>
                <p className="text-xs text-slate-400">
                  Dùng Canvas 2D API để giải mã pixel, sau đó xuất ra Blob chuẩn MIME. Với <strong>BMP</strong>, hệ thống tự sinh mã nhị phân 54 bytes Header + mảng pixel BGR từ dưới lên. Với <strong>ICO</strong>, xây dựng cấu trúc ICONDIR chuẩn Windows Icon 256x256. Với <strong>PDF</strong>, nhúng hình ảnh vào tọa độ A4/Custom của jsPDF.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-400 flex items-center mb-1">
                  <IconAudio inline size={16} />
                  Âm thanh (Audio)
                </span>
                <p className="text-xs text-slate-400">
                  Sử dụng <strong>Web Audio API (AudioContext)</strong> để giải mã luồng audio thành các mẫu sóng âm PCM Float32. Từ đó nén sang <strong>WAV 16-bit PCM</strong> chuẩn phòng thu hoặc dùng thư viện <strong>LameJS</strong> để encode sang <strong>MP3 192kbps</strong> chất lượng cao.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-cyan-400 flex items-center mb-1">
                  <IconVideo inline size={16} />
                  Video & Động ảnh
                </span>
                <p className="text-xs text-slate-400">
                  Hỗ trợ <strong>tách âm thanh từ video</strong> (Video MP4/WebM/MOV sang MP3/WAV) bằng cách giải mã luồng âm thanh nội tại của video qua AudioContext. Chuyển đổi định dạng video bằng Canvas Stream + MediaRecorder.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-purple-400 flex items-center mb-1">
                  <IconTable inline size={16} />
                  Bảng tính & Dữ liệu
                </span>
                <p className="text-xs text-slate-400">
                  Tích hợp thư viện <strong>SheetJS (XLSX)</strong> mạnh mẽ nhất thế giới hiện nay, cho phép đọc ghi hai chiều toàn bộ dữ liệu ô (cell values, formulas) giữa XLSX, XLS, CSV, TSV, JSON, HTML, TXT.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 md:col-span-2">
                <span className="font-bold text-blue-400 flex items-center mb-1">
                  <IconFileText inline size={16} />
                  Tài liệu Word (DOCX) & Văn bản
                </span>
                <p className="text-xs text-slate-400">
                  Dùng <strong>Mammoth.js</strong> để bóc tách cấu trúc Document Tree của file Word DOCX thành HTML/Text sạch, sau đó xuất sang TXT, Markdown, HTML hoặc PDF phân trang thông minh với ngắt dòng A4 tự động.
                </p>
              </div>
            </div>
          </div>

          {/* Mục 4 */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
            <h4 className="text-sm md:text-base font-bold text-indigo-300 flex items-center gap-2">
              <IconShieldCheck size={18} className="text-emerald-400 shrink-0" />
              4. Bảo mật 100% Client-Side & Không giới hạn Vercel Serverless
            </h4>
            <p className="mt-2 text-slate-300">
              Khác với các website chuyển đổi file truyền thống buộc bạn phải upload file nặng hàng chục, hàng trăm MB lên máy chủ của họ (nguy cơ lộ dữ liệu nhạy cảm và bị nghẽn mạng):
            </p>
            <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-400">
              <li><strong>Toàn bộ quá trình chạy trực tiếp trên CPU/GPU máy tính người dùng</strong> thông qua Web APIs & WebAssembly.</li>
              <li>Tệp tin không bao giờ rời khỏi thiết bị của bạn. Ngay cả khi bạn tắt kết nối Internet, công cụ vẫn tiếp tục chuyển đổi bình thường!</li>
              <li>Tối ưu hoàn hảo cho hạ tầng đám mây toàn cầu của <strong>Vercel Edge Network</strong> với độ trễ 0ms.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Hệ thống tuân thủ nghiêm ngặt chuẩn định dạng MIME và IANA specifications.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
