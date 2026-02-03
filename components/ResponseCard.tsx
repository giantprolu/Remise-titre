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
    <article
      className="bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F3F4F6]">
        <h3 className="text-xl font-semibold text-[#2E2E2E] font-['Playfair_Display']">
          {response.name}
        </h3>
        <time
          className="text-sm text-[#9CA3AF]"
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
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            {QUESTIONS[0].label}
          </p>
          <p className="text-base text-[#2E2E2E] leading-relaxed">
            {response.question1}
          </p>
        </div>

        {/* Question 2 */}
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            {QUESTIONS[1].label}
          </p>
          <p className="text-lg font-semibold text-[#2E2E2E] leading-relaxed">
            "{response.question2}"
          </p>
        </div>

        {/* Question 3 */}
        <div>
          <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
            {QUESTIONS[2].label}
          </p>
          <p className="text-base text-[#2E2E2E] leading-relaxed italic">
            {response.question3}
          </p>
        </div>
      </div>
    </article>
  );
}
