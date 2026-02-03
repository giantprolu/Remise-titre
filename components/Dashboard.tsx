'use client';

import { useEffect, useState } from 'react';
import { Response } from '@/types';
import QRCodeDisplay from './QRCodeDisplay';
import ResponseCard from './ResponseCard';
import { generatePDF } from '@/lib/pdf';

export default function Dashboard() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [mode, setMode] = useState<'live' | 'recap'>('live');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchResponses();
    const interval = setInterval(() => {
      if (!isPaused) {
        fetchResponses();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const fetchResponses = async () => {
    try {
      const res = await fetch('/api/responses');
      const data = await res.json();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les réponses?')) {
      try {
        await fetch('/api/responses', { method: 'DELETE' });
        setResponses([]);
      } catch (error) {
        console.error('Error resetting responses:', error);
      }
    }
  };

  const handleExportPDF = () => {
    generatePDF(responses);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Remise des Titres - 4ème Année
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === 'live' ? 'recap' : 'live')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              {mode === 'live' ? 'Mode Récapitulatif' : 'Mode Live'}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              {isPaused ? 'Reprendre' : 'Pause'}
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              disabled={responses.length === 0}
            >
              Exporter en PDF
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          {responses.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-2xl text-gray-400">
                En attente des premières réponses...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {responses.map((response, index) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  index={index}
                  mode={mode}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* QR Code */}
      <QRCodeDisplay />
    </div>
  );
}
