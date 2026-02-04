'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';
import { useMemo } from 'react';

interface DecorativeCloudsProps {
  responses: Response[];
}

// Palette de couleurs pour les nuages
const COLORS = [
  { bg: 'rgba(255, 244, 230, 0.95)', border: '#F4A460', text: '#8B4513' }, // Sable
  { bg: 'rgba(232, 245, 233, 0.95)', border: '#90C695', text: '#2E7D32' }, // Vert
  { bg: 'rgba(227, 242, 253, 0.95)', border: '#7EB6D9', text: '#1565C0' }, // Bleu
  { bg: 'rgba(252, 228, 236, 0.95)', border: '#E8A5C0', text: '#C2185B' }, // Rose
  { bg: 'rgba(243, 229, 245, 0.95)', border: '#B5A8D6', text: '#7B1FA2' }, // Lavande
  { bg: 'rgba(255, 249, 196, 0.95)', border: '#F5D547', text: '#F57F17' }, // Jaune
  { bg: 'rgba(255, 235, 238, 0.95)', border: '#F08080', text: '#C62828' }, // Corail
];

// Formes de nuages
const CLOUD_SHAPES = [
  '60% 40% 70% 30% / 60% 50% 50% 40%',
  '50% 50% 40% 60% / 40% 60% 40% 60%',
  '70% 30% 50% 50% / 50% 70% 30% 50%',
  '40% 60% 60% 40% / 60% 40% 60% 40%',
];

export default function DecorativeClouds({ responses }: DecorativeCloudsProps) {
  // Générer les propriétés pour chaque réponse/nuage
  const clouds = useMemo(() => {
    return responses.map((response, index) => {
      const seed = response.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const colorIndex = seed % COLORS.length;
      const shapeIndex = Math.floor(seed / COLORS.length) % CLOUD_SHAPES.length;

      // Position verticale espacée
      const baseTop = (index * 25) % 80 + 10; // Distribution entre 10% et 90%
      const top = baseTop + (seed % 10) - 5; // Variation aléatoire de ±5%

      // Durée d'animation (plus lente pour la lisibilité)
      const duration = 60 + (seed % 40); // Entre 60s et 100s

      // Délai de départ échelonné
      const delay = -(index * 15) % duration; // Départ échelonné

      return {
        response,
        color: COLORS[colorIndex],
        shape: CLOUD_SHAPES[shapeIndex],
        top,
        duration,
        delay,
      };
    });
  }, [responses]);

  if (responses.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {clouds.map((cloud, index) => (
        <div
          key={cloud.response.id}
          className="cloud-container"
          style={{
            position: 'absolute',
            top: `${cloud.top}%`,
            left: '-600px',
            animation: `drift ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <div
            className="cloud-content"
            style={{
              background: cloud.color.bg,
              borderRadius: cloud.shape,
              border: `3px solid ${cloud.color.border}`,
              padding: '2rem',
              minWidth: '400px',
              maxWidth: '500px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            {/* Nom */}
            <h3
              className="text-xl font-bold font-['Playfair_Display'] mb-3 pb-3 border-b-2"
              style={{
                color: cloud.color.text,
                borderColor: cloud.color.border,
              }}
            >
              {cloud.response.name}
            </h3>

            {/* Contenu */}
            <div className="space-y-3">
              {/* Question 1 */}
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: cloud.color.text, opacity: 0.7 }}>
                  {QUESTIONS[0].label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: cloud.color.text }}>
                  {cloud.response.question1}
                </p>
              </div>

              {/* Question 2 */}
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: cloud.color.text, opacity: 0.7 }}>
                  {QUESTIONS[1].label}
                </p>
                <p className="text-base font-semibold leading-relaxed" style={{ color: cloud.color.text }}>
                  "{cloud.response.question2}"
                </p>
              </div>

              {/* Question 3 */}
              <div>
                <p className="text-xs font-medium uppercase mb-1" style={{ color: cloud.color.text, opacity: 0.7 }}>
                  {QUESTIONS[2].label}
                </p>
                <p className="text-sm leading-relaxed italic" style={{ color: cloud.color.text }}>
                  {cloud.response.question3}
                </p>
              </div>
            </div>

            {/* Date */}
            <time
              className="text-xs mt-3 block opacity-60"
              style={{ color: cloud.color.text }}
              dateTime={new Date(cloud.response.createdAt).toISOString()}
            >
              {new Date(cloud.response.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
              {' à '}
              {new Date(cloud.response.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
          </div>
        </div>
      ))}
    </div>
  );
}
