import { jsPDF } from 'jspdf';
import { Response } from '@/types';
import { QUESTIONS } from '@/types';

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

  // Cover page
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Livre d\'Or', pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.text('Remise des Titres', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(16);
  doc.text('4ème Année', pageWidth / 2, 115, { align: 'center' });

  doc.setFontSize(12);
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(date, pageWidth / 2, 130, { align: 'center' });

  doc.setFontSize(10);
  doc.text(
    `${responses.length} participant${responses.length > 1 ? 's' : ''}`,
    pageWidth / 2,
    145,
    { align: 'center' }
  );

  // Responses pages
  responses.forEach((response, index) => {
    doc.addPage();
    let yPosition = margin;

    // Name and date
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(response.name, margin, yPosition);
    yPosition += 5;

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

    doc.setTextColor(0, 0, 0);

    // Question 1
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[0].label, margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    const q1Lines = doc.splitTextToSize(response.question1, maxWidth);
    doc.text(q1Lines, margin, yPosition);
    yPosition += q1Lines.length * 6 + 10;

    // Question 2
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[1].label, margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    const q2Lines = doc.splitTextToSize(response.question2, maxWidth);
    doc.text(q2Lines, margin, yPosition);
    yPosition += q2Lines.length * 6 + 10;

    // Question 3
    doc.setFont('helvetica', 'bold');
    doc.text(QUESTIONS[2].label, margin, yPosition);
    yPosition += 7;

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
  });

  // Save the PDF
  const fileName = `livre-or-remise-titres-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
