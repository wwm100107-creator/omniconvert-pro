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


/**
 * Chuyển đổi tệp sơ đồ .IO và .DRAWIO (Diagrams.net XML / I/O Data)
 */
export async function convertDiagramIoFile(file: File, targetExt: string): Promise<Blob> {
  const content = await file.text();
  const cleanTarget = targetExt.toLowerCase().replace(/^\./, '');

  // Trích xuất các nhãn văn bản từ tệp sơ đồ XML Draw.io
  const extractLabelsFromDrawIo = (xmlStr: string): string[] => {
    const labels: string[] = [];
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlStr, 'application/xml');
      const cells = doc.querySelectorAll('mxCell');
      cells.forEach((cell) => {
        const val = cell.getAttribute('value');
        if (val && val.trim()) {
          labels.push(val.trim());
        }
      });
      if (labels.length === 0) {
        // Fallback regex trích xuất value="..."
        const regex = /value="([^"]+)"/g;
        let match;
        while ((match = regex.exec(xmlStr)) !== null) {
          if (match[1].trim()) labels.push(match[1].trim());
        }
      }
    } catch {
      // nếu không phải xml, tách dòng bình thường
      return xmlStr.split('\n').filter(l => l.trim().length > 0);
    }
    return labels.length > 0 ? labels : [xmlStr];
  };

  if (cleanTarget === 'xml') {
    return new Blob([content], { type: 'application/xml;charset=utf-8' });
  }

  if (cleanTarget === 'txt') {
    const labels = extractLabelsFromDrawIo(content);
    const txtOutput = labels.join('\n');
    return new Blob([txtOutput], { type: 'text/plain;charset=utf-8' });
  }

  if (cleanTarget === 'json') {
    try {
      const labels = extractLabelsFromDrawIo(content);
      const jsonObj = {
        fileName: file.name,
        fileType: 'drawio-diagram',
        totalNodes: labels.length,
        nodes: labels.map((lbl, idx) => ({ id: idx + 1, label: lbl })),
        rawContent: content.length < 100000 ? content : content.slice(0, 100000)
      };
      return new Blob([JSON.stringify(jsonObj, null, 2)], { type: 'application/json' });
    } catch {
      return new Blob([JSON.stringify({ raw: content }, null, 2)], { type: 'application/json' });
    }
  }

  if (cleanTarget === 'html') {
    const labels = extractLabelsFromDrawIo(content);
    const nodesHtml = labels.map(l => `<div class="node-box">${l.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`).join('\n');
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${file.name} - Diagram View</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; margin: 0; }
    h1 { font-size: 20px; color: #818cf8; margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 12px; }
    .diagram-container { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; }
    .node-box { background: #1e293b; border: 1px solid #475569; border-radius: 8px; padding: 12px 18px; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); }
    .raw-section { margin-top: 40px; }
    pre { background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; overflow: auto; max-height: 400px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📊 Sơ đồ: ${file.name}</h1>
  <div class="diagram-container">
    ${nodesHtml}
  </div>
  <div class="raw-section">
    <h3>Mã nguồn sơ đồ gốc (XML / Data)</h3>
    <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
</body>
</html>`;
    return new Blob([fullHtml], { type: 'text/html' });
  }

  if (cleanTarget === 'svg') {
    const labels = extractLabelsFromDrawIo(content);
    const svgNodes = labels.slice(0, 50).map((label, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const x = 40 + col * 200;
      const y = 80 + row * 80;
      const safeLabel = label.replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 24);
      return `
        <rect x="${x}" y="${y}" width="180" height="50" rx="8" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>
        <text x="${x + 90}" y="${y + 30}" font-family="sans-serif" font-size="12" fill="#f8fafc" text-anchor="middle">${safeLabel}</text>
      `;
    }).join('\n');

    const totalRows = Math.ceil(Math.min(labels.length, 50) / 4) || 1;
    const svgHeight = Math.max(300, 120 + totalRows * 80);

    const svgDoc = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${svgHeight}" viewBox="0 0 900 ${svgHeight}">
  <rect width="100%" height="100%" fill="#0f172a"/>
  <text x="40" y="45" font-family="sans-serif" font-size="18" font-weight="bold" fill="#818cf8">${file.name} (Diagram Vector)</text>
  ${svgNodes}
</svg>`;
    return new Blob([svgDoc], { type: 'image/svg+xml' });
  }

  if (cleanTarget === 'pdf') {
    const labels = extractLabelsFromDrawIo(content);
    return textToPDF(labels.join('\n\n'), file.name);
  }

  if (cleanTarget === 'png') {
    const labels = extractLabelsFromDrawIo(content);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    const totalRows = Math.ceil(Math.min(labels.length, 60) / 4) || 1;
    canvas.height = Math.max(400, 160 + totalRows * 100);
    const ctx = canvas.getContext('2d')!;

    // Nền
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tiêu đề
    ctx.fillStyle = '#818cf8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(file.name + ' - Exported Diagram', 40, 50);

    // Vẽ các nút sơ đồ
    labels.slice(0, 60).forEach((lbl, idx) => {
      const col = idx % 4;
      const row = Math.floor(idx / 4);
      const x = 40 + col * 280;
      const y = 90 + row * 90;

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, 260, 60, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(lbl.slice(0, 28), x + 130, y + 30);
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Lỗi xuất PNG từ sơ đồ .io'));
      }, 'image/png');
    });
  }

  throw new Error(`Không hỗ trợ chuyển .${file.name.split('.').pop()} sang .${cleanTarget}`);
}
