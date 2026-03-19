import { PrismaClient } from '../lib/generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const participants = [
  {
    name: 'Emma Dupont',
    question1: "Mon stage de fin d'etudes en entreprise a Lyon. J'ai decouvert le vrai monde du travail et noue des amities durables.",
    question2: 'Solidaire',
    question3: "Fais confiance a ton instinct. Les doutes d'aujourd'hui seront tes forces de demain.",
  },
  {
    name: 'Lucas Martin',
    question1: "La nuit blanche avant le rendu du projet annuel. On etait tous ensemble dans la salle informatique, a moitie fous, mais soudes.",
    question2: 'Tenace',
    question3: "Ne lache jamais ce pourquoi tu te bats. Le chemin est difficile mais l'arrivee en vaut la peine.",
  },
  {
    name: 'Chloe Bernard',
    question1: "Le voyage de promo a Barcelone en deuxieme annee. On a ri comme jamais et decouvert qu'on etait bien plus que des camarades de classe.",
    question2: 'Explosive',
    question3: 'Prends soin de toi avant tout. Le reste suivra naturellement.',
  },
  {
    name: 'Noah Thomas',
    question1: "La presentation de notre projet devant le jury externe. On avait travaille des semaines dessus et le resultat nous a rendu fiers.",
    question2: 'Ambitieux',
    question3: "Rappelle-toi pourquoi tu as commence chaque fois que tu veux abandonner.",
  },
  {
    name: 'Lea Petit',
    question1: "Le moment ou on a appris qu'on avait tous reussi le module le plus redoute. Les cris dans le couloir resonnent encore.",
    question2: 'Brillante',
    question3: "La reussite n'est pas une destination, c'est une facon de voyager. Continue a avancer.",
  },
  {
    name: 'Hugo Leroy',
    question1: 'Les pauses dejeuner interminables a refaire le monde avec les potes. Ces moments simples me manquent deja.',
    question2: 'Chaleureux',
    question3: 'Reste curieux. Le monde appartient a ceux qui posent des questions.',
  },
  {
    name: 'Manon Moreau',
    question1: "La remise du premier diplome intermediaire. Ma famille etait la et j'ai compris pour la premiere fois ce que signifiait etre fiere de soi.",
    question2: 'Determinee',
    question3: 'Tu as deja prouve que tu pouvais. Continue a te prouver que tu veux.',
  },
  {
    name: 'Gabriel Dubois',
    question1: "Les TD de maths ou on se battait tous ensemble contre les exercices impossibles. C'est dans l'adversite qu'on s'est vraiment connus.",
    question2: 'Perseverant',
    question3: 'Les erreurs sont des lecons deguisees. Apprends-en autant que tu peux.',
  },
  {
    name: 'Camille Laurent',
    question1: "Le projet de groupe ou tout a failli s'effondrer deux jours avant le rendu. On a tenu ensemble et on a presente quelque chose dont on est fiers.",
    question2: 'Resiliente',
    question3: 'Sois gentille avec toi-meme. Tu merites ton propre soutien autant que celui des autres.',
  },
  {
    name: 'Theo Simon',
    question1: "Le weekend d'integration en premiere annee. Je ne connaissais personne et je suis rentre avec des amis pour la vie.",
    question2: 'Famille',
    question3: "N'oublie pas d'ou tu viens pour apprecier ou tu vas.",
  },
  {
    name: 'Ines Fontaine',
    question1: "La conference ou un professionnel nous a dit que notre generation allait changer les choses. J'y ai cru et j'y crois encore.",
    question2: 'Visionnaire',
    question3: 'Tes reves sont valables. Construis-les brique par brique, meme les petites.',
  },
  {
    name: 'Maxime Rousseau',
    question1: "Le jour ou j'ai eu ma premiere vraie note correcte apres un debut d'annee catastrophique. La fierte de se relever vaut tous les succes faciles.",
    question2: 'Combatif',
    question3: 'Chaque recommencement est une chance. Ne la laisse pas passer.',
  },
  {
    name: 'Jade Mercier',
    question1: "Les soirees revisions chez Marie avec les pizzas et les fiches de couleur partout. On apprenait, on riait, on s'inquietait ensemble.",
    question2: 'Complice',
    question3: "Entends-toi entrer dans une piece avec confiance. Tu as tout ce qu'il faut.",
  },
  {
    name: 'Antoine Girard',
    question1: "Le cours magistral du professeur Arnaud sur l'ethique professionnelle. Ca a change ma facon de voir mon futur metier.",
    question2: 'Ethique',
    question3: 'Sois la personne que tu aurais voulu avoir comme mentor.',
  },
  {
    name: 'Zoe Bonnet',
    question1: "Quand on a gagne le concours inter-promo. On s'y attendait tellement peu que les larmes sont venues toutes seules.",
    question2: 'Championne',
    question3: 'La surprise de tes propres capacites est un des plus beaux cadeaux. Reste ouverte a etre etonnee.',
  },
  {
    name: 'Ethan Lefebvre',
    question1: "Les discussions interminables dans le couloir apres les cours, a refuser de rentrer chez soi parce que la conversation etait trop bonne.",
    question2: 'Vivant',
    question3: 'Prends le temps de vivre les moments qui comptent. Ils ne reviennent pas.',
  },
  {
    name: 'Clara Dumont',
    question1: "Mon premier expose oral en L1. J'etais terrifiee. Aujourd'hui je presente sans trembler. C'est cette evolution qui me rend fiere.",
    question2: 'Courageuse',
    question3: "La personne que tu es aujourd'hui aurait ete le reve de la personne que tu etais hier.",
  },
  {
    name: 'Louis Garnier',
    question1: "Les matchs de foot du jeudi midi entre promos. Pas tres serieux, mais tellement importants pour la cohesion du groupe.",
    question2: 'Federateur',
    question3: "Ne sous-estime jamais le pouvoir d'un moment de legerete partage.",
  },
  {
    name: 'Anais Morel',
    question1: 'La semaine de rendu final du memoire. Cinq jours difficiles, mais quand j\'ai clique sur "envoyer", j\'ai pleure de soulagement et de fierte.',
    question2: 'Accomplie',
    question3: "Tu es capable de bien plus que tu ne l'imagines. Tu viens d'en avoir la preuve.",
  },
  {
    name: 'Raphael Perrin',
    question1: "La ceremonie de remise des titres de l'annee precedente a laquelle on avait assiste en spectateurs. On s'etait dit : dans un an ce sera nous. Et voila.",
    question2: 'Accompli',
    question3: 'Souviens-toi de ce que tu ressentais ce soir. Cette fierte, garde-la. Elle te portera.',
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
