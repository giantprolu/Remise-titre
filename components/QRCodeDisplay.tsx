'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { BRAND_COLORS } from '@/types';

export default function QRCodeDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchTokenAndUpdateQR = async () => {
    try {
      const response = await fetch('/api/token');
      const data = await response.json();
      const token = data.token;

      const participantUrl = `${window.location.origin}/participate?token=${token}`;

      if (canvasRef.current) {
        const qr = QRCode.create(participantUrl, { errorCorrectionLevel: 'M' });
        const size = 200;
        const margin = 1;
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
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    fetchTokenAndUpdateQR();
    const interval = setInterval(() => {
      fetchTokenAndUpdateQR();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsCollapsed(false)}
        className={`fixed bottom-2 right-2 w-10 h-10 bg-white border border-[#E5E7EB] rounded-lg shadow-md items-center justify-center hover:shadow-lg transition-all z-30 ${isCollapsed ? 'flex' : 'hidden'}`}
        title="Afficher le QR code"
      >
        <svg className="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6z" />
        </svg>
      </button>

      <div className={`fixed bottom-2 right-2 bg-white border border-[#E5E7EB] rounded-2xl p-2 shadow-lg z-30 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-medium text-[#6B7280]">Scannez pour participer</p>
          <button
            onClick={() => setIsCollapsed(true)}
            className="ml-3 p-1 text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6] rounded transition-all"
            title="Réduire"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <canvas ref={canvasRef} className="mx-auto block" />
      </div>
    </>
  );
}
