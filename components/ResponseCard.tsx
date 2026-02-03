'use client';

import { Response } from '@/types';
import { QUESTIONS } from '@/types';

interface ResponseCardProps {
  response: Response;
  index: number;
  mode: 'live' | 'recap';
}

export default function ResponseCard({ response, index, mode }: ResponseCardProps) {
  return (
    <div
      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{response.name}</h3>
        <span className="text-sm text-gray-500">
          {new Date(response.createdAt).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {QUESTIONS[0].label}
          </p>
          <p className="text-gray-800 leading-relaxed">{response.question1}</p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {QUESTIONS[1].label}
          </p>
          <p className="text-gray-800 leading-relaxed font-medium">
            {response.question2}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {QUESTIONS[2].label}
          </p>
          <p className="text-gray-800 leading-relaxed italic">{response.question3}</p>
        </div>
      </div>
    </div>
  );
}
