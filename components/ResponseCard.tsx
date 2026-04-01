'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';
import { useMemo } from 'react';

interface ResponseCardProps {
  response: Response;
  index?: number;
  mode?: 'live' | 'recap';
  isAnonymous?: boolean;
}

// Palette de couleurs avec fond blanc et bordures colorées (Thème EPSI)
const COLORS = [
  { bg: '#FFFFFF', border: '#4B4B99', accent: '#4B4B99', name: 'Primary' },
  { bg: '#FFFFFF', border: '#261E48', accent: '#261E48', name: 'Primary Dark' },
  { bg: '#FFFFFF', border: '#D94759', accent: '#D94759', name: 'Gradient Start' },
  { bg: '#FFFFFF', border: '#FACF53', accent: '#FACF53', name: 'Jaune' },
  { bg: '#FFFFFF', border: '#8FBE54', accent: '#8FBE54', name: 'Vert' },
  { bg: '#FFFFFF', border: '#36B6D4', accent: '#36B6D4', name: 'Bleu clair' },
  { bg: '#FFFFFF', border: '#935B9E', accent: '#935B9E', name: 'Violet' },
];

// Formes de nuages plus subtiles
const CLOUD_SHAPES = [
  '60% 40% 55% 45% / 55% 50% 50% 45%',
  '55% 45% 45% 55% / 45% 55% 45% 55%',
  '65% 35% 50% 50% / 50% 65% 35% 50%',
  '45% 55% 55% 45% / 55% 45% 55% 45%',
];

export default function ResponseCard({ response, index = 0, mode = 'live', isAnonymous = false }: ResponseCardProps) {
  // Génération d'un style aléatoire mais constant pour chaque réponse
  const cardStyle = useMemo(() => {
    const seed = response.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = seed % COLORS.length;
    const shapeIndex = Math.floor(seed / COLORS.length) % CLOUD_SHAPES.length;
    const floatDelay = (seed % 10) * 0.5; // Délai pour l'animation de flottement

    return {
      color: COLORS[colorIndex],
      shape: CLOUD_SHAPES[shapeIndex],
      floatDelay,
    };
  }, [response.id]);

  return (
    <article
      className={`relative p-8 md:p-16 shadow-2xl transition-all duration-300 animate-fade-in w-full flex flex-col items-center justify-center text-center mx-auto overflow-hidden ${mode === 'live' ? 'min-h-[50vh] max-h-[85vh] h-full flex-1' : ''}`}
      style={{
        background: cardStyle.color.bg,
        borderRadius: '32px',
        border: `8px solid ${cardStyle.color.border}`,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Header */}
      {!isAnonymous && (
        <div className="flex flex-col items-center space-y-4 mb-12">
          {response.photo && (
            <img src={response.photo} alt={response.name || 'User'} className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-lg border-4" style={{ borderColor: cardStyle.color.accent }} />
          )}
          <h3
            className="text-4xl md:text-6xl font-bold font-['Playfair_Display']"
            style={{ color: cardStyle.color.accent }}
          >
            {response.name}
          </h3>
        </div>
      )}

      {/* Content */}
      <div className="space-y-12 max-w-5xl mx-auto w-full">
        {response.question1 && (
          <div>
            <p className="text-xl md:text-2xl font-medium uppercase tracking-wider mb-6" style={{ color: cardStyle.color.accent }}>
              {QUESTIONS[0].label}
            </p>
            <p className="text-3xl md:text-5xl leading-tight text-[#101820] font-['Playfair_Display']">
              "{response.question1}"
            </p>
          </div>
        )}

        {response.question2 && (
          <div>
            <p className="text-xl md:text-2xl font-medium uppercase tracking-wider mb-6" style={{ color: cardStyle.color.accent }}>
              {QUESTIONS[1].label}
            </p>
            <p className="text-3xl md:text-5xl leading-tight italic text-[#101820] font-['Playfair_Display']">
              "{response.question2}"
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
