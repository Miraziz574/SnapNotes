import type { Note } from '../types';
import { format } from 'date-fns';

export async function exportAsPDF(note: Note): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  // Title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(note.title || 'Untitled', maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 10 + 5;

  // Meta
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const meta = `Subject: ${note.subject || 'None'} | Created: ${format(new Date(note.createdAt), 'MMM d, yyyy')} | Tags: ${note.tags.join(', ') || 'None'}`;
  doc.text(meta, margin, y);
  y += 8;

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Content
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  const contentLines = doc.splitTextToSize(note.content || '', maxWidth);
  
  for (const line of contentLines) {
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, margin, y);
    y += 7;
  }

  // Checklist
  if (note.checklist && note.checklist.length > 0) {
    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Checklist:', margin, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    for (const item of note.checklist) {
      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${item.completed ? '☑' : '☐'} ${item.text}`, margin + 5, y);
      y += 7;
    }
  }

  doc.save(`${note.title || 'note'}.pdf`);
}

export function exportAsTXT(note: Note): void {
  const lines = [
    note.title || 'Untitled',
    '='.repeat(40),
    `Subject: ${note.subject || 'None'}`,
    `Created: ${format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}`,
    `Tags: ${note.tags.join(', ') || 'None'}`,
    '',
    note.content || '',
  ];
  
  if (note.checklist && note.checklist.length > 0) {
    lines.push('', 'Checklist:');
    note.checklist.forEach((item) => {
      lines.push(`${item.completed ? '[x]' : '[ ]'} ${item.text}`);
    });
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title || 'note'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsJSON(data: unknown, filename: string): void {
  const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  }
}