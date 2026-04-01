import { jsPDF } from 'jspdf';
import { Response, QUESTIONS, BRAND_COLORS } from '@/types';

const DATE_STR = () =>
  new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

const YEAR = new Date().getFullYear();

// ─── Couleurs ─────────────────────────────────────────────────────────────────
const NAVY  = [15,  30,  70]  as const; // fond couverture / bandeau
const SAGE  = [159, 184, 160] as const; // accent vert sauge
const SAND  = [214, 211, 196] as const; // ligne décorative claire
const DARK  = [30,  30,  30]  as const; // texte principal
const MID   = [100, 100, 100] as const; // texte secondaire
const LIGHT = [180, 180, 180] as const; // texte tertiaire / bordures

const PALETTE_LIVRE = [
  [220,  71,  89], // Couleur 1
  [229, 131,  64], // Couleur 2
  [250, 209,  84], // Couleur 3
  [ 74,  75, 152], // Couleur 4
  [ 56, 184, 214], // Couleur 5
  [147,  91, 158], // Couleur 6
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hline(doc: jsPDF, x: number, y: number, w: number, r: number, g: number, b: number, lw = 0.4) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function drawBrandBar(doc: jsPDF, y: number, h: number, pageWidth: number) {
  const barW = pageWidth / PALETTE_LIVRE.length;
  PALETTE_LIVRE.forEach((c, i) => {
    doc.setFillColor(c[0], c[1], c[2]);
    doc.rect(i * barW, y, barW + 0.5, h, 'F');
  });
}

// ─── PDF Livre d'Or (2 personnes / page, design soigné) ───────────────────────

const loadLogoAsPngDataUrl = async (): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const scale = 3; // bonne résolution
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale || 300 * scale;
      canvas.height = img.height * scale || 100 * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, img.width || 300, img.height || 100);
        resolve(canvas.toDataURL('image/png'));
      } else {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = '/logo-navbar.webp';
  });
};

export async function generateClassicPDF(allResponses: Response[]) {
  const responses = allResponses.filter(r => !r.isAnonymous);
  const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW   = doc.internal.pageSize.getWidth();   // 210
  const PH   = doc.internal.pageSize.getHeight();  // 297
  const mH   = 18;                                  // marge horizontale
  const cW   = PW - 2 * mH;                        // largeur de contenu
  const logoPng = await loadLogoAsPngDataUrl();
  // ── Couverture ──────────────────────────────────────────────────────────────
  // Fond sable clair en pleine page
  doc.setFillColor(250, 248, 244);
  doc.rect(0, 0, PW, PH, 'F');

  // Bande latérale gauche navy
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 6, PH, 'F');

  // Ligne décorative à droite de la bande
  doc.setDrawColor(...SAGE);
  doc.setLineWidth(0.8);
  doc.line(6, 0, 6, PH);

  // Logo
  if (logoPng) {
    const logoW = 60;
    const logoH = 35; // ajuster au besoin
    doc.addImage(logoPng, 'PNG', (PW - logoW) / 2, 40, logoW, logoH);
  }

  // Grand titre
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Livre d\'Or', PW / 2, 90, { align: 'center' });

  // Ligne décorative sous le titre
  hline(doc, mH + 20, 100, cW - 40, ...SAGE, 1);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID);
  doc.text('Remise des Titres EPSI', PW / 2, 114, { align: 'center' });

  doc.setFontSize(13);
  doc.setTextColor(...LIGHT);
  doc.text(DATE_STR(), PW / 2, 127, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(...MID);
  doc.text(
    `${responses.length} participant${responses.length > 1 ? 's' : ''}`,
    PW / 2, 142, { align: 'center' }
  );

  // Barre de couleurs charte graphique
  drawBrandBar(doc, 170, 3, PW);

  // Millésime en grand en bas
  doc.setFontSize(72);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...SAND);
  doc.text(String(YEAR), PW / 2, 230, { align: 'center' });

  // ── Pages de réponses (2 par page) ─────────────────────────────────────────
  const perPage    = 2;
  const sectionH   = 124; // hauteur par section (2 × 124 + 2*marges = 294 ≈ PH)
  const topMargin  = 14;

  for (let p = 0; p < Math.ceil(responses.length / perPage); p++) {
    doc.addPage();

    // Fond
    doc.setFillColor(250, 248, 244);
    doc.rect(0, 0, PW, PH, 'F');

    // Bande latérale gauche navy
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, 6, PH, 'F');

    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...LIGHT);
    doc.text(`Remise des Titres EPSI · ${YEAR}`, mH, PH - 8);
    doc.text(`${p + 2} / ${Math.ceil(responses.length / perPage) + 1}`, PW - mH, PH - 8, { align: 'right' });
    hline(doc, mH, PH - 13, cW, ...SAND);

    for (let slot = 0; slot < perPage; slot++) {
      const idx = p * perPage + slot;
      if (idx >= responses.length) break;
      const r = responses[idx];
      const yBase = topMargin + slot * sectionH;

      // ── En-tête nom ──────────────────────────────────────────────────────
      const nameBarH = 26;

      const themeColor = PALETTE_LIVRE[idx % PALETTE_LIVRE.length];
      const lightTheme = [
        Math.round(255 - (255 - themeColor[0]) * 0.15),
        Math.round(255 - (255 - themeColor[1]) * 0.15),
        Math.round(255 - (255 - themeColor[2]) * 0.15)
      ];

      // Bloc nom : fond teinté très léger
      doc.setFillColor(lightTheme[0], lightTheme[1], lightTheme[2]);
      doc.rect(mH, yBase, cW, nameBarH, 'F');

      // Trait gauche accent
      doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
      doc.rect(mH, yBase, 3, nameBarH, 'F');

      // Photo si disponible
      const hasPhoto = !!r.photo;
      const photoSz = 24;
      if (hasPhoto) {
        doc.addImage(r.photo!, 'JPEG', PW - mH - photoSz, yBase + 1, photoSz, photoSz);
      }

      // Nom
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text(r.name, mH + 8, yBase + 11);

      // Date
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MID);
      const dateStr = new Date(r.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      doc.text(dateStr, mH + 8, yBase + 19);

      // ── Questions ────────────────────────────────────────────────────────
      const qItems = [
        { label: QUESTIONS[0].label, text: r.question1, style: 'normal' as const },
        { label: QUESTIONS[1].label, text: r.question2, style: 'bolditalic' as const },
      ];

      let y = yBase + nameBarH + 7;

      qItems.forEach(({ label, text, style }, qi) => {
        // Numéro de question dans un petit cercle (couleur du thème actuel)
        doc.setFillColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.circle(mH + 3, y - 1, 3, 'F');
        doc.setFontSize(6.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(String(qi + 1), mH + 3, y + 0.5, { align: 'center' });

        // Label question
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
        doc.text(label.toUpperCase(), mH + 9, y);

        y += 5.5;

        // Texte réponse
        doc.setFontSize(10);
        doc.setFont('helvetica', style === 'bolditalic' ? 'bolditalic' : style);
        doc.setTextColor(...DARK);
        const lines = doc.splitTextToSize(text, cW - (hasPhoto && qi === 0 ? photoSz + 6 : 0) - 10);
        const maxLines = 3;
        const clipped = lines.slice(0, maxLines) as string[];
        if (lines.length > maxLines) clipped[maxLines - 1] = (clipped[maxLines - 1] as string).replace(/.{0,3}$/, '…');
        doc.text(clipped, mH + 9, y, { lineHeightFactor: 1.4 });
        y += clipped.length * 6 + 5;
      });

      // Séparateur entre les deux sections (sauf dernière)
      if (slot === 0 && p * perPage + 1 < responses.length) {
        const sepY = topMargin + sectionH;
        hline(doc, mH, sepY, cW, ...SAND, 0.6);
        // Petit losange décoratif au centre du séparateur
        doc.setFillColor(...SAND);
        doc.rect(PW / 2 - 2, sepY - 2, 4, 4, 'F');
      }
    }
  }

  doc.save(`livre-or-${new Date().toISOString().split('T')[0]}.pdf`);
}

// ─── PDF Album (paysage, style yearbook américain) ────────────────────────────
// Layout : 3 colonnes × 2 lignes = 6 par page, A4 paysage

const ALBUM_COLS    = 3;
const ALBUM_ROWS    = 2;
const ALBUM_PER_PAGE = ALBUM_COLS * ALBUM_ROWS;

export async function generateAlbumPDF(allResponses: Response[]) {
  const responses = allResponses.filter(r => !r.isAnonymous);
  const doc  = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW   = doc.internal.pageSize.getWidth();   // 297
  const PH   = doc.internal.pageSize.getHeight();  // 210

  const logoPng = await loadLogoAsPngDataUrl();

  const HEADER_H = 12;
  const mH = 10;
  const mV = 10;
  const gH = 8;
  const gV = 8;

  // Zone disponible après header + marges
  const availW = PW - 2 * mH - (ALBUM_COLS - 1) * gH;
  const availH = PH - HEADER_H - mV - (ALBUM_ROWS - 1) * gV;

  const cellW = availW / ALBUM_COLS;          // ≈ 85mm
  const cellH = availH / ALBUM_ROWS;          // ≈ 85mm
  const photoSz = Math.min(cellW * 0.75, cellH - 30); // carré, laisse 30mm pour le texte

  // ── Couverture ──────────────────────────────────────────────────────────────
  // Fond sable clair en pleine page
  doc.setFillColor(250, 248, 244);
  doc.rect(0, 0, PW, PH, 'F');

  // Bande latérale gauche navy
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, 6, PH, 'F');

  // Ligne décorative à droite de la bande
  doc.setDrawColor(...SAGE);
  doc.setLineWidth(0.8);
  doc.line(6, 0, 6, PH);

  // Bande sage en bas
  doc.setFillColor(...SAGE);
  doc.rect(0, PH - 18, PW, 18, 'F');

  // Logo
  if (logoPng) {
    const logoW = 60;
    const logoH = 35; // ajuster au besoin
    doc.addImage(logoPng, 'PNG', (PW - logoW) / 2, 25, logoW, logoH);
  }

  doc.setFontSize(52);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('ALBUM PROMO', PW / 2, 80, { align: 'center' });

  doc.setFontSize(20);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID);
  doc.text('Remise des Titres EPSI', PW / 2, 100, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(...MID);
  doc.text(`${responses.length} participant${responses.length > 1 ? 's' : ''}  ·  ${DATE_STR()}`, PW / 2, 114, { align: 'center' });

  // Barre de couleurs charte graphique au-dessus de la bande basse
  drawBrandBar(doc, PH - 18 - 3, 3, PW);

  // Année dans la bande basse
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(String(YEAR), PW / 2, PH - 5, { align: 'center' });

  // ── Pages grille ────────────────────────────────────────────────────────────
  responses.forEach((response, i) => {
    const posInPage = i % ALBUM_PER_PAGE;

    if (posInPage === 0) {
      doc.addPage();

      // Fond ivoire
      doc.setFillColor(252, 250, 246);
      doc.rect(0, 0, PW, PH, 'F');

      // Bandeau header navy
      doc.setFillColor(...NAVY);
      doc.rect(0, 0, PW, HEADER_H, 'F');

      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 210, 240);
      doc.text(`REMISE DES TITRES EPSI  ·  ${YEAR}`, PW / 2, 7.5, { align: 'center' });

      // Trait accent sage sous le header
      doc.setDrawColor(...SAGE);
      doc.setLineWidth(0.8);
      doc.line(0, HEADER_H, PW, HEADER_H);
    }

    const col = posInPage % ALBUM_COLS;
    const row = Math.floor(posInPage / ALBUM_COLS);
    const cx  = mH + col * (cellW + gH);
    const cy  = HEADER_H + mV + row * (cellH + gV);

    // ── Photo ────────────────────────────────────────────────────────────────
    const photoX = cx + (cellW - photoSz) / 2;
    const photoY = cy;

    // Fond placeholder
    doc.setFillColor(228, 228, 228);
    doc.rect(photoX, photoY, photoSz, photoSz, 'F');

    if (response.photo) {
      doc.addImage(response.photo, 'JPEG', photoX, photoY, photoSz, photoSz);
    } else {
      // Initiales centrées
      const initials = response.name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...LIGHT);
      doc.text(initials, photoX + photoSz / 2, photoY + photoSz / 2 + 4, { align: 'center' });
    }

    // Bordure fine autour de la photo
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.25);
    doc.rect(photoX, photoY, photoSz, photoSz);

    // ── Texte sous la photo ───────────────────────────────────────────────────
    const textY = photoY + photoSz + 5;

    // Trait accent sage centré
    const traitW = Math.min(cellW * 0.5, 30);
    doc.setDrawColor(...SAGE);
    doc.setLineWidth(0.8);
    doc.line(cx + cellW / 2 - traitW / 2, textY - 2, cx + cellW / 2 + traitW / 2, textY - 2);

    // Nom
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    const nameText = doc.splitTextToSize(response.name, cellW)[0] as string;
    doc.text(nameText, cx + cellW / 2, textY + 3, { align: 'center' });

    // Année
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...LIGHT);
    doc.text(String(YEAR), cx + cellW / 2, textY + 8, { align: 'center' });

    // Citation Q3
    if (response.question2) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...MID);
      const raw   = `"${response.question2}"`;
      const lines = doc.splitTextToSize(raw, cellW - 4) as string[];
      const maxL  = 2;
      const clipped = lines.slice(0, maxL);
      if (lines.length > maxL) clipped[maxL - 1] = clipped[maxL - 1].replace(/.{0,3}$/, '…');
      doc.text(clipped, cx + cellW / 2, textY + 16, { align: 'center', lineHeightFactor: 1.3 });
    }
  });

  doc.save(`album-promo-${new Date().toISOString().split('T')[0]}.pdf`);
}

export const generatePDF = generateClassicPDF;
