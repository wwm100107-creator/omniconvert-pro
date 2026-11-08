import { jsPDF } from 'jspdf';

/**
 * Đọc file ảnh thành HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không thể tải file ảnh để giải mã'));
    };
    img.src = url;
  });
}

/**
 * Mã hóa ImageData thành buffer file BMP chuẩn 24-bit RGB không nén
 */
function imageDataToBMP(imageData: ImageData): ArrayBuffer {
  const width = imageData.width;
  const height = imageData.height;
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileHeaderSize = 14;
  const infoHeaderSize = 40;
  const fileSize = fileHeaderSize + infoHeaderSize + pixelArraySize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // BITMAPFILEHEADER
  view.setUint16(0, 0x4d42, true); // 'BM'
  view.setUint32(2, fileSize, true); // File size
  view.setUint16(6, 0, true); // Reserved
  view.setUint16(8, 0, true); // Reserved
  view.setUint32(10, fileHeaderSize + infoHeaderSize, true); // Offset to pixel data

  // BITMAPINFOHEADER
  view.setUint32(14, infoHeaderSize, true); // Header size
  view.setInt32(18, width, true); // Width
  view.setInt32(22, height, true); // Height (positive for bottom-up)
  view.setUint16(26, 1, true); // Color planes
  view.setUint16(28, 24, true); // Bits per pixel (24-bit RGB)
  view.setUint32(30, 0, true); // Compression (BI_RGB = none)
  view.setUint32(34, pixelArraySize, true); // Image data size
  view.setInt32(38, 2835, true); // Horizontal resolution (pixels/meter ~ 72 DPI)
  view.setInt32(42, 2835, true); // Vertical resolution
  view.setUint32(46, 0, true); // Colors in color table
  view.setUint32(50, 0, true); // Important color count

  const pixels = imageData.data;
  let offset = fileHeaderSize + infoHeaderSize;

  // BMP lưu theo thứ tự từ dưới lên (bottom-up) và màu BGR
  for (let y = height - 1; y >= 0; y--) {
    let rowOffset = offset;
    for (let x = 0; x < width; x++) {
      const pIndex = (y * width + x) * 4;
      const r = pixels[pIndex];
      const g = pixels[pIndex + 1];
      const b = pixels[pIndex + 2];

      view.setUint8(rowOffset++, b);
      view.setUint8(rowOffset++, g);
      view.setUint8(rowOffset++, r);
    }
    // Padding thêm cho đủ bội số của 4 bytes
    while ((rowOffset - offset) < rowSize) {
      view.setUint8(rowOffset++, 0);
    }
    offset += rowSize;
  }

  return buffer;
}

/**
 * Đóng gói dữ liệu ảnh (PNG blob) thành file định dạng ICO (Windows Icon)
 */
async function createIcoFromBlob(blob: Blob, width: number, height: number): Promise<Blob> {
  const pngBytes = new Uint8Array(await blob.arrayBuffer());
  const icoHeaderSize = 6;
  const dirEntrySize = 16;
  const totalSize = icoHeaderSize + dirEntrySize + pngBytes.length;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // ICONDIR Header
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Image type: 1 for Icon (.ICO)
  view.setUint16(4, 1, true); // Number of images in file: 1

  // ICONDIRENTRY
  const w = width > 256 ? 256 : width;
  const h = height > 256 ? 256 : height;
  view.setUint8(6, w === 256 ? 0 : w); // Width (0 means 256)
  view.setUint8(7, h === 256 ? 0 : h); // Height (0 means 256)
  view.setUint8(8, 0); // Palette colors
  view.setUint8(9, 0); // Reserved
  view.setUint16(10, 1, true); // Color planes
  view.setUint16(12, 32, true); // Bits per pixel
  view.setUint32(14, pngBytes.length, true); // Image size in bytes
  view.setUint32(18, icoHeaderSize + dirEntrySize, true); // Image offset (22)

  // Copy PNG bytes
  const uint8 = new Uint8Array(buffer);
  uint8.set(pngBytes, icoHeaderSize + dirEntrySize);

  return new Blob([buffer], { type: 'image/x-icon' });
}

/**
 * Hàm chuyển đổi hình ảnh toàn diện
 */
export async function convertImage(
  file: File, 
  targetExt: string,
  quality: number = 0.92
): Promise<Blob> {
  const target = targetExt.toLowerCase().replace(/^\./, '');

  // 1. Chuyển sang PDF
  if (target === 'pdf') {
    const img = await loadImageFromFile(file);
    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width, img.height]
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgDataUrl, 'JPEG', 0, 0, img.width, img.height);
    const pdfArrayBuffer = pdf.output('arraybuffer');
    return new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  }

  // 2. Chuyển sang SVG (Vector Wrapper chuẩn)
  if (target === 'svg') {
    const reader = new FileReader();
    const dataUrl = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    const img = await loadImageFromFile(file);
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image width="${img.width}" height="${img.height}" xlink:href="${dataUrl}" />
</svg>`;
    return new Blob([svgContent], { type: 'image/svg+xml' });
  }

  // 3. Xử lý thông qua HTMLCanvasElement cho các định dạng ảnh khác
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D context');

  // Nếu chuyển sang JPG hoặc BMP và có pixel trong suốt, vẽ nền trắng
  if (['jpg', 'jpeg', 'bmp'].includes(target)) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  // BMP
  if (target === 'bmp') {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bmpBuffer = imageDataToBMP(imageData);
    return new Blob([bmpBuffer], { type: 'image/bmp' });
  }

  // ICO (resize tối đa 256x256 để tương thích icon chuẩn)
  if (target === 'ico') {
    const icoCanvas = document.createElement('canvas');
    const icoSize = Math.min(256, Math.max(canvas.width, canvas.height));
    icoCanvas.width = icoSize;
    icoCanvas.height = icoSize;
    const icoCtx = icoCanvas.getContext('2d')!;
    // Giữ tỉ lệ
    const scale = Math.min(icoSize / canvas.width, icoSize / canvas.height);
    const drawW = canvas.width * scale;
    const drawH = canvas.height * scale;
    const offsetX = (icoSize - drawW) / 2;
    const offsetY = (icoSize - drawH) / 2;
    icoCtx.drawImage(canvas, offsetX, offsetY, drawW, drawH);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      icoCanvas.toBlob((b) => b ? resolve(b) : reject(new Error('Lỗi xuất icon')), 'image/png');
    });

    return await createIcoFromBlob(pngBlob, icoSize, icoSize);
  }

  // PNG, JPEG, WEBP
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    avif: 'image/avif',
  };

  const mime = mimeTypes[target] || 'image/png';
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        // Fallback sang toDataURL nếu toBlob trả về null
        try {
          const dataUrl = canvas.toDataURL(mime, quality);
          const byteString = atob(dataUrl.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          resolve(new Blob([ab], { type: mime }));
        } catch (e) {
          reject(new Error(`Không thể chuyển đổi sang định dạng ${target}`));
        }
      }
    }, mime, quality);
  });
}
