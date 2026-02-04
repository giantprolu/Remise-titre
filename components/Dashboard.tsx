'use client';

import { useEffect, useState } from 'react';
import { Response } from '@/types';
import QRCodeDisplay from './QRCodeDisplay';
import DecorativeClouds from './DecorativeClouds';
import { generatePDF } from '@/lib/pdf';

export default function Dashboard() {
  const [responses, setResponses] = useState<Response[]>([]);
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
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les réponses? Cela permettra à tout le monde de reparticiper.')) {
      try {
        await fetch('/api/responses', { method: 'DELETE' });
        setResponses([]);
        // Broadcast reset event to allow re-participation
        if (typeof window !== 'undefined') {
          localStorage.setItem('resetTimestamp', Date.now().toString());
          window.dispatchEvent(new CustomEvent('responsesReset'));
        }
      } catch (error) {
        console.error('Error resetting responses:', error);
      }
    }
  };

  const handleExportPDF = () => {
    generatePDF(responses);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      {/* Nuages avec les réponses */}
      <DecorativeClouds responses={responses} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E7EB] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-[#2E2E2E]">
            Remise des Titres
          </h1>
          <div className="flex flex-wrap gap-2">
            {/* Pause Button - Improved UX/UI */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${
                isPaused
                  ? 'bg-[#9FB8A0] text-white border-[#9FB8A0] hover:bg-[#8BA68C]'
                  : 'bg-white text-[#2E2E2E] border-[#E5E7EB] hover:bg-[#F3F4F6]'
              }`}
              aria-label={isPaused ? 'Reprendre la mise à jour automatique' : 'Mettre en pause la mise à jour automatique'}
              aria-pressed={isPaused}
            >
              <span className="flex items-center gap-2">
                {isPaused ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reprendre
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </>
                )}
              </span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-[#A7B0BE] hover:bg-[#96A0AE] text-white border border-[#A7B0BE] rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={responses.length === 0}
              aria-label="Exporter les réponses en PDF"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exporter PDF
              </span>
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-sm hover:shadow-md"
              aria-label="Supprimer toutes les réponses"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Réinitialiser
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Message si vide */}
      {responses.length === 0 && (
        <main className="pt-32 pb-32 px-4 md:px-8 relative z-10">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center py-32">
              <div className="mb-6">
                <svg className="w-20 h-20 text-[#9CA3AF] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-2xl font-['Playfair_Display'] text-[#6B7280] mb-2">
                Livre d'or vide
              </p>
              <p className="text-base text-[#9CA3AF]">
                En attente des premières réponses...
              </p>
              <p className="text-sm text-[#9CA3AF] mt-4">
                ☁️ Les réponses apparaîtront sous forme de nuages flottants
              </p>
            </div>
          </div>
        </main>
      )}

      {/* QR Code */}
      <QRCodeDisplay />
    </div>
  );
}
