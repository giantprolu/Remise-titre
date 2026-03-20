'use client';

import { Response, BRAND_COLORS } from '@/types';
import { useMemo } from 'react';

interface ScrollingColumnsProps {
  responses: Response[];
}

interface ColumnItem {
  id: string;
  name: string;
  text: string;
  label: string;
  color: (typeof BRAND_COLORS)[number];
}

export default function ScrollingColumns({ responses }: ScrollingColumnsProps) {
  const columns = useMemo(() => {
    const items: ColumnItem[] = [];

    responses.forEach((r, i) => {
      if (r.question1.trim()) {
        items.push({
          id: `${r.id}-q1`,
          name: r.name,
          text: r.question1,
          label: 'Souvenir',
          color: BRAND_COLORS[i % BRAND_COLORS.length],
        });
      }
      if (r.question3.trim()) {
        items.push({
          id: `${r.id}-q3`,
          name: r.name,
          text: r.question3,
          label: 'Message',
          color: BRAND_COLORS[(i + 3) % BRAND_COLORS.length],
        });
      }
    });

    const cols: ColumnItem[][] = [[], [], [], []];
    items.forEach((item, i) => {
      cols[i % 4].push(item);
    });

    return cols;
  }, [responses]);

  const nonEmptyCols = columns.filter((col) => col.length > 0);

  if (nonEmptyCols.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div
        className="grid gap-3 flex-1 overflow-hidden min-h-0"
        style={{
          gridTemplateColumns: `repeat(${Math.min(nonEmptyCols.length, 4)}, 1fr)`,
        }}
      >
        {nonEmptyCols.map((col, colIndex) => (
          <div key={colIndex} className="overflow-hidden relative scrolling-col">
            <div
              className="flex flex-col gap-2 scroll-column-inner"
              style={{
                animation: `scrollUp ${30 + colIndex * 10}s linear infinite`,
              }}
            >
              {[...col, ...col].map((item, itemIndex) => (
                <div
                  key={`${item.id}-${itemIndex}`}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, 0.08)`,
                    borderLeft: `3px solid ${item.color.hex}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: item.color.hex }}
                    >
                      {item.name}
                    </p>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `rgba(${item.color.r}, ${item.color.g}, ${item.color.b}, 0.15)`,
                        color: item.color.hex,
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#2E2E2E] leading-snug">
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
