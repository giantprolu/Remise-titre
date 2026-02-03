'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const participantUrl = `${window.location.origin}/participate`;
    setUrl(participantUrl);

    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, participantUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    }
  }, []);

  return (
    <div className="fixed bottom-8 right-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">
          Scannez pour participer
        </p>
        <canvas ref={canvasRef} className="mx-auto" />
      </div>
      <p className="text-xs text-gray-500 text-center max-w-[200px]">
        Partagez vos souvenirs et vos messages
      </p>
    </div>
  );
}
