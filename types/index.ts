export interface Response {
  id: string;
  name: string;
  question1: string;
  question2: string;
  photo?: string | null;
  createdAt: Date;
}

export interface FormData {
  name: string;
  question1: string;
  question2: string;
  photo?: string;
}

export const BRAND_COLORS = [
  { r: 108, g: 174, b: 54, hex: '#6CAE36' }, // EPSI Vert clair
  { r: 92, g: 143, b: 43, hex: '#5C8F2B' },  // EPSI Vert moyen
  { r: 16, g: 24, b: 32, hex: '#101820' },   // Noir/Gris foncé
  { r: 84, g: 88, b: 90, hex: '#54585A' },   // Gris
  { r: 136, g: 139, b: 141, hex: '#888B8D' },// Gris clair
] as const;

export const QUESTIONS = [
  {
    id: 'question 1',
    label: 'Quel est votre souvenir le plus marquant de ces 2 années ?',
    placeholder: 'Partagez votre souvenir...'
  },
  {
    id: 'question 3',
    label: 'Un message pour ton futur toi ?',
    placeholder: 'Votre message...'
  }
] as const;
