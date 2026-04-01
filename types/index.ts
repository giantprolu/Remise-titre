export interface Response {
  id: string;
  name: string;
  question1: string;
  question2: string;
  photo?: string | null;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface FormData {
  name: string;
  question1: string;
  question2: string;
  isAnonymous?: boolean;
  photo?: string;
}

export const BRAND_COLORS = [
  { r: 220, g: 71,  b: 89,  hex: '#DC4759' }, // Couleur 1
  { r: 229, g: 131, b: 64,  hex: '#E58340' }, // Couleur 2
  { r: 250, g: 209, b: 84,  hex: '#FAD154' }, // Couleur 3
  { r: 74,  g: 75,  b: 152, hex: '#4A4B98' }, // Couleur 4
  { r: 56,  g: 184, b: 214, hex: '#38B8D6' }, // Couleur 5
  { r: 147, g: 91,  b: 158, hex: '#935B9E' }, // Couleur 6
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
