'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';
import { useMemo } from 'react';

interface DecorativeCloudsProps {
  responses: Response[];
  onDelete?: (id: string) => void;
}

// Palette de couleurs pour les nuages (Theme EPSI)
const COLORS = [
  { bg: 'rgba(255, 255, 255, 0.95)', border: '#4B4B99', text: '#261E48' }, // Primary
  { bg: 'rgba(250, 248, 253, 0.95)', border: '#261E48', text: '#D94759' }, // Dark
  { bg: 'rgba(255, 255, 255, 0.95)', border: '#D94759', text: '#4B4B99' }, // Gradient Light
  { bg: 'rgba(253, 250, 245, 0.95)', border: '#FACF53', text: '#261E48' }, // Accent Jaune
  { bg: 'rgba(240, 250, 240, 0.95)', border: '#8FBE54', text: '#261E48' }, // Accent Vert
];

// Formes de nuages moins prononcées pour éviter le débordement
const CLOUD_SHAPES = [
  '55% 45% 50% 50% / 50% 50% 50% 50%',
  '50% 50% 48% 52% / 48% 52% 48% 52%',
  '52% 48% 50% 50% / 50% 52% 48% 50%',
  '48% 52% 52% 48% / 52% 48% 52% 48%',
];

export default function DecorativeClouds({ responses, onDelete }: DecorativeCloudsProps) {
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
              padding: '3rem 4rem',
              minWidth: '450px',
              maxWidth: '550px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            {/* Photo + delete */}
            {cloud.response.photo && (
              <div className="relative mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cloud.response.photo}
                  alt={cloud.response.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: `3px solid ${cloud.color.border}`,
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            )}

            {/* Nom + delete */}
            <div className="flex items-start justify-between w-full mb-4 pb-3 border-b-2" style={{ borderColor: cloud.color.border }}>
              <h3
                className="text-2xl font-bold font-['Playfair_Display'] flex-1 text-center"
                style={{ color: cloud.color.text }}
              >
                {cloud.response.name}
              </h3>
              {onDelete && (
                <button
                  onClick={() => onDelete(cloud.response.id)}
                  title="Supprimer ce message"
                  className="ml-2 p-1.5 rounded-lg opacity-40 hover:opacity-100 hover:bg-red-100 transition-all flex-shrink-0"
                  style={{ color: cloud.color.text }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Contenu */}
            <div className="space-y-3 w-full">
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
                  {QUESTIONS[1].label}
                </p>
                <p className="text-sm leading-relaxed italic" style={{ color: cloud.color.text }}>
                  {cloud.response.question2}
                </p>
              </div>
            </div>

            {/* Date */}
            <time
              className="text-xs mt-4 block opacity-60 text-center w-full"
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
