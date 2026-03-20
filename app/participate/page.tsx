'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QUESTIONS } from '@/types';

function ParticipateForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    question1: '',
    question2: '',
    question3: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [responseDeleted, setResponseDeleted] = useState(false);
  const [, setResponseId] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');

  useEffect(() => {
    // Validate token first
    const validateToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setIsValidatingToken(false);
        setIsTokenValid(false);
        setTokenError('Aucun token fourni. Veuillez scanner le QR code pour accéder au formulaire.');
        return;
      }

      try {
        const response = await fetch('/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.valid) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          setTokenError(
            data.reason === 'Token expired'
              ? 'Ce QR code a expiré. Veuillez scanner le nouveau QR code.'
              : 'Token invalide. Veuillez scanner le QR code pour accéder au formulaire.'
          );
        }
      } catch (error) {
        console.error('Error validating token:', error);
        setIsTokenValid(false);
        setTokenError('Erreur de validation. Veuillez réessayer.');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();

    // Check if user has submitted before and if their response still exists
    const checkUserSubmission = async () => {
      const savedResponseId = localStorage.getItem('userResponseId');
      const savedFormData = localStorage.getItem('userFormData');
      const submissionTimestamp = localStorage.getItem('submissionTimestamp');
      const resetTimestamp = localStorage.getItem('resetTimestamp');

      // If there's a reset timestamp but the saved data doesn't have a submission timestamp,
      // it means the data is from before the reset feature - clear it
      if (savedResponseId && resetTimestamp && !submissionTimestamp) {
        console.log('[Participate] Clearing old data without submission timestamp');
        localStorage.removeItem('userResponseId');
        localStorage.removeItem('userFormData');
        // Don't set hasSubmittedBefore - user can participate again
        return;
      }
      
      // Check if a reset happened after the user's submission
      if (savedResponseId && submissionTimestamp && resetTimestamp) {
        const submitted = parseInt(submissionTimestamp);
        const reset = parseInt(resetTimestamp);

        if (reset > submitted) {
          // Reset happened after submission - check if response still exists in DB
          try {
            const res = await fetch('/api/responses');
            const responses = await res.json();
            const responseStillExists = responses.some((r: { id: string }) => r.id === savedResponseId);

            if (!responseStillExists) {
              // Response was deleted - show empty non-editable form
              console.log('[Participate] Response was deleted after reset');
              setHasSubmittedBefore(true);
              setResponseDeleted(true);
              if (savedFormData) {
                setFormData(JSON.parse(savedFormData));
              }
              return;
            }
          } catch (error) {
            console.error('Error checking if response exists:', error);
          }

          // Reset happened after submission but response doesn't exist, allow re-participation
          console.log('[Participate] Reset detected after submission, clearing data');
          localStorage.removeItem('userResponseId');
          localStorage.removeItem('userFormData');
          localStorage.removeItem('submissionTimestamp');
          return;
        } else {
          // User submitted after the last reset, restore their data
          console.log('[Participate] Restoring user data from after last reset');
          setHasSubmittedBefore(true);
          setResponseId(savedResponseId);

          if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
          }
        }
      } else if (savedResponseId && !resetTimestamp) {
        // No reset has ever happened, check if response still exists
        try {
          const res = await fetch('/api/responses');
          const responses = await res.json();
          const responseStillExists = responses.some((r: { id: string }) => r.id === savedResponseId);

          if (!responseStillExists && responses.length === 0) {
            // Dashboard is empty (reset without setting timestamp), show read-only form
            console.log('[Participate] Dashboard is empty, response was deleted');
            setHasSubmittedBefore(true);
            setResponseDeleted(true);
            if (savedFormData) {
              setFormData(JSON.parse(savedFormData));
            }
            return;
          } else if (!responseStillExists) {
            // Response doesn't exist but there are other responses - allow re-participation
            console.log('[Participate] Response not found, allowing re-participation');
            localStorage.removeItem('userResponseId');
            localStorage.removeItem('userFormData');
            localStorage.removeItem('submissionTimestamp');
            return;
          }
        } catch (error) {
          console.error('Error checking if response exists:', error);
        }

        // Response exists, restore user data
        console.log('[Participate] No reset timestamp, restoring user data');
        setHasSubmittedBefore(true);
        setResponseId(savedResponseId);

        if (savedFormData) {
          setFormData(JSON.parse(savedFormData));
        }
      }
    };

    checkUserSubmission();

    // Listen for reset events to allow re-participation
    const handleReset = () => {
      localStorage.removeItem('userResponseId');
      localStorage.removeItem('userFormData');
      localStorage.removeItem('submissionTimestamp');
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
  }, [searchParams]);

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
        const timestamp = Date.now().toString();
        localStorage.setItem('userResponseId', data.id);
        localStorage.setItem('userFormData', JSON.stringify(formData));
        localStorage.setItem('submissionTimestamp', timestamp);
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

  // Show loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-[#A7B0BE] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg
                className="w-10 h-10 text-[#A7B0BE] animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
            Vérification...
          </h2>
          <p className="text-[#6B7280]">
            Validation de votre accès en cours
          </p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
            Accès non autorisé
          </h2>
          <p className="text-[#6B7280] mb-6">
            {tokenError}
          </p>
        </div>
      </div>
    );
  }

  // Show read-only view if response was deleted
  if (responseDeleted) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-[#A7B0BE] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-[#A7B0BE]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
            Livre d&apos;or réinitialisé
          </h2>
          <p className="text-[#6B7280] mb-6">
            Le livre d&apos;or a été réinitialisé. Votre participation précédente a été supprimée.
          </p>
          <div className="bg-[#F3F4F6] rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-[#6B7280] mb-2">Votre message précédent :</p>
            <p className="text-sm text-[#2E2E2E]"><strong>Nom :</strong> {formData.name || 'Non renseigné'}</p>
            <p className="text-sm text-[#2E2E2E] mt-1 truncate"><strong>Réponse :</strong> {formData.question1?.substring(0, 50) || 'Non renseigné'}{formData.question1?.length > 50 ? '...' : ''}</p>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4">
            Vous ne pouvez plus participer à cette session.
          </p>
        </div>
      </div>
    );
  }

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
            Votre message a été enregistré avec succès dans le livre d&apos;or.
          </p>
          <div className="flex flex-col gap-3">
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
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ParticipatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#A7B0BE] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg
                  className="w-10 h-10 text-[#A7B0BE] animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-[#2E2E2E] mb-3">
              Chargement...
            </h2>
            <p className="text-[#6B7280]">
              Préparation du formulaire
            </p>
          </div>
        </div>
      }
    >
      <ParticipateForm />
    </Suspense>
  );
}
