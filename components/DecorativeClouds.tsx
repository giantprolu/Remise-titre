'use client';

interface DecorativeCloudsProps {
  count?: number; // Nombre de nuages (défaut: 8)
}

export default function DecorativeClouds({ count = 8 }: DecorativeCloudsProps) {
  // Générer un tableau de nuages avec des propriétés aléatoires
  const clouds = Array.from({ length: count }, (_, i) => {
    const size = 80 + Math.random() * 120; // Taille entre 80px et 200px
    const top = Math.random() * 100; // Position verticale en %
    const duration = 40 + Math.random() * 40; // Durée d'animation entre 40s et 80s
    const delay = Math.random() * -30; // Délai négatif pour démarrer à des positions différentes
    const floatDuration = 4 + Math.random() * 4; // Durée de flottement entre 4s et 8s
    const floatDelay = Math.random() * 4; // Délai de flottement
    const scaleDuration = 8 + Math.random() * 8; // Durée de respiration entre 8s et 16s
    const scaleDelay = Math.random() * 8; // Délai de respiration
    const opacity = 0.3 + Math.random() * 0.4; // Opacité entre 0.3 et 0.7

    return {
      id: i,
      size,
      top,
      duration,
      delay,
      floatDuration,
      floatDelay,
      scaleDuration,
      scaleDelay,
      opacity,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            top: `${cloud.top}%`,
            left: '-200px',
            opacity: cloud.opacity,
            animation: `
              drift ${cloud.duration}s linear infinite,
              float ${cloud.floatDuration}s ease-in-out infinite ${cloud.floatDelay}s,
              breathe ${cloud.scaleDuration}s ease-in-out infinite ${cloud.scaleDelay}s
            `,
            animationDelay: `${cloud.delay}s, ${cloud.floatDelay}s, ${cloud.scaleDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
