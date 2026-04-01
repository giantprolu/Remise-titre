'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Response, QUESTIONS } from '@/types';
import QRCodeDisplay from './QRCodeDisplay';
import ResponseCard from './ResponseCard';
import { generateClassicPDF, generateAlbumPDF } from '@/lib/pdf';


export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [responses, setResponses] = useState<Response[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  // New states for the requested features
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('adminAuth');
      if (auth === 'true') setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        setPasswordError(false);
      } else {
        setPasswordError(true);
        setPasswordInput('');
      }
    } catch {
      setPasswordError(true);
      setPasswordInput('');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchResponses = useCallback(async () => {
    try {
      const res = await fetch('/api/responses');
      const data = await res.json();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchResponses();
    const interval = setInterval(() => {
      if (!isPaused) fetchResponses();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, fetchResponses, isAuthenticated]);

  useEffect(() => {
    if (responses.length === 0 || isPaused) return;

    // Commencez la diapositive en mode anonyme
    setIsAnonymous(true);
    
    // Affichez le nom après 3.5s
    const anonymousTimer = setTimeout(() => {
      setIsAnonymous(false);
    }, 3500);

    // Passez à la diapositive suivante après 7s
    const slideInterval = setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % responses.length);
    }, 7000);

    return () => {
      clearTimeout(anonymousTimer);
      clearTimeout(slideInterval);
    };
  }, [responses.length, isPaused, currentSlideIndex]);

  const handleReset = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer toutes les réponses ? Cela permettra à tout le monde de reparticiper.')) {
      try {
        await fetch('/api/responses', { method: 'DELETE' });
        setResponses([]);
        if (typeof window !== 'undefined') {
          localStorage.setItem('resetTimestamp', Date.now().toString());
          window.dispatchEvent(new CustomEvent('responsesReset'));
        }
      } catch (error) {
        console.error('Error resetting responses:', error);
      }
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await fetch(`/api/responses/${id}`, { method: 'DELETE' });
      setResponses((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting response:', error);
    }
  };

  const handleExportPDF = async () => {
    const res = await fetch('/api/responses?full=1');
    generateClassicPDF(await res.json());
  };

  const handleExportAlbum = async () => {
    const res = await fetch('/api/responses?full=1');
    generateAlbumPDF(await res.json());
  };

  // ─── Password gate ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-[#4B4B99] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#4B4B99]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#101820] mb-2">Espace Admin</h1>
          <p className="text-sm text-[#4b5563] mb-6">Accès réservé aux organisateurs</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="Mot de passe"
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-[#101820] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#4B4B99] focus:border-transparent ${passwordError ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB]'}`}
              autoFocus
            />
            {passwordError && <p className="text-sm text-red-600">Mot de passe incorrect.</p>}
            <button disabled={isVerifying} type="submit" className="w-full bg-[#4B4B99] hover:bg-[#261E48] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50">
              {isVerifying ? 'Vérification...' : 'Accéder'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Admin — vue questions ─────────────────────────────────────────────────
  
  const answers = responses;
  

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col pt-16">
      {/* Header */}
      <header className="fixed w-full top-0 left-0 bg-white border-b border-[#E5E7EB] z-30 shadow-sm">
        {isNavCollapsed ? (
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-['Playfair_Display'] text-[#9CA3AF]">Remise des Titres</span>
            <button
              onClick={() => setIsNavCollapsed(false)}
              className="p-1.5 text-[#9CA3AF] hover:text-[#4b5563] hover:bg-[#F3F4F6] rounded-lg transition-all text-xs flex items-center gap-1"
              title="Afficher la barre de navigation"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#101820]">
                Remise des Titres — Admin
              </h1>
              {responses.length > 0 && (
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {responses.length} message{responses.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Link
                href="/qr"
                target="_blank"
                className="px-4 py-2.5 bg-white text-[#101820] border border-[#E5E7EB] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:bg-[#F3F4F6] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6z" />
                </svg>
                QR Code
              </Link>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${isPaused ? 'bg-[#261E48] text-white border-[#261E48]' : 'bg-white text-[#101820] border-[#E5E7EB] hover:bg-[#F3F4F6]'}`}
              >
                {isPaused ? 'Reprendre' : 'Pause'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={responses.length === 0}
                className="px-4 py-2.5 bg-[#4B4B99] hover:bg-[#261E48] text-white border border-[#4B4B99] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Livre d&apos;or PDF
              </button>
              <button
                onClick={handleExportAlbum}
                disabled={responses.length === 0}
                className="px-4 py-2.5 bg-[#4B4B99] hover:bg-[#261E48] text-white border border-[#4B4B99] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Album PDF
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsNavCollapsed(true)}
                className="px-3 py-2.5 bg-white text-[#9CA3AF] border border-[#E5E7EB] rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:bg-[#F3F4F6]"
                title="Réduire la barre de navigation"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Question display */}
      <main className="flex-1 py-8 px-6 md:px-10 transition-all duration-300 flex flex-col">
        {/* Answers */}
        {responses.length === 0 ? (
          <div className="text-center py-32 text-[#9CA3AF]">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-xl font-['Playfair_Display']">Livre d&apos;or vide</p>
            <p className="text-sm mt-2">En attente des premières réponses...</p>
          </div>
        ) : answers.length === 0 ? (
          <div className="text-center py-20 text-[#9CA3AF]">
            <p className="text-lg">Aucune réponse pour cette question</p>
          </div>
        ) : (
          /* Q1 / Q2 — Diaporama (Slide Show) */
          <div className="max-w-6xl mx-auto w-full flex-1 flex items-center justify-center p-4">
            {responses.length > 0 && currentSlideIndex < responses.length && (
              <ResponseCard
                response={responses[currentSlideIndex]}
                isAnonymous={isAnonymous}
                mode="live"
              />
            )}
          </div>
        )}

        {/* Admin — gestion des réponses */}
        {answers.length > 0 && (
          <details className="max-w-4xl mx-auto mt-10">
            <summary className="cursor-pointer text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors select-none">
              Gestion des réponses ({answers.length})
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {answers.map((r) => (
                <div key={r.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm flex gap-3 items-start">
                  {r.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photo} alt={r.name} className="w-12 h-12 object-cover rounded-lg border border-[#E5E7EB] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{r.name}</p>
                    <p className="text-sm text-[#101820] leading-relaxed line-clamp-2">{r.question1}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOne(r.id)}
                    title="Supprimer ce message"
                    className="flex-shrink-0 p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </details>
        )}
      </main>

      <QRCodeDisplay />
    </div>
  );
}
