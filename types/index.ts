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
