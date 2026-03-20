export interface Response {
  id: string;
  name: string;
  question1: string;
  question2: string;
  question3: string;
  photo?: string | null;
  createdAt: Date;
}

export interface FormData {
  name: string;
  question1: string;
  question2: string;
  question3: string;
  photo?: string;
}

export const BRAND_COLORS = [
  { r: 91, g: 127, b: 166, hex: '#5B7FA6' },
  { r: 123, g: 158, b: 135, hex: '#7B9E87' },
  { r: 160, g: 128, b: 112, hex: '#A08070' },
  { r: 139, g: 123, b: 170, hex: '#8B7BAA' },
  { r: 90, g: 138, b: 138, hex: '#5A8A8A' },
  { r: 158, g: 139, b: 107, hex: '#9E8B6B' },
  { r: 61, g: 89, b: 117, hex: '#3D5975' },
] as const;

export const QUESTIONS = [
  {
    id: 'question 1',
    label: 'Quel est votre souvenir le plus marquant de ces 2 années ?',
    placeholder: 'Partagez votre souvenir...'
  },
  {
    id: 'question 2',
    label: 'Un mot pour décrire cette promo ?',
    placeholder: 'Un seul mot...'
  },
  {
    id: 'question 3',
    label: 'Un message pour ton futur toi ?',
    placeholder: 'Votre message...'
  }
] as const;
