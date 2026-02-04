'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState('');
  const [currentToken, setCurrentToken] = useState('');

  const fetchTokenAndUpdateQR = async () => {
    try {
      const response = await fetch('/api/token');
      const data = await response.json();
      const token = data.token;

      setCurrentToken(token);
      const participantUrl = `${window.location.origin}/participate?token=${token}`;
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
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useEffect(() => {
    // Fetch token immediately
    fetchTokenAndUpdateQR();

    // Rotate token every 10 seconds
    const interval = setInterval(() => {
      fetchTokenAndUpdateQR();
    }, 10000);

    return () => clearInterval(interval);
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
