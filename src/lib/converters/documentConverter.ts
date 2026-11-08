import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

/**
 * Xuất nội dung text thành PDF với phân trang và ngắt dòng thông minh
 */
export function textToPDF(text: string, title?: string): Blob {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 16;

  let cursorY = margin;

  if (title) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, margin, cursorY);
    cursorY += 28;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, maxLineWidth);

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeight;
  }

  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Blob([pdfArrayBuffer], { type: 'application/pdf' });
}

/**
 * Chuyển đổi file DOCX sang TXT, HTML, MD hoặc PDF
 */
export async function convertDocx(file: File, targetExt: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();

  if (targetExt === 'html') {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name}</title>
  <style>body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; }</style>
</head>
<body>
  ${result.value}
</body>
</html>`;
    return new Blob([fullHtml], { type: 'text/html' });
  }

  if (targetExt === 'txt') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return new Blob([result.value], { type: 'text/plain;charset=utf-8' });
  }

  if (targetExt === 'md') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    // Tạo cấu trúc markdown cơ bản từ text
    return new Blob([result.value], { type: 'text/markdown;charset=utf-8' });
  }

  if (targetExt === 'pdf') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return textToPDF(result.value, file.name.replace(/\.[^/.]+$/, ''));
  }

  throw new Error(`Không hỗ trợ chuyển DOCX sang ${targetExt}`);
}

/**
 * Chuyển đổi bảng tính (XLSX, XLS, CSV, TSV, ODS)
 */
export async function convertSpreadsheet(file: File, targetExt: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (targetExt === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    return new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  }

  if (targetExt === 'tsv') {
    const tsvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' });
    return new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8' });
  }

  if (targetExt === 'json') {
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const jsonStr = JSON.stringify(jsonData, null, 2);
    return new Blob([jsonStr], { type: 'application/json' });
  }

  if (targetExt === 'html') {
    const htmlContent = XLSX.utils.sheet_to_html(worksheet);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name}</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  </style>
</head>
<body>
  <h2>${file.name}</h2>
  ${htmlContent}
</body>
</html>`;
    return new Blob([fullHtml], { type: 'text/html' });
  }

  if (targetExt === 'txt') {
    const txtContent = XLSX.utils.sheet_to_txt(worksheet);
    return new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
  }

  if (targetExt === 'xlsx') {
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  if (targetExt === 'pdf') {
    const txtContent = XLSX.utils.sheet_to_txt(worksheet);
    return textToPDF(txtContent, file.name);
  }

  throw new Error(`Không hỗ trợ chuyển bảng tính sang ${targetExt}`);
}

/**
 * Chuyển đổi dữ liệu JSON
 */
export async function convertJsonData(file: File, targetExt: string): Promise<Blob> {
  const text = await file.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('File JSON không hợp lệ, vui lòng kiểm tra cú pháp');
  }

  if (targetExt === 'csv' || targetExt === 'tsv' || targetExt === 'xlsx') {
    const sheetData = Array.isArray(data) ? data : [data];
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    if (targetExt === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      return new Blob([csv], { type: 'text/csv;charset=utf-8' });
    }
    if (targetExt === 'tsv') {
      const tsv = XLSX.utils.sheet_to_csv(ws, { FS: '\t' });
      return new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' });
    }
    if (targetExt === 'xlsx') {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }
  }

  if (targetExt === 'xml') {
    const jsonToXml = (obj: any): string => {
      let xml = '';
      for (const prop in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) continue;
        if (Array.isArray(obj[prop])) {
          for (const item of obj[prop]) {
            xml += `<${prop}>${typeof item === 'object' ? jsonToXml(item) : item}</${prop}>`;
          }
        } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
          xml += `<${prop}>${jsonToXml(obj[prop])}</${prop}>`;
        } else {
          xml += `<${prop}>${obj[prop]}</${prop}>`;
        }
      }
      return xml;
    };

    const xmlResult = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${jsonToXml(data)}\n</root>`;
    return new Blob([xmlResult], { type: 'application/xml' });
  }

  if (targetExt === 'yaml' || targetExt === 'yml') {
    // Basic YAML serializer
    const jsonToYaml = (obj: any, indent = 0): string => {
      const sp = ' '.repeat(indent);
      let yaml = '';
      if (Array.isArray(obj)) {
        for (const item of obj) {
          if (typeof item === 'object' && item !== null) {
            yaml += `${sp}- \n${jsonToYaml(item, indent + 2)}`;
          } else {
            yaml += `${sp}- ${item}\n`;
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const k in obj) {
          if (typeof obj[k] === 'object' && obj[k] !== null) {
            yaml += `${sp}${k}:\n${jsonToYaml(obj[k], indent + 2)}`;
          } else {
            yaml += `${sp}${k}: ${obj[k]}\n`;
          }
        }
      } else {
        yaml += `${sp}${obj}\n`;
      }
      return yaml;
    };

    const yamlResult = jsonToYaml(data);
    return new Blob([yamlResult], { type: 'text/yaml' });
  }

  if (targetExt === 'txt') {
    return new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain;charset=utf-8' });
  }

  throw new Error(`Không hỗ trợ chuyển JSON sang ${targetExt}`);
}

/**
 * Chuyển đổi file văn bản thô (TXT, MD, HTML)
 */
export async function convertTextDocument(file: File, sourceExt: string, targetExt: string): Promise<Blob> {
  const content = await file.text();

  if (targetExt === 'pdf') {
    return textToPDF(content, file.name);
  }

  if (targetExt === 'html') {
    const formatted = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name}</title>
  <style>body { font-family: sans-serif; white-space: pre-wrap; padding: 24px; line-height: 1.5; }</style>
</head>
<body>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
</html>`;
    return new Blob([formatted], { type: 'text/html' });
  }

  if (targetExt === 'txt' || targetExt === 'md') {
    return new Blob([content], { type: 'text/plain;charset=utf-8' });
  }

  throw new Error(`Không hỗ trợ chuyển từ ${sourceExt} sang ${targetExt}`);
}
