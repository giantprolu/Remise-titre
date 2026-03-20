'use client';

import { Response, BRAND_COLORS } from '@/types';
import { useMemo } from 'react';

interface WordCloudProps {
  responses: Response[];
}

export default function WordCloud({ responses }: WordCloudProps) {
  const words = useMemo(() => {
    const frequency: Record<string, { count: number; display: string }> = {};

    responses.forEach((r) => {
      const raw = r.question2.trim();
      if (!raw) return;
      const key = raw.toLowerCase();
      if (frequency[key]) {
        frequency[key].count++;
      } else {
        frequency[key] = { count: 1, display: raw };
      }
    });

    const wordList = Object.values(frequency).sort((a, b) => b.count - a.count);
    if (wordList.length === 0) return [];

    const maxCount = wordList[0].count;
    const minCount = wordList[wordList.length - 1].count;

    return wordList.map((word, index) => {
      const ratio =
        maxCount === minCount
          ? 0.5
          : (word.count - minCount) / (maxCount - minCount);
      const fontSize = 1.2 + ratio * 3.3; // 1.2rem to 4.5rem
      const color = BRAND_COLORS[index % BRAND_COLORS.length];
      const rotation = 0;

      return {
        text: word.display,
        count: word.count,
        fontSize,
        color,
        rotation,
      };
    });
  }, [responses]);

  if (words.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 max-w-6xl">
        {words.map((word) => (
          <span
            key={word.text}
            className="font-['Playfair_Display'] font-bold cursor-default transition-transform duration-200 hover:scale-110"
            style={{
              fontSize: `${word.fontSize}rem`,
              color: word.color.hex,
              transform: `rotate(${word.rotation}deg)`,
              lineHeight: 1.1,
            }}
            title={`${word.count} fois`}
          >
            {word.text}
          </span>
        ))}
      </div>
    </div>
  );
}
