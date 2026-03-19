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

export const QUESTIONS = [
  {
    id: 'question 1',
    label: 'Quel est votre souvenir le plus marquant de ces 2 années ?',
    placeholder: 'Partagez votre souvenir...'
  },
  {
    id: 'question 2',
    label: 'Un mot pour décrire cette promotion ?',
    placeholder: 'Un seul mot...'
  },
  {
    id: 'question 3',
    label: 'Un message pour l\'avenir ?',
    placeholder: 'Votre message...'
  }
] as const;
