import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const participants = [
  {
    name: 'Emma Dupont',
    question1: "Mon stage de fin d'etudes en entreprise a Lyon. J'ai decouvert le vrai monde du travail et noue des amities durables.",
    question2: "Fais confiance a ton instinct. Les doutes d'aujourd'hui seront tes forces de demain.",
  },
  {
    name: 'Lucas Martin',
    question1: "La nuit blanche avant le rendu du projet annuel. On etait tous ensemble dans la salle informatique, a moitie fous, mais soudes.",
    question2: "Ne lache jamais ce pourquoi tu te bats. Le chemin est difficile mais l'arrivee en vaut la peine.",
  },
  {
    name: 'Chloe Bernard',
    question1: "Le voyage de promo a Barcelone en deuxieme annee. On a ri comme jamais et decouvert qu'on etait bien plus que des camarades de classe.",
    question2: "",
  },
  {
    name: 'Noah Thomas',
    question1: "La presentation de notre projet devant le jury externe. On avait travaille des semaines dessus et le resultat nous a rendu fiers.",
    question2: "Rappelle-toi pourquoi tu as commence chaque fois que tu veux abandonner.",
  },
  {
    name: 'Lea Petit',
    question1: "Le moment ou on a appris qu'on avait tous reussi le module le plus redoute. Les cris dans le couloir resonnent encore.",
    question2: "La reussite n'est pas une destination, c'est une facon de voyager. Continue a avancer.",
  },
  {
    name: 'Hugo Leroy',
    question1: 'Les pauses dejeuner interminables a refaire le monde avec les potes. Ces moments simples me manquent deja.',
    question2: "",
  },
  {
    name: 'Manon Moreau',
    question1: "La remise du premier diplome intermediaire. Ma famille etait la et j'ai compris pour la premiere fois ce que signifiait etre fiere de soi.",
    question2: "",
  },
  {
    name: 'Gabriel Dubois',
    question1: "Les TD de maths ou on se battait tous ensemble contre les exercices impossibles. C'est dans l'adversite qu'on s'est vraiment connus.",
    question2: "",
  },
  {
    name: 'Camille Laurent',
    question1: "Le projet de groupe ou tout a failli s'effondrer deux jours avant le rendu. On a tenu ensemble et on a presente quelque chose dont on est fiers.",
    question2: "",
  },
  {
    name: 'Theo Simon',
    question1: "Le weekend d'integration en premiere annee. Je ne connaissais personne et je suis rentre avec des amis pour la vie.",
    question2: "N'oublie pas d'ou tu viens pour apprecier ou tu vas.",
  },
  {
    name: 'Ines Fontaine',
    question1: "La conference ou un professionnel nous a dit que notre generation allait changer les choses. J'y ai cru et j'y crois encore.",
    question2: "",
  },
  {
    name: 'Maxime Rousseau',
    question1: "Le jour ou j'ai eu ma premiere vraie note correcte apres un debut d'annee catastrophique. La fierte de se relever vaut tous les succes faciles.",
    question2: "",
  },
  {
    name: 'Jade Mercier',
    question1: "Les soirees revisions chez Marie avec les pizzas et les fiches de couleur partout. On apprenait, on riait, on s'inquietait ensemble.",
    question2: "Entends-toi entrer dans une piece avec confiance. Tu as tout ce qu'il faut.",
  },
  {
    name: 'Antoine Girard',
    question1: "Le cours magistral du professeur Arnaud sur l'ethique professionnelle. Ca a change ma facon de voir mon futur metier.",
    question2: "",
  },
  {
    name: 'Zoe Bonnet',
    question1: "Quand on a gagne le concours inter-promo. On s'y attendait tellement peu que les larmes sont venues toutes seules.",
    question2: "",
  },
  {
    name: 'Ethan Lefebvre',
    question1: "Les discussions interminables dans le couloir apres les cours, a refuser de rentrer chez soi parce que la conversation etait trop bonne.",
    question2: "",
  },
  {
    name: 'Clara Dumont',
    question1: "Mon premier expose oral en L1. J'etais terrifiee. Aujourd'hui je presente sans trembler. C'est cette evolution qui me rend fiere.",
    question2: "La personne que tu es aujourd'hui aurait ete le reve de la personne que tu etais hier.",
  },
  {
    name: 'Louis Garnier',
    question1: "Les matchs de foot du jeudi midi entre promos. Pas tres serieux, mais tellement importants pour la cohesion du groupe.",
    question2: "Ne sous-estime jamais le pouvoir d'un moment de legerete partage.",
  },
  {
    name: 'Anais Morel',
    question1: 'La semaine de rendu final du memoire. Cinq jours difficiles, mais quand j\'ai clique sur "envoyer", j\'ai pleure de soulagement et de fierte.',
    question2: "Tu es capable de bien plus que tu ne l'imagines. Tu viens d'en avoir la preuve.",
  },
  {
    name: 'Raphael Perrin',
    question1: "La ceremonie de remise des titres de l'annee precedente a laquelle on avait assiste en spectateurs. On s'etait dit : dans un an ce sera nous. Et voila.",
    question2: "",
  },
];

async function main() {
  console.log('Insertion des donnees de test...\n');
  for (const p of participants) {
    await prisma.response.create({ data: p });
    console.log('  OK ' + p.name);
  }
  
  const adminPassword = 'NathanLeMeilleur';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  await prisma.admin.upsert({
    where: { id: 1 },
    update: { password: hashedPassword },
    create: {
      id: 1,
      password: hashedPassword,
    },
  });
  console.log('\nAdmin créé/mis à jour avec succès.');
  
  console.log('\n' + participants.length + ' participants inseres avec succes.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
