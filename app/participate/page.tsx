'use client';

import { useState } from 'react';
import { QUESTIONS } from '@/types';
import { useRouter } from 'next/navigation';

export default function ParticipatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    question1: '',
    question2: '',
    question3: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        setIsSubmitted(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Merci!</h2>
          <p className="text-gray-600 text-lg">
            Votre message a été enregistré avec succès.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Vous allez être redirigé vers le tableau...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Remise des Titres
            </h1>
            <p className="text-gray-600 text-lg">
              Partagez vos souvenirs et vos messages
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label
                htmlFor="question1"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder={QUESTIONS[0].placeholder}
              />
            </div>

            <div>
              <label
                htmlFor="question2"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder={QUESTIONS[1].placeholder}
              />
            </div>

            <div>
              <label
                htmlFor="question3"
                className="block text-sm font-semibold text-gray-700 mb-2"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder={QUESTIONS[2].placeholder}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
