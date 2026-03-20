import { jsPDF } from 'jspdf';
import { Response, QUESTIONS, BRAND_COLORS } from '@/types';

export function generatePDF(responses: Response[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  // Helper: draw colored bar at top/bottom of page
  const drawColorBar = (y: number, height: number) => {
    const barWidth = pageWidth / BRAND_COLORS.length;
    BRAND_COLORS.forEach((color, i) => {
      doc.setFillColor(color.r, color.g, color.b);
      doc.rect(i * barWidth, y, barWidth + 1, height, 'F');
    });
  };

  // ── Cover page ──
  drawColorBar(0, 4);

  const titleColor = BRAND_COLORS[6]; // Dark purple
  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Livre d\'Or', pageWidth / 2, 80, { align: 'center' });

  const accentColor = BRAND_COLORS[1]; // Orange
  doc.setTextColor(accentColor.r, accentColor.g, accentColor.b);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.text('Remise des Titres', pageWidth / 2, 100, { align: 'center' });

  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  doc.setFontSize(16);
  doc.text('4ème Année', pageWidth / 2, 115, { align: 'center' });

  // Decorative line
  doc.setDrawColor(accentColor.r, accentColor.g, accentColor.b);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 30, 122, pageWidth / 2 + 30, 122);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(12);
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(date, pageWidth / 2, 132, { align: 'center' });

  doc.setFontSize(10);
  doc.text(
    `${responses.length} participant${responses.length > 1 ? 's' : ''}`,
    pageWidth / 2,
    145,
    { align: 'center' }
  );

  drawColorBar(pageHeight - 4, 4);

  // ── Response pages ──
  const questionColors = [BRAND_COLORS[0], BRAND_COLORS[1], BRAND_COLORS[3]]; // Blue, Orange, Green

  responses.forEach((response, index) => {
    doc.addPage();
    drawColorBar(0, 4);

    let yPosition = margin + 8;
    const responseColor = BRAND_COLORS[index % BRAND_COLORS.length];

    // Left accent line next to name
    doc.setDrawColor(responseColor.r, responseColor.g, responseColor.b);
    doc.setLineWidth(1);
    doc.line(margin - 5, yPosition - 5, margin - 5, yPosition + 15);

    // Name
    doc.setTextColor(responseColor.r, responseColor.g, responseColor.b);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(response.name, margin, yPosition);
    yPosition += 5;

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    const responseDate = new Date(response.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(responseDate, margin, yPosition);
    yPosition += 15;

    // Question 1
    const q1Color = questionColors[0];
    doc.setTextColor(q1Color.r, q1Color.g, q1Color.b);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[0].label, margin, yPosition);
    yPosition += 7;

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const q1Lines = doc.splitTextToSize(response.question1, maxWidth);
    doc.text(q1Lines, margin, yPosition);
    yPosition += q1Lines.length * 6 + 10;

    // Question 2
    const q2Color = questionColors[1];
    doc.setTextColor(q2Color.r, q2Color.g, q2Color.b);
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[1].label, margin, yPosition);
    yPosition += 7;

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    const q2Lines = doc.splitTextToSize(response.question2, maxWidth);
    doc.text(q2Lines, margin, yPosition);
    yPosition += q2Lines.length * 6 + 10;

    // Question 3
    const q3Color = questionColors[2];
    doc.setTextColor(q3Color.r, q3Color.g, q3Color.b);
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[2].label, margin, yPosition);
    yPosition += 7;

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'italic');
    const q3Lines = doc.splitTextToSize(response.question3, maxWidth);
    doc.text(q3Lines, margin, yPosition);

    // Page number
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      `${index + 2} / ${responses.length + 1}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    drawColorBar(pageHeight - 4, 4);
  });

  const fileName = `livre-or-remise-titres-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
