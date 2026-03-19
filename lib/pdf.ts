import { jsPDF } from 'jspdf';
import { Response } from '@/types';
import { QUESTIONS } from '@/types';

const TODAY = () =>
  new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// ─── PDF classique (toutes les questions) ────────────────────────────────────

export function generateClassicPDF(responses: Response[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  // Cover
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Livre d\'Or', pageWidth / 2, 80, { align: 'center' });
  doc.setFontSize(24);
  doc.setFont('helvetica', 'normal');
  doc.text('Remise des Titres', pageWidth / 2, 100, { align: 'center' });
  doc.setFontSize(14);
  doc.text(TODAY(), pageWidth / 2, 118, { align: 'center' });
  doc.setFontSize(10);
  doc.text(
    `${responses.length} participant${responses.length > 1 ? 's' : ''}`,
    pageWidth / 2,
    132,
    { align: 'center' }
  );

  responses.forEach((response, index) => {
    doc.addPage();
    let y = margin;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(response.name, margin, y);
    y += 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      new Date(response.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
      margin,
      y
    );
    y += 15;
    doc.setTextColor(0, 0, 0);

    ([
      { label: QUESTIONS[0].label, text: response.question1, style: 'normal' as const },
      { label: QUESTIONS[1].label, text: response.question2, style: 'bold' as const },
      { label: QUESTIONS[2].label, text: response.question3, style: 'italic' as const },
    ]).forEach(({ label, text, style }) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, y);
      y += 7;
      doc.setFont('helvetica', style);
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      y += lines.length * 6 + 10;
    });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(`${index + 2} / ${responses.length + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  });

  doc.save(`livre-or-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ─── PDF album (style yearbook américain) ────────────────────────────────────

// Layout : 3 colonnes × 3 lignes = 9 entrées par page
// Chaque entrée : photo carrée → nom bold → année → citation italic

const ALBUM_COLS = 3;
const ALBUM_ROWS = 3;
const ALBUM_PER_PAGE = ALBUM_COLS * ALBUM_ROWS;

export function generateAlbumPDF(responses: Response[]) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = doc.internal.pageSize.getWidth();   // 210
  const PH = doc.internal.pageSize.getHeight();  // 297
  const year = new Date().getFullYear();

  // Marges et espacements
  const mH = 10;   // marge horizontale
  const mV = 14;   // marge verticale
  const gH = 6;    // espace entre colonnes
  const gV = 8;    // espace entre lignes

  // Dimensions d'une cellule
  const cellW = (PW - 2 * mH - (ALBUM_COLS - 1) * gH) / ALBUM_COLS; // ≈ 56mm
  // Photo : carrée, prend toute la largeur de la cellule
  const photoH = cellW; // carré
  // Zone texte sous la photo : nom (4.5mm) + année (3.5mm) + citation (jusqu'à 3 lignes ≈ 9mm) + padding = ~20mm
  const textZone = 20;
  const cellH = photoH + textZone;

  // ── Page de couverture ─────────────────────────────────────────────────────
  // Fond bleu marine style yearbook
  doc.setFillColor(15, 30, 70);
  doc.rect(0, 0, PW, PH, 'F');

  // Titre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.text('ALBUM PROMO', PW / 2, 110, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'normal');
  doc.text('Remise des Titres', PW / 2, 130, { align: 'center' });

  doc.setFontSize(52);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 210, 240);
  doc.text(String(year), PW / 2, 175, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 175, 210);
  doc.text(
    `${responses.length} participant${responses.length > 1 ? 's' : ''}`,
    PW / 2, 195, { align: 'center' }
  );

  // ── Pages grille ──────────────────────────────────────────────────────────
  responses.forEach((response, i) => {
    const posInPage = i % ALBUM_PER_PAGE;
    if (posInPage === 0) {
      doc.addPage();
      // Fond blanc
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, PW, PH, 'F');
      // Bande de titre en haut
      doc.setFillColor(15, 30, 70);
      doc.rect(0, 0, PW, 10, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 210, 240);
      doc.text(`REMISE DES TITRES  ·  ${year}`, PW / 2, 6.5, { align: 'center' });
    }

    const col = posInPage % ALBUM_COLS;
    const row = Math.floor(posInPage / ALBUM_COLS);
    const x = mH + col * (cellW + gH);
    const y = 12 + row * (cellH + gV); // 12 = sous la bande titre

    // ── Photo ──────────────────────────────────────────────────────────────
    // Fond gris clair (visible aussi avec photo)
    doc.setFillColor(235, 235, 235);
    doc.rect(x, y, cellW, photoH, 'F');

    if (response.photo) {
      doc.addImage(response.photo, 'JPEG', x, y, cellW, photoH);
    } else {
      // Placeholder avec initiales
      const initials = response.name
        .split(' ')
        .map((n) => n[0] ?? '')
        .join('')
        .toUpperCase()
        .slice(0, 2);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 180, 180);
      doc.text(initials, x + cellW / 2, y + photoH / 2 + 3, { align: 'center' });
    }

    // Fine bordure autour de la photo
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(x, y, cellW, photoH);

    // ── Nom ────────────────────────────────────────────────────────────────
    const nameY = y + photoH + 4.5;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    // Tronquer si trop long
    const nameText = doc.splitTextToSize(response.name, cellW)[0] ?? response.name;
    doc.text(nameText, x + cellW / 2, nameY, { align: 'center' });

    // ── Année ─────────────────────────────────────────────────────────────
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text(String(year), x + cellW / 2, nameY + 4, { align: 'center' });

    // ── Citation (Q3) ──────────────────────────────────────────────────────
    if (response.question3) {
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(70, 70, 70);
      const raw = `"${response.question3}"`;
      const lines = doc.splitTextToSize(raw, cellW - 2);
      const maxLines = 3;
      const clipped = lines.slice(0, maxLines) as string[];
      if (lines.length > maxLines) {
        clipped[maxLines - 1] = (clipped[maxLines - 1] as string).replace(/.{1,3}$/, '…');
      }
      doc.text(clipped, x + cellW / 2, nameY + 9, { align: 'center', lineHeightFactor: 1.3 });
    }
  });

  doc.save(`album-promo-${new Date().toISOString().split('T')[0]}.pdf`);
}

// Kept for backward compatibility
export const generatePDF = generateClassicPDF;
