'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';
import { useMemo } from 'react';

interface ResponseCardProps {
  response: Response;
  index: number;
  mode: 'live' | 'recap';
}

// Palette de couleurs pastels et chaleureuses
const COLORS = [
  { bg: '#FFF4E6', border: '#FFE4C4', text: '#8B4513' }, // Beige chaud
  { bg: '#E8F5E9', border: '#C8E6C9', text: '#2E7D32' }, // Vert sage
  { bg: '#E3F2FD', border: '#BBDEFB', text: '#1565C0' }, // Bleu clair
  { bg: '#FCE4EC', border: '#F8BBD0', text: '#C2185B' }, // Rose poudré
  { bg: '#F3E5F5', border: '#E1BEE7', text: '#7B1FA2' }, // Lavande
  { bg: '#FFF9C4', border: '#FFF59D', text: '#F57F17' }, // Jaune doux
  { bg: '#FFEBEE', border: '#FFCDD2', text: '#C62828' }, // Rouge doux
];

// Variations de polices
const FONTS = [
  "'Playfair Display', serif",
  "'Inter', sans-serif",
  "Georgia, serif",
  "'Courier New', monospace",
];

// Formes de nuages (en utilisant border-radius)
const CLOUD_SHAPES = [
  '60% 40% 70% 30% / 60% 50% 50% 40%',
  '50% 50% 40% 60% / 40% 60% 40% 60%',
  '70% 30% 50% 50% / 50% 70% 30% 50%',
  '40% 60% 60% 40% / 60% 40% 60% 40%',
];

export default function ResponseCard({ response, index, mode }: ResponseCardProps) {
  // Génération d'un style aléatoire mais constant pour chaque réponse
  const cardStyle = useMemo(() => {
    const seed = response.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = seed % COLORS.length;
    const fontIndex = Math.floor(seed / COLORS.length) % FONTS.length;
    const shapeIndex = Math.floor(seed / (COLORS.length * FONTS.length)) % CLOUD_SHAPES.length;
    const rotation = (seed % 7) - 3; // Rotation entre -3 et 3 degrés
    const floatDelay = (seed % 10) * 0.5; // Délai pour l'animation de flottement

    return {
      color: COLORS[colorIndex],
      font: FONTS[fontIndex],
      shape: CLOUD_SHAPES[shapeIndex],
      rotation,
      floatDelay,
    };
  }, [response.id]);

  return (
    <article
      className="relative p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
      style={{
        background: cardStyle.color.bg,
        borderRadius: cardStyle.shape,
        border: `2px solid ${cardStyle.color.border}`,
        transform: `rotate(${cardStyle.rotation}deg)`,
        animationDelay: `${index * 0.05}s`,
        animation: `fade-in 0.5s ease-out forwards ${index * 0.05}s, float 6s ease-in-out infinite ${cardStyle.floatDelay}s`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b opacity-30" style={{ borderColor: cardStyle.color.text }}>
        <h3
          className="text-2xl font-bold"
          style={{
            color: cardStyle.color.text,
            fontFamily: cardStyle.font
          }}
        >
          {response.name}
        </h3>
        <time
          className="text-sm opacity-70"
          style={{ color: cardStyle.color.text }}
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
          <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-60" style={{ color: cardStyle.color.text }}>
            {QUESTIONS[0].label}
          </p>
          <p className="text-base leading-relaxed" style={{ color: cardStyle.color.text }}>
            {response.question1}
          </p>
        </div>

        {/* Question 2 */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-60" style={{ color: cardStyle.color.text }}>
            {QUESTIONS[1].label}
          </p>
          <p className="text-lg font-semibold leading-relaxed" style={{ color: cardStyle.color.text }}>
            "{response.question2}"
          </p>
        </div>

        {/* Question 3 */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-60" style={{ color: cardStyle.color.text }}>
            {QUESTIONS[2].label}
          </p>
          <p className="text-base leading-relaxed italic" style={{ color: cardStyle.color.text }}>
            {response.question3}
          </p>
        </div>
      </div>
    </article>
  );
}
