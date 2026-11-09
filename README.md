# UyConvert Pro - Bộ Chuyển Đổi Tệp Đa Định Dạng Uy Tín | By Uy

> **Công cụ web vạn năng của Uy hỗ trợ chuyển đổi tất cả các định dạng tệp (Ảnh, Video, Âm thanh, Sơ đồ .IO/.DRAWIO, Tài liệu Word, Bảng tính Excel, Dữ liệu có cấu trúc & Nén) với cơ chế bảo toàn tính toàn vẹn 100%, tuyệt đối không làm hỏng cấu trúc tệp.**

---

## Bảng Trình Bày Chi Tiết Toàn Bộ Logic Thực Hiện (Tiếng Việt)

### 1. Tại sao chuyển đổi không bao giờ bị lỗi (Chống bẫy "Đổi tên file giả mạo")?
- **Vấn đề thực tế**: Rất nhiều công cụ chuyển đổi trên thị trường chỉ đơn giản là đổi tên phần mở rộng (ví dụ từ `tailieu.png` thành `tailieu.jpg` hoặc từ `video.mp4` thành `video.mp3`). Điều này **không làm thay đổi cấu trúc byte nhị phân** bên trong. Khi người dùng mở file bằng các phần mềm chuyên dụng (Photoshop, Excel, Media Player), phần mềm sẽ báo lỗi *"File format or extension is not valid"* hoặc *"File is corrupted"*.
- **Giải pháp của UyConvert Pro**:
  - Hệ thống thực hiện **chuyển đổi nhị phân thực thụ (True Transcoding & Data Reconstruction)**.
  - Tệp gốc được nạp vào bộ nhớ RAM và giải mã hoàn toàn thành dữ liệu thô (Raw Pixel Array cho ảnh, PCM Audio Samples cho âm thanh, Abstract Syntax Tree cho tài liệu, Sheet Cell Objects cho bảng tính).
  - Sau đó, dữ liệu thô được đóng gói và mã hóa lại theo đúng quy chuẩn cấu trúc IANA / W3C của định dạng đích (Header chuẩn, Chunk dữ liệu, Bảng màu Palette, Nén không mất mát hoặc nén chuẩn).

---

### 2. Logic Lọc Ma Trận Động: "Đuôi nào chuyển được mới hiển thị"
- **Nguyên tắc an toàn dữ liệu**: Không thể ép một tệp âm thanh biến thành ảnh bitmap, hay ép một video biến thành bảng tính Word/Excel mà không có dữ liệu ngữ nghĩa. Nếu hiển thị những định dạng đích vô lý, người dùng sẽ bấm vào và tạo ra file rác.
- **Quy trình hoạt động của Bộ quy tắc ma trận (`conversion-matrix.ts`)**:
  1. Khi người dùng tải tệp lên, hệ thống tách phần mở rộng (extension) và chuẩn hóa về dạng chữ thường.
  2. Hệ thống tra cứu phần mở rộng trong từ điển `CONVERSION_MATRIX[extension]`.
  3. Menu lựa chọn định dạng đích **CHỈ RENDER DUY NHẤT** danh sách các định dạng tương thích và đã được lập trình giải mã / mã hóa an toàn.
  4. Nếu tệp không có trong danh mục hỗ trợ (ví dụ file `.exe`, `.dll`, `.bin`), hệ thống hiển thị nhãn cảnh báo đỏ *"Không thể chuyển đổi"* và vô hiệu hóa nút xử lý để bảo vệ người dùng.

---

### 3. Chi Tiết Kỹ Thuật Từng Phân Hệ Định Dạng

#### A. Phân Hệ Hình Ảnh (Images)
- **Định dạng nguồn hỗ trợ**: `PNG`, `JPG`, `JPEG`, `WEBP`, `BMP`, `ICO`, `SVG`, `TIFF`, `AVIF`, `GIF`...
- **Định dạng đích hỗ trợ**: `PNG`, `JPG`, `WEBP`, `BMP`, `ICO`, `SVG`, `PDF`...
- **Logic xử lý**:
  - **BMP**: Hệ thống tự động xây dựng cấu trúc nhị phân bitmap 54 bytes (14 bytes `BITMAPFILEHEADER` + 40 bytes `BITMAPINFOHEADER` 24-bit RGB) cùng mảng pixel BGR quét từ dưới lên (bottom-up) với padding 4-byte chuẩn Windows.
  - **ICO (Favicon & Windows Icon)**: Xây dựng header `ICONDIR` (2 bytes reserved, 2 bytes type = 1, 2 bytes count = 1) kết hợp với mục từ mục lục `ICONDIRENTRY` (width, height, bitCount, bytesInRes, offset) và nhúng luồng nén PNG/BMP bên trong.
  - **SVG**: Hỗ trợ chuyển đổi từ vector sang raster (thông qua Image element + Canvas độ phân giải cao) hoặc bọc raster vào SVG container tiêu chuẩn với base64 dataURI.
  - **PDF**: Nhúng trực tiếp hình ảnh vào trang PDF chuẩn khổ ảnh bằng thư viện `jsPDF`.

#### B. Phân Hệ Âm Thanh (Audio)
- **Định dạng nguồn hỗ trợ**: `MP3`, `WAV`, `OGG`, `AAC`, `M4A`, `FLAC`, `WEBA`...
- **Định dạng đích hỗ trợ**: `WAV`, `MP3`, `OGG`, `WEBA`...
- **Logic xử lý**:
  - Sử dụng **Web Audio API (`AudioContext.decodeAudioData`)** để giải mã luồng âm thanh nén thành `AudioBuffer` chứa các mẫu sóng âm PCM (Pulse-Code Modulation) Float32 (-1.0 đến +1.0).
  - **WAV Encoder**: Tự tạo cấu trúc container RIFF `WAVE` với chunk `fmt ` 16-bit signed integer PCM, interleave 2 kênh Stereo/Mono và tính toán chính xác byteRate, blockAlign.
  - **MP3 Encoder**: Tích hợp thuật toán nén âm thanh **LameJS (MP3 Encoder)** chạy client-side, nén các khối 1152 mẫu âm thanh với bitrate cao 192kbps chuẩn studio.

#### C. Phân Hệ Video & Hoạt Ảnh
- **Định dạng nguồn hỗ trợ**: `MP4`, `WEBM`, `MOV`, `MKV`, `AVI`, `WMV`, `FLV`...
- **Định dạng đích hỗ trợ**: `MP3` (Tách nhạc), `WAV` (Tách âm chất lượng cao), `GIF` (Ảnh động), `WEBM` (Video web), `MP4`...
- **Logic xử lý**:
  - **Tách nhạc từ Video**: Nạp dữ liệu nhị phân của video vào `AudioContext`, giải mã luồng audio track bên trong và xuất trực tiếp thành MP3 hoặc WAV chỉ trong vài giây.
  - **Video sang GIF / Canvas Recording**: Đọc video từng frame bằng HTML5 Video, trích xuất qua Canvas 2D và đóng gói thành GIF animation hoặc video chuyển mã qua `MediaRecorder`.

#### D. Phân Hệ Bảng Tính & Dữ Liệu
- **Định dạng hỗ trợ**: `XLSX`, `XLS`, `CSV`, `TSV`, `JSON`, `HTML`, `TXT`, `ODS`, `XML`, `YAML`...
- **Logic xử lý**:
  - Tích hợp công cụ **SheetJS (XLSX)** để giải mã cấu trúc workbook, worksheet, kiểu dữ liệu từng ô (chuỗi, số, ngày tháng, công thức).
  - Chuyển đổi hai chiều mượt mà giữa bảng tính Excel và các định dạng trao đổi dữ liệu như JSON, CSV, TSV, HTML table hoặc PDF báo cáo.

#### E. Phân Hệ Tài Liệu Word, Văn Bản & Sơ Đồ (.IO, .DRAWIO)
- **Định dạng hỗ trợ**: `DOCX`, `TXT`, `MD`, `HTML`, `PDF`, `.IO`, `.DRAWIO`...
- **Logic xử lý**:
  - Dùng **Mammoth.js** để bóc tách tệp nén OpenXML của Word, trích xuất cấu trúc văn bản sạch không rác (Clean Semantic Document Tree).
  - Với tệp **Sơ đồ Draw.io / Tệp I/O (`.io`, `.drawio`)**: Bóc tách cây XML mxCell để trích xuất các nút và nhãn sơ đồ, chuyển đổi thành vector `SVG`, xuất ảnh `PNG` độ nét cao, tạo tài liệu `PDF`, tạo tài liệu web `HTML` kèm preview trực quan, hoặc trích xuất `JSON`/`XML`/`TXT`.
  - Hỗ trợ xuất sang **PDF** với thuật toán tự động ngắt dòng thông minh (`splitTextToSize`) và tự động thêm trang A4 mới khi văn bản vượt quá chiều cao trang.

---

### 4. Ưu Thế 100% Client-Side & Khả Năng Vận Hành
- **Bảo mật tuyệt đối**: Dữ liệu của bạn không bao giờ rời khỏi trình duyệt. Không gửi file lên bất kỳ máy chủ nào.
- **Không giới hạn dung lượng**: Không bị giới hạn kích thước upload (như giới hạn 4.5MB của serverless functions).
- **Hoạt động Offline**: Có thể ngắt mạng Internet mà tool vẫn tiếp tục chuyển đổi bình thường.
- **Tải hàng loạt**: Hỗ trợ chuyển đổi toàn bộ danh sách và tải về chỉ với 1 click dưới dạng file `.ZIP`.

---

## Hướng Dẫn Cài Đặt & Chạy Dưới Local

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev

# 3. Đóng gói cho môi trường Production
npm run build
```

---

## Triển Khai Lên Vercel

Dự án được tối ưu hóa sẵn cho **Vercel**:
- Khung sườn: Vite React Single Page Application (SPA).
- Tệp cấu hình `vercel.json` điều hướng route và bảo mật HTTP headers.
- Triển khai toàn cầu với độ trễ 0ms trên Vercel Edge CDN.
