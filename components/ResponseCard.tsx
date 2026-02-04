'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';
import { useMemo } from 'react';

interface ResponseCardProps {
  response: Response;
  index: number;
  mode: 'live' | 'recap';
}

// Palette de couleurs avec fond blanc et bordures colorées
const COLORS = [
  { bg: '#FFFFFF', border: '#F4A460', accent: '#F4A460', name: 'Sable' }, // Sable
  { bg: '#FFFFFF', border: '#90C695', accent: '#90C695', name: 'Vert' }, // Vert sage
  { bg: '#FFFFFF', border: '#7EB6D9', accent: '#7EB6D9', name: 'Bleu' }, // Bleu ciel
  { bg: '#FFFFFF', border: '#E8A5C0', accent: '#E8A5C0', name: 'Rose' }, // Rose
  { bg: '#FFFFFF', border: '#B5A8D6', accent: '#B5A8D6', name: 'Lavande' }, // Lavande
  { bg: '#FFFFFF', border: '#F5D547', accent: '#F5D547', name: 'Jaune' }, // Jaune
  { bg: '#FFFFFF', border: '#F08080', accent: '#F08080', name: 'Corail' }, // Corail
];

// Formes de nuages plus subtiles
const CLOUD_SHAPES = [
  '60% 40% 55% 45% / 55% 50% 50% 45%',
  '55% 45% 45% 55% / 45% 55% 45% 55%',
  '65% 35% 50% 50% / 50% 65% 35% 50%',
  '45% 55% 55% 45% / 55% 45% 55% 45%',
];

export default function ResponseCard({ response, index, mode }: ResponseCardProps) {
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
      className="relative p-8 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
      style={{
        background: cardStyle.color.bg,
        borderRadius: cardStyle.shape,
        border: `3px solid ${cardStyle.color.border}`,
        animationDelay: `${index * 0.05}s`,
        animation: `fade-in 0.5s ease-out forwards ${index * 0.05}s, float 6s ease-in-out infinite ${cardStyle.floatDelay}s`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: cardStyle.color.accent }}>
        <h3
          className="text-2xl font-bold font-['Playfair_Display']"
          style={{ color: cardStyle.color.accent }}
        >
          {response.name}
        </h3>
        <time
          className="text-sm text-[#6B7280]"
          dateTime={new Date(response.createdAt).toISOString()}
        >
          {new Date(response.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
          {' à '}
          {new Date(response.createdAt).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </time>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Question 1 */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: cardStyle.color.accent }}>
            {QUESTIONS[0].label}
          </p>
          <p className="text-base leading-relaxed text-[#2E2E2E]">
            {response.question1}
          </p>
        </div>

        {/* Question 2 */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: cardStyle.color.accent }}>
            {QUESTIONS[1].label}
          </p>
          <p className="text-lg font-semibold leading-relaxed text-[#2E2E2E]">
            "{response.question2}"
          </p>
        </div>

        {/* Question 3 */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: cardStyle.color.accent }}>
            {QUESTIONS[2].label}
          </p>
          <p className="text-base leading-relaxed italic text-[#2E2E2E]">
            {response.question3}
          </p>
        </div>
      </div>
    </article>
  );
}
