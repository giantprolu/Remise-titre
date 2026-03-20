export interface Response {
  id: string;
  name: string;
  question1: string;
  question2: string;
  question3: string;
  createdAt: Date;
}

export interface FormData {
  name: string;
  question1: string;
  question2: string;
  question3: string;
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
    id: 'question1',
    label: 'Quel est votre souvenir le plus marquant de ces 4 années?',
    placeholder: 'Partagez votre souvenir...'
  },
  {
    id: 'question2',
    label: 'Un mot pour décrire cette promotion?',
    placeholder: 'Un seul mot...'
  },
  {
    id: 'question3',
    label: 'Un message pour l\'avenir?',
    placeholder: 'Votre message...'
  }
] as const;
