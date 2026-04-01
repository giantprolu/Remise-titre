'use client';

import { Response, BRAND_COLORS } from '@/types';
import { useMemo } from 'react';

interface ScrollingColumnsProps {
  responses: Response[];
  questionKey: 'question1' | 'question2';
}

interface ColumnItem {
  id: string;
  name: string;
  text: string;
  color: (typeof BRAND_COLORS)[number];
}

export default function ScrollingColumns({ responses, questionKey }: ScrollingColumnsProps) {
  const columns = useMemo(() => {
    const items: ColumnItem[] = [];

    responses.forEach((r, i) => {
      const text = r[questionKey].trim();
      if (text) {
        items.push({
          id: r.id,
          name: r.name,
          text,
          color: BRAND_COLORS[i % BRAND_COLORS.length],
        });
      }
    });

    const cols: ColumnItem[][] = [[], [], []];
    items.forEach((item, i) => {
      cols[i % 3].push(item);
    });

    return cols;
  }, [responses, questionKey]);

  const nonEmptyCols = columns.filter((col) => col.length > 0);

  if (nonEmptyCols.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div
        className="grid gap-3 flex-1 overflow-hidden min-h-0"
        style={{
          gridTemplateColumns: `repeat(${Math.min(nonEmptyCols.length, 3)}, 1fr)`,
        }}
      >
        {nonEmptyCols.map((col, colIndex) => (
          <div key={colIndex} className="overflow-hidden flex flex-col justify-end">
            <div className="flex flex-col gap-2">
              {col.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg animate-fade-in"
                  style={{
                    backgroundColor: `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, 0.08)`,
                    borderLeft: `3px solid ${item.color.hex}`,
                  }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: item.color.hex }}
                  >
                    {item.name}
                  </p>
                  <p className="text-sm text-[#101820] leading-snug">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
