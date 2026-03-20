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
  { r: 75, g: 95, b: 153, hex: '#4B5F99' },
  { r: 228, g: 128, b: 62, hex: '#E4803E' },
  { r: 250, g: 207, b: 83, hex: '#FACF53' },
  { r: 143, g: 190, b: 84, hex: '#8FBE54' },
  { r: 54, g: 182, b: 212, hex: '#36B6D4' },
  { r: 217, g: 71, b: 89, hex: '#D94759' },
  { r: 38, g: 30, b: 72, hex: '#261E48' },
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
