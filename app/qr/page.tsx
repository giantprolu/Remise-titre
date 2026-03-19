'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRPrintPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanUrl, setScanUrl] = useState('');

  useEffect(() => {
    const url = `${window.location.origin}/scan`;
    setScanUrl(url);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 400,
        margin: 3,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 print:p-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-2">
          Remise des Titres
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
