import { getFileCategory, isConversionSupported } from './conversion-matrix';
import { convertImage } from './converters/imageConverter';
import { convertAudio } from './converters/audioConverter';
import { convertVideo } from './converters/videoConverter';
import { 
  convertDocx, 
  convertSpreadsheet, 
  convertJsonData, 
  convertTextDocument 
} from './converters/documentConverter';

export interface ConvertResult {
  blob: Blob;
  fileName: string;
  size: number;
}

/**
 * Trình điều phối xử lý chuyển đổi tệp tin chính của toàn hệ thống
 */
export async function executeConversion(
  file: File, 
  targetExt: string,
  onProgress?: (percent: number) => void
): Promise<ConvertResult> {
  const parts = file.name.split('.');
  const sourceExt = parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  const baseName = parts.join('.') || 'converted';
  const cleanTargetExt = targetExt.toLowerCase().replace(/^\./, '');

  if (!sourceExt) {
    throw new Error('Tệp không có phần mở rộng hợp lệ');
  }

  // 1. Kiểm tra an toàn: Ma trận chuyển đổi
  if (!isConversionSupported(sourceExt, cleanTargetExt)) {
    throw new Error(
      `Chuyển đổi từ .${sourceExt.toUpperCase()} sang .${cleanTargetExt.toUpperCase()} không được phép vì không tương thích cấu trúc nhị phân và có nguy cơ gây hỏng tệp!`
    );
  }

  if (onProgress) onProgress(20);

  const category = getFileCategory(sourceExt);
  let resultBlob: Blob;

  // 2. Phân luồng xử lý theo danh mục
  if (category === 'image') {
    if (onProgress) onProgress(50);
    resultBlob = await convertImage(file, cleanTargetExt);
  } else if (category === 'audio') {
    if (onProgress) onProgress(50);
    resultBlob = await convertAudio(file, cleanTargetExt);
  } else if (category === 'video') {
    if (onProgress) onProgress(50);
    resultBlob = await convertVideo(file, cleanTargetExt);
  } else if (sourceExt === 'docx') {
    if (onProgress) onProgress(60);
    resultBlob = await convertDocx(file, cleanTargetExt);
  } else if (['xlsx', 'xls', 'csv', 'tsv', 'ods'].includes(sourceExt)) {
    if (onProgress) onProgress(60);
    resultBlob = await convertSpreadsheet(file, cleanTargetExt);
  } else if (['json', 'xml', 'yaml', 'yml'].includes(sourceExt)) {
    if (onProgress) onProgress(60);
    resultBlob = await convertJsonData(file, cleanTargetExt);
  } else if (['txt', 'md', 'html'].includes(sourceExt)) {
    if (onProgress) onProgress(60);
    resultBlob = await convertTextDocument(file, sourceExt, cleanTargetExt);
  } else {
    throw new Error(`Định dạng tệp .${sourceExt} hiện chưa được hỗ trợ chuyển đổi.`);
  }

  if (onProgress) onProgress(100);

  const newFileName = `${baseName}.${cleanTargetExt}`;

  return {
    blob: resultBlob,
    fileName: newFileName,
    size: resultBlob.size,
  };
}
