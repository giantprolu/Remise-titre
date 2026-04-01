'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { BRAND_COLORS } from '@/types';

export default function QRPrintPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanUrl, setScanUrl] = useState('');

  useEffect(() => {
    const url = `${window.location.origin}/scan`;
    setScanUrl(url);

    if (canvasRef.current) {
      const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
      const size = 400;
      const margin = 3;
      const moduleCount = qr.modules.size;
      const totalCount = moduleCount + margin * 2;
      const scale = Math.ceil(size / totalCount);
      const realSize = scale * totalCount;
      
      const canvas = canvasRef.current;
      canvas.width = realSize;
      canvas.height = realSize;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, realSize, realSize);
        
        // Découpage en sections (blocs de 5x5 modules) pour la couleur
        const sectionSize = 5;
        const colorGrid: string[][] = [];
        for (let r = 0; r < Math.ceil(moduleCount / sectionSize); r++) {
          const rowColors = [];
          for (let c = 0; c < Math.ceil(moduleCount / sectionSize); c++) {
            rowColors.push(BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)].hex);
          }
          colorGrid.push(rowColors);
        }
        
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.modules.data[row * moduleCount + col]) {
              const secR = Math.floor(row / sectionSize);
              const secC = Math.floor(col / sectionSize);
              ctx.fillStyle = colorGrid[secR][secC];
              ctx.fillRect((col + margin) * scale, (row + margin) * scale, scale, scale);
            }
          }
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 print:p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-2">
          Remise des Titres EPSI
        </h1>
        <p className="text-[#6B7280] text-lg mb-10">
          Scannez ce QR code pour signer le livre d&apos;or
        </p>

        <div className="inline-block p-6 border-4 border-[#2E2E2E] rounded-2xl mb-8">
          <canvas ref={canvasRef} className="block mx-auto" />
        </div>

        <p className="text-sm text-[#9CA3AF] mb-8">
          {scanUrl}
        </p>

        <div className="border-t border-[#E5E7EB] pt-8 space-y-2 text-[#6B7280] text-sm">
          <p>Partagez vos souvenirs et vos messages</p>
          <p>avec toute la promotion ✨</p>
        </div>

        <button
          onClick={() => window.print()}
          className="mt-10 px-6 py-3 bg-[#2E2E2E] text-white rounded-lg font-medium hover:bg-[#4B4B4B] transition-all print:hidden"
        >
          Imprimer
        </button>
      </div>
    </div>
  );
}
