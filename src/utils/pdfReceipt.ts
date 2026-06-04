type PdfReceiptLine = {
  label: string;
  value: string;
};

type PdfReceiptInput = {
  title: string;
  subtitle: string;
  filename: string;
  lines: PdfReceiptLine[];
};

function cleanPdfText(value: string) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function makeTextCommand(text: string, x: number, y: number, size = 12) {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${cleanPdfText(text)}) Tj ET`;
}

export function downloadPdfReceipt(input: PdfReceiptInput) {
  const commands = [
    makeTextCommand(input.title, 56, 780, 22),
    makeTextCommand(input.subtitle, 56, 750, 12),
    '0.86 0.86 0.86 RG 56 730 m 540 730 l S',
    ...input.lines.flatMap((line, index) => {
      const y = 700 - index * 28;
      return [
        makeTextCommand(line.label, 56, y, 10),
        makeTextCommand(line.value, 210, y, 12),
      ];
    }),
  ];
  const stream = commands.join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = input.filename.endsWith('.pdf') ? input.filename : `${input.filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
