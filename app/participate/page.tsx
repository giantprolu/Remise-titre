'use client';

import { useState, useEffect } from 'react';
import { QUESTIONS } from '@/types';
import Link from 'next/link';

export default function ParticipatePage() {
  const [formData, setFormData] = useState({
    name: '',
    question1: '',
    question2: '',
    question3: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has submitted before
    const savedResponseId = localStorage.getItem('userResponseId');
    const savedFormData = localStorage.getItem('userFormData');

    if (savedResponseId) {
      setHasSubmittedBefore(true);
      setResponseId(savedResponseId);

      if (savedFormData) {
        setFormData(JSON.parse(savedFormData));
      }
    }

    // Listen for reset events to allow re-participation
    const handleReset = () => {
      localStorage.removeItem('userResponseId');
      localStorage.removeItem('userFormData');
      setHasSubmittedBefore(false);
      setResponseId(null);
      setIsSubmitted(false);
      setFormData({
        name: '',
        question1: '',
        question2: '',
        question3: ''
      });
    };

    window.addEventListener('responsesReset', handleReset);

    return () => {
      window.removeEventListener('responsesReset', handleReset);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        // Save to localStorage to prevent re-submission
        localStorage.setItem('userResponseId', data.id);
        localStorage.setItem('userFormData', JSON.stringify(formData));
        setResponseId(data.id);
        setIsSubmitted(true);
        setHasSubmittedBefore(true);
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md w-full text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-[#9FB8A0] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-[#9FB8A0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
            Merci !
          </h2>
          <p className="text-[#6B7280] text-lg mb-6">
            Votre message a été enregistré avec succès dans le livre d'or.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-[#A7B0BE] hover:bg-[#96A0AE] text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Voir le livre d'or
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                // Allow editing by not redirecting
              }}
              className="px-6 py-3 bg-white hover:bg-[#F3F4F6] text-[#2E2E2E] border border-[#E5E7EB] rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Modifier mon message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
              {hasSubmittedBefore ? 'Modifier mon message' : 'Livre d\'Or'}
            </h1>
            <p className="text-[#6B7280] text-lg">
              {hasSubmittedBefore
                ? 'Vous pouvez modifier votre message ci-dessous'
                : 'Partagez vos souvenirs et vos messages'}
            </p>
          </div>

          {hasSubmittedBefore && (
            <div className="mb-8 p-4 bg-[#9FB8A0] bg-opacity-10 border border-[#9FB8A0] rounded-lg">
              <p className="text-sm text-[#2E2E2E] flex items-center gap-2">
                <svg className="w-5 h-5 text-[#9FB8A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  <strong>Note:</strong> Vous avez déjà soumis un message. Vous pouvez le modifier ici, mais vous ne pouvez pas soumettre un nouveau message.
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#2E2E2E] mb-2"
              >
                Votre nom / prénom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A7B0BE] focus:border-transparent outline-none transition-all text-[#2E2E2E] placeholder-[#9CA3AF]"
                placeholder="Jean Dupont"
              />
            </div>

            {/* Question 1 */}
            <div>
              <label
                htmlFor="question1"
                className="block text-sm font-semibold text-[#2E2E2E] mb-2"
              >
                {QUESTIONS[0].label}
              </label>
              <textarea
                id="question1"
                name="question1"
                value={formData.question1}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A7B0BE] focus:border-transparent outline-none transition-all resize-none text-[#2E2E2E] placeholder-[#9CA3AF]"
                placeholder={QUESTIONS[0].placeholder}
              />
            </div>

            {/* Question 2 */}
            <div>
              <label
                htmlFor="question2"
                className="block text-sm font-semibold text-[#2E2E2E] mb-2"
              >
                {QUESTIONS[1].label}
              </label>
              <input
                type="text"
                id="question2"
                name="question2"
                value={formData.question2}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A7B0BE] focus:border-transparent outline-none transition-all text-[#2E2E2E] placeholder-[#9CA3AF]"
                placeholder={QUESTIONS[1].placeholder}
              />
            </div>

            {/* Question 3 */}
            <div>
              <label
                htmlFor="question3"
                className="block text-sm font-semibold text-[#2E2E2E] mb-2"
              >
                {QUESTIONS[2].label}
              </label>
              <textarea
                id="question3"
                name="question3"
                value={formData.question3}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#A7B0BE] focus:border-transparent outline-none transition-all resize-none text-[#2E2E2E] placeholder-[#9CA3AF]"
                placeholder={QUESTIONS[2].placeholder}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A7B0BE] hover:bg-[#96A0AE] text-white font-semibold py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Envoi en cours...'
                : hasSubmittedBefore
                  ? 'Mettre à jour mon message'
                  : 'Signer le livre d\'or'}
            </button>

            <Link
              href="/"
              className="block text-center text-[#6B7280] hover:text-[#2E2E2E] text-sm transition-colors"
            >
              ← Retour au livre d'or
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
