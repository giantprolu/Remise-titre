'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Response, QUESTIONS } from '@/types';
import QRCodeDisplay from './QRCodeDisplay';
import { generateClassicPDF, generateAlbumPDF } from '@/lib/pdf';

const CYCLE_DURATION = 35;
const QUESTION_KEYS = ['question1', 'question2', 'question3'] as const;

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [responses, setResponses] = useState<Response[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CYCLE_DURATION);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);

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

  // Cycling timer
  useEffect(() => {
    if (!isAuthenticated) return;
    setTimeLeft(CYCLE_DURATION);
    cycleRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentQuestionIndex((qi) => (qi + 1) % QUESTIONS.length);
          return CYCLE_DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (cycleRef.current) clearInterval(cycleRef.current); };
  }, [isAuthenticated, currentQuestionIndex]);

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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-[#A7B0BE] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#A7B0BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-2">Espace Admin</h1>
          <p className="text-sm text-[#6B7280] mb-6">Accès réservé aux organisateurs</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
              placeholder="Mot de passe"
              className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-[#2E2E2E] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#A7B0BE] focus:border-transparent ${passwordError ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB]'}`}
              autoFocus
            />
            {passwordError && <p className="text-sm text-red-600">Mot de passe incorrect.</p>}
            <button disabled={isVerifying} type="submit" className="w-full bg-[#A7B0BE] hover:bg-[#96A0AE] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50">
              {isVerifying ? 'Vérification...' : 'Accéder'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Admin — vue questions ─────────────────────────────────────────────────
  const questionKey = QUESTION_KEYS[currentQuestionIndex];
  const answers = responses.filter((r) => r[questionKey]);
  const progress = ((CYCLE_DURATION - timeLeft) / CYCLE_DURATION) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E7EB] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E]">
              Remise des Titres — Admin
            </h1>
            {responses.length > 0 && (
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                {responses.length} message{responses.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/qr"
              target="_blank"
              className="px-4 py-2.5 bg-white text-[#2E2E2E] border border-[#E5E7EB] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:bg-[#F3F4F6] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6z" />
              </svg>
              QR Code
            </Link>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md ${isPaused ? 'bg-[#9FB8A0] text-white border-[#9FB8A0]' : 'bg-white text-[#2E2E2E] border-[#E5E7EB] hover:bg-[#F3F4F6]'}`}
            >
              {isPaused ? 'Reprendre' : 'Pause'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={responses.length === 0}
              className="px-4 py-2.5 bg-[#A7B0BE] hover:bg-[#96A0AE] text-white border border-[#A7B0BE] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Livre d&apos;or PDF
            </button>
            <button
              onClick={handleExportAlbum}
              disabled={responses.length === 0}
              className="px-4 py-2.5 bg-[#A7B0BE] hover:bg-[#96A0AE] text-white border border-[#A7B0BE] rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Album PDF
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Réinitialiser
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[#E5E7EB]">
          <div className="h-1 bg-[#A7B0BE] transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Question display */}
      <main className="pt-28 pb-16 px-6 md:px-10">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-widest">
              Question {currentQuestionIndex + 1} / {QUESTIONS.length}
            </span>
            <span className="text-xs font-mono text-white bg-[#A7B0BE] px-2 py-0.5 rounded-full">
              {timeLeft}s
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] font-semibold text-[#2E2E2E]">
            {QUESTIONS[currentQuestionIndex].label}
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-2">{answers.length} réponse{answers.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Navigation Q1 / Q2 / Q3 */}
        <div className="flex justify-center gap-2 mb-10">
          {QUESTIONS.map((q, i) => (
            <button
              key={q.id}
              onClick={() => { setCurrentQuestionIndex(i); setTimeLeft(CYCLE_DURATION); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${i === currentQuestionIndex ? 'bg-[#2E2E2E] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6]'}`}
            >
              Q{i + 1}
            </button>
          ))}
        </div>

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
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {answers.map((r) => (
              <div key={r.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex gap-4 items-start">
                {r.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.photo} alt={r.name} className="w-14 h-14 object-cover rounded-lg border border-[#E5E7EB] flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1">{r.name}</p>
                  <p className="text-[#2E2E2E] leading-relaxed">{r[questionKey]}</p>
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
        )}
      </main>

      <QRCodeDisplay />
    </div>
  );
}
