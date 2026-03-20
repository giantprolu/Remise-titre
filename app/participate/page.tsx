'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QUESTIONS } from '@/types';

function cropToSquare(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 600;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.src = url;
  });
}

function ParticipateForm() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    question1: '',
    question2: '',
    question3: '',
    photo: ''
  });
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [submitError, setSubmitError] = useState('');
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

    // Check server-side if the previously submitted response still exists
    const savedResponseId = localStorage.getItem('userResponseId');
    const savedFormData = localStorage.getItem('userFormData');

    if (savedResponseId) {
      fetch(`/api/responses/${savedResponseId}`)
        .then((res) => {
          if (res.ok) {
            // Response still exists → user already submitted
            setHasSubmittedBefore(true);
            setResponseId(savedResponseId);
            if (savedFormData) {
              setFormData(JSON.parse(savedFormData));
            }
          } else {
            // Response was deleted or reset → clear and allow resubmission
            localStorage.removeItem('userResponseId');
            localStorage.removeItem('userFormData');
            localStorage.removeItem('submissionTimestamp');
            localStorage.removeItem('resetTimestamp');
          }
        })
        .catch(() => {
          // Network error: fail open, let the user try again
          localStorage.removeItem('userResponseId');
          localStorage.removeItem('userFormData');
          localStorage.removeItem('submissionTimestamp');
          localStorage.removeItem('resetTimestamp');
        });
    }

    // Listen for reset events to allow re-participation
    const handleReset = () => {
      localStorage.removeItem('userResponseId');
      localStorage.removeItem('userFormData');
      localStorage.removeItem('submissionTimestamp');
      setHasSubmittedBefore(false);
      setResponseId(null);
      setIsSubmitted(false);
      setPhotoPreview('');
      setFormData({ name: '', question1: '', question2: '', question3: '', photo: '' });
    };

    window.addEventListener('responsesReset', handleReset);

    return () => {
      window.removeEventListener('responsesReset', handleReset);
    };
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await cropToSquare(file);
    setPhotoPreview(base64);
    setFormData((prev) => ({ ...prev, photo: base64 }));
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData((prev) => ({ ...prev, photo: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ARTICLE_WORDS = ['un', 'une', 'le', 'la', 'les', 'de', 'du', 'des', 'et', 'en', 'à', 'au', 'aux', 'ce', 'cet', 'cette', 'ça', 'ca', 'il', 'elle', 'je', 'tu', 'nous', 'vous', 'on', 'y', 'lui', 'eux', 'mon', 'ma', 'ton', 'ta', 'son', 'sa', 'nos', 'vos', 'ses', 'mes', 'tes', 'or', 'ni', 'car'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const q2 = formData.question2.trim();
    if (q2.split(/\s+/).filter(Boolean).length > 1) {
      setSubmitError('La question 2 n\'accepte qu\'un seul mot.');
      setIsSubmitting(false);
      return;
    }
    if (ARTICLE_WORDS.includes(q2.toLowerCase())) {
      setSubmitError('Choisissez un mot plus descriptif pour la question 2 (pas un article ou mot court).');
      setIsSubmitting(false);
      return;
    }

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
      } else if (response.status === 409) {
        const data = await response.json();
        setSubmitError(data.error || 'Ce nom a déjà été utilisé pour soumettre un message.');
      } else {
        setSubmitError('Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Une erreur est survenue. Veuillez réessayer.');
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

            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-[#2E2E2E] mb-2">
                Photo <span className="font-normal text-[#9CA3AF]">(optionnelle)</span>
              </label>
              {photoPreview ? (
                <div className="flex items-start gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Aperçu"
                      className="w-28 h-28 object-cover rounded-xl border-2 border-[#E5E7EB]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="mt-1 text-sm text-red-500 hover:text-red-700 underline"
                  >
                    Supprimer la photo
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="photo-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E5E7EB] rounded-xl cursor-pointer hover:border-[#A7B0BE] hover:bg-[#F9FAFB] transition-all"
                >
                  <svg className="w-8 h-8 text-[#9CA3AF] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-[#9CA3AF]">Ajouter une photo</span>
                  <span className="text-xs text-[#9CA3AF] mt-1">Sera recadrée en carré automatiquement</span>
                </label>
              )}
              <input
                ref={fileInputRef}
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
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

            {/* Error Message */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {submitError}
                </p>
              </div>
            )}

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
