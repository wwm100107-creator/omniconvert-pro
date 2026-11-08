import type { FileCategory } from './types';

export interface FormatMeta {
  ext: string;
  label: string;
  category: FileCategory;
  mime: string;
  description: string;
}

// Bảng định nghĩa chi tiết tất cả các định dạng được hỗ trợ
export const SUPPORTED_FORMATS: Record<string, FormatMeta> = {
  // === HÌNH ẢNH (IMAGES) ===
  png: { ext: 'png', label: 'PNG Image', category: 'image', mime: 'image/png', description: 'Định dạng ảnh nén lossless hỗ trợ nền trong suốt' },
  jpg: { ext: 'jpg', label: 'JPEG Image', category: 'image', mime: 'image/jpeg', description: 'Định dạng ảnh phổ biến nhất cho nhiếp ảnh' },
  jpeg: { ext: 'jpeg', label: 'JPEG Image', category: 'image', mime: 'image/jpeg', description: 'Định dạng ảnh JPEG chuẩn nén lossy' },
  webp: { ext: 'webp', label: 'WebP Image', category: 'image', mime: 'image/webp', description: 'Chuẩn ảnh hiện đại của Google cho web với dung lượng siêu nhẹ' },
  bmp: { ext: 'bmp', label: 'Bitmap Image', category: 'image', mime: 'image/bmp', description: 'Định dạng bitmap không nén chuẩn của Windows' },
  ico: { ext: 'ico', label: 'Icon File', category: 'image', mime: 'image/x-icon', description: 'Định dạng icon cho website (favicon) và phần mềm Windows' },
  svg: { ext: 'svg', label: 'Scalable Vector Graphics', category: 'image', mime: 'image/svg+xml', description: 'Định dạng đồ họa vector dựa trên XML không bị vỡ hạt' },
  gif: { ext: 'gif', label: 'GIF Animation/Image', category: 'image', mime: 'image/gif', description: 'Định dạng ảnh động 256 màu truyền thống' },
  avif: { ext: 'avif', label: 'AVIF Image', category: 'image', mime: 'image/avif', description: 'Chuẩn ảnh thế hệ mới siêu nén dựa trên AV1' },
  tiff: { ext: 'tiff', label: 'TIFF Image', category: 'image', mime: 'image/tiff', description: 'Định dạng ảnh chất lượng cao chuyên ngành in ấn và nhiếp ảnh' },

  // === SƠ ĐỒ DRAW.IO & TỆP .IO ===
  io: { ext: 'io', label: 'IO / Draw.io Diagram File', category: 'document', mime: 'application/xml', description: 'Tập tin sơ đồ kiến trúc Draw.io hoặc tệp luồng dữ liệu I/O' },
  drawio: { ext: 'drawio', label: 'Draw.io Diagram', category: 'document', mime: 'application/xml', description: 'Tập tin thiết kế sơ đồ luồng Diagrams.net / Draw.io' },

  // === ÂM THANH (AUDIO) ===
  mp3: { ext: 'mp3', label: 'MP3 Audio', category: 'audio', mime: 'audio/mpeg', description: 'Chuẩn âm thanh nén phổ biến nhất thế giới' },
  wav: { ext: 'wav', label: 'WAV Audio', category: 'audio', mime: 'audio/wav', description: 'Âm thanh nguyên bản không nén chuẩn phòng thu (PCM)' },
  ogg: { ext: 'ogg', label: 'OGG Vorbis Audio', category: 'audio', mime: 'audio/ogg', description: 'Chuẩn âm thanh mã nguồn mở chất lượng cao' },
  aac: { ext: 'aac', label: 'AAC Audio', category: 'audio', mime: 'audio/aac', description: 'Chuẩn mã hóa âm thanh nâng cao (Apple / YouTube)' },
  m4a: { ext: 'm4a', label: 'M4A Audio', category: 'audio', mime: 'audio/mp4', description: 'Container âm thanh Apple MPEG-4 chất lượng cao' },
  flac: { ext: 'flac', label: 'FLAC Lossless Audio', category: 'audio', mime: 'audio/flac', description: 'Chuẩn âm thanh lossless nén bảo toàn 100% dữ liệu gốc' },
  weba: { ext: 'weba', label: 'WebA Audio', category: 'audio', mime: 'audio/webm', description: 'Âm thanh WebM tối ưu hóa cho trình duyệt hiện đại' },

  // === VIDEO ===
  mp4: { ext: 'mp4', label: 'MP4 Video', category: 'video', mime: 'video/mp4', description: 'Container video phổ biến nhất thế giới (H.264/AAC)' },
  webm: { ext: 'webm', label: 'WebM Video', category: 'video', mime: 'video/webm', description: 'Định dạng video mở của Google tối ưu cho web (VP8/VP9)' },
  mov: { ext: 'mov', label: 'QuickTime MOV Video', category: 'video', mime: 'video/quicktime', description: 'Định dạng video chuẩn của Apple QuickTime' },
  mkv: { ext: 'mkv', label: 'Matroska MKV Video', category: 'video', mime: 'video/x-matroska', description: 'Container video linh hoạt chứa nhiều track phụ đề/audio' },
  avi: { ext: 'avi', label: 'AVI Video', category: 'video', mime: 'video/x-msvideo', description: 'Định dạng video truyền thống của Microsoft' },
  wmv: { ext: 'wmv', label: 'Windows Media Video', category: 'video', mime: 'video/x-ms-wmv', description: 'Định dạng video Windows Media' },
  flv: { ext: 'flv', label: 'Flash Video', category: 'video', mime: 'video/x-flv', description: 'Định dạng video Adobe Flash lịch sử' },

  // === TÀI LIỆU VĂN PHÒNG (DOCUMENTS) ===
  pdf: { ext: 'pdf', label: 'PDF Document', category: 'document', mime: 'application/pdf', description: 'Tài liệu di động chuẩn của Adobe giữ nguyên định dạng trang' },
  docx: { ext: 'docx', label: 'Word Document', category: 'document', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Tài liệu Microsoft Word hiện đại dạng XML' },
  txt: { ext: 'txt', label: 'Plain Text', category: 'document', mime: 'text/plain', description: 'Văn bản thuần túy không định dạng, tương thích mọi hệ điều hành' },
  md: { ext: 'md', label: 'Markdown Document', category: 'document', mime: 'text/markdown', description: 'Ngôn ngữ đánh dấu nhẹ phổ biến của lập trình viên và tài liệu' },
  html: { ext: 'html', label: 'HTML Webpage', category: 'document', mime: 'text/html', description: 'Trang web HyperText Markup Language' },

  // === BẢNG TÍNH & DỮ LIỆU (SPREADSHEETS & DATA) ===
  xlsx: { ext: 'xlsx', label: 'Excel Spreadsheet', category: 'spreadsheet', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Bảng tính Microsoft Excel hiện đại' },
  xls: { ext: 'xls', label: 'Excel 97-2003', category: 'spreadsheet', mime: 'application/vnd.ms-excel', description: 'Bảng tính Microsoft Excel định dạng nhị phân cũ' },
  csv: { ext: 'csv', label: 'Comma-Separated Values', category: 'spreadsheet', mime: 'text/csv', description: 'Dữ liệu bảng phân tách bởi dấu phẩy' },
  tsv: { ext: 'tsv', label: 'Tab-Separated Values', category: 'spreadsheet', mime: 'text/tab-separated-values', description: 'Dữ liệu bảng phân tách bởi dấu tab' },
  ods: { ext: 'ods', label: 'OpenDocument Spreadsheet', category: 'spreadsheet', mime: 'application/vnd.oasis.opendocument.spreadsheet', description: 'Bảng tính mở chuẩn LibreOffice / OpenOffice' },
  json: { ext: 'json', label: 'JSON Data', category: 'data', mime: 'application/json', description: 'Định dạng trao đổi dữ liệu có cấu trúc chuẩn JavaScript' },
  xml: { ext: 'xml', label: 'XML Document', category: 'data', mime: 'application/xml', description: 'Ngôn ngữ đánh dấu mở rộng Extensible Markup Language' },
  yaml: { ext: 'yaml', label: 'YAML Data', category: 'data', mime: 'text/yaml', description: 'Định dạng dữ liệu cấu hình thân thiện với người đọc' },
  yml: { ext: 'yml', label: 'YAML Data', category: 'data', mime: 'text/yaml', description: 'Viết tắt của YAML' },

  // === NÉN & LƯU TRỮ (ARCHIVE) ===
  zip: { ext: 'zip', label: 'ZIP Archive', category: 'archive', mime: 'application/zip', description: 'Tập tin nén gói nhiều file chuẩn ZIP' },
  tar: { ext: 'tar', label: 'TAR Archive', category: 'archive', mime: 'application/x-tar', description: 'Tập tin đóng gói nhiều file Unix/Linux' },
  iso: { ext: 'iso', label: 'ISO Disk Image', category: 'archive', mime: 'application/x-iso9660-image', description: 'Tập tin ảnh đĩa quang tiêu chuẩn ISO 9660' },
};

// MA TRẬN CHUYỂN ĐỔI CHÍNH XÁC (CONVERSION MATRIX)
// Chỉ những đuôi file thực sự chuyển đổi được mà KHÔNG LỖI mới xuất hiện ở đây.
export const CONVERSION_MATRIX: Record<string, string[]> = {
  // Ảnh raster thông thường -> có thể chuyển sang các định dạng ảnh khác, ICO, SVG và PDF
  png: ['jpg', 'jpeg', 'webp', 'bmp', 'ico', 'svg', 'pdf'],
  jpg: ['png', 'webp', 'bmp', 'ico', 'svg', 'pdf'],
  jpeg: ['png', 'webp', 'bmp', 'ico', 'svg', 'pdf'],
  webp: ['png', 'jpg', 'jpeg', 'bmp', 'ico', 'svg', 'pdf'],
  bmp: ['png', 'jpg', 'jpeg', 'webp', 'ico', 'svg', 'pdf'],
  ico: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'],
  tiff: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'],
  avif: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'],
  
  // Vector SVG -> Raster ảnh độ nét cao và PDF
  svg: ['png', 'jpg', 'jpeg', 'webp', 'bmp', 'pdf'],

  // GIF -> Trích xuất ảnh tĩnh, PDF hoặc chuyển đổi định dạng
  gif: ['png', 'jpg', 'webp', 'bmp', 'pdf'],

  // Tệp Sơ đồ .IO & .DRAWIO
  io: ['svg', 'png', 'pdf', 'xml', 'json', 'html', 'txt'],
  drawio: ['svg', 'png', 'pdf', 'xml', 'json', 'html', 'txt'],

  // Âm thanh -> Chuyển đổi qua lại giữa các chuẩn nén / không nén
  mp3: ['wav', 'ogg', 'weba'],
  wav: ['mp3', 'ogg', 'weba'],
  ogg: ['mp3', 'wav', 'weba'],
  aac: ['wav', 'mp3', 'ogg'],
  m4a: ['wav', 'mp3', 'ogg'],
  flac: ['wav', 'mp3', 'ogg'],
  weba: ['mp3', 'wav', 'ogg'],

  // Video -> Tách âm thanh sang MP3/WAV, tạo GIF hoạt hình, hoặc chuyển container WebM
  mp4: ['webm', 'gif', 'mp3', 'wav'],
  webm: ['mp4', 'gif', 'mp3', 'wav'],
  mov: ['webm', 'gif', 'mp3', 'wav'],
  mkv: ['webm', 'gif', 'mp3', 'wav'],
  avi: ['webm', 'gif', 'mp3', 'wav'],
  wmv: ['webm', 'gif', 'mp3', 'wav'],
  flv: ['webm', 'gif', 'mp3', 'wav'],

  // Tài liệu Microsoft Word
  docx: ['txt', 'html', 'md', 'pdf'],

  // Văn bản thô
  txt: ['pdf', 'docx', 'md', 'html'],

  // Markdown
  md: ['html', 'txt', 'pdf', 'docx'],

  // HTML
  html: ['txt', 'md', 'pdf'],

  // PDF
  pdf: ['txt'],

  // Bảng tính Excel & Dữ liệu
  xlsx: ['csv', 'tsv', 'json', 'html', 'txt', 'pdf'],
  xls: ['xlsx', 'csv', 'tsv', 'json', 'html', 'txt'],
  csv: ['xlsx', 'tsv', 'json', 'html', 'txt'],
  tsv: ['xlsx', 'csv', 'json', 'html', 'txt'],
  ods: ['xlsx', 'csv', 'tsv', 'json', 'html', 'txt'],

  // Dữ liệu có cấu trúc
  json: ['csv', 'xlsx', 'yaml', 'xml', 'txt'],
  xml: ['json', 'txt'],
  yaml: ['json', 'txt'],
  yml: ['json', 'txt'],

  // Nén & Ảnh đĩa
  zip: ['tar'],
  tar: ['zip'],
  iso: ['zip', 'tar'],
};

// Hàm lấy danh sách đuôi có thể chuyển đổi được từ 1 extension nguồn
export function getValidTargetFormats(sourceExt: string): string[] {
  const cleanExt = sourceExt.toLowerCase().replace(/^\./, '');
  return CONVERSION_MATRIX[cleanExt] || [];
}

// Kiểm tra xem 1 chuyển đổi từ A sang B có hợp lệ và được hỗ trợ không
export function isConversionSupported(sourceExt: string, targetExt: string): boolean {
  const validTargets = getValidTargetFormats(sourceExt);
  return validTargets.includes(targetExt.toLowerCase().replace(/^\./, ''));
}

// Lấy category từ extension
export function getFileCategory(ext: string): FileCategory {
  const cleanExt = ext.toLowerCase().replace(/^\./, '');
  if (SUPPORTED_FORMATS[cleanExt]) {
    return SUPPORTED_FORMATS[cleanExt].category;
  }
  
  // Heuristics fallback
  if (['png', 'jpg', 'jpeg', 'webp', 'bmp', 'gif', 'svg', 'ico', 'tiff', 'avif', 'heic', 'heif'].includes(cleanExt)) {
    return 'image';
  }
  if (['io', 'drawio'].includes(cleanExt)) {
    return 'document';
  }
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac', 'weba', 'wma'].includes(cleanExt)) {
    return 'audio';
  }
  if (['mp4', 'webm', 'mov', 'mkv', 'avi', 'wmv', 'flv'].includes(cleanExt)) {
    return 'video';
  }
  if (['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(cleanExt)) {
    return 'spreadsheet';
  }
  if (['json', 'xml', 'yaml', 'yml'].includes(cleanExt)) {
    return 'data';
  }
  if (['zip', 'tar', 'gz', 'rar', '7z', 'iso'].includes(cleanExt)) {
    return 'archive';
  }
  return 'document';
}
