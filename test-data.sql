-- Données de test — 20 participants
-- Les IDs sont générés automatiquement par PostgreSQL (gen_random_uuid())
-- Ce script peut être relancé plusieurs fois sans conflit

INSERT INTO responses (id, name, question1, question3, photo, "createdAt") VALUES

(gen_random_uuid()::text, 'Emma Dupont',
 'Mon stage de fin d''études en entreprise à Lyon. J''ai découvert le vrai monde du travail et noué des amitiés durables.',
 'Fais confiance à ton instinct. Les doutes d''aujourd''hui seront tes forces de demain.',
 NULL, NOW() - INTERVAL '2 hours'),

(gen_random_uuid()::text, 'Lucas Martin',
 'La nuit blanche avant le rendu du projet annuel. On était tous ensemble dans la salle informatique, à moitié fous, mais soudés.',
 'Ne lâche jamais ce pourquoi tu te bats. Le chemin est difficile mais l''arrivée en vaut la peine.',
 NULL, NOW() - INTERVAL '1 hour 50 minutes'),

(gen_random_uuid()::text, 'Chloé Bernard',
 'Le voyage de promo à Barcelone en deuxième année. On a ri comme jamais et découvert qu''on était bien plus que des camarades de classe.',
 'Prends soin de toi avant tout. Le reste suivra naturellement.',
 NULL, NOW() - INTERVAL '1 hour 40 minutes'),

(gen_random_uuid()::text, 'Noah Thomas',
 'La présentation de notre projet devant le jury externe. On avait travaillé des semaines dessus et le résultat nous a rendu fiers.',
 'Rappelle-toi pourquoi tu as commencé chaque fois que tu veux abandonner.',
 NULL, NOW() - INTERVAL '1 hour 30 minutes'),

(gen_random_uuid()::text, 'Léa Petit',
 'Le moment où on a appris qu''on avait tous réussi le module le plus redouté. Les cris dans le couloir résonnent encore.',
 'La réussite n''est pas une destination, c''est une façon de voyager. Continue à avancer.',
 NULL, NOW() - INTERVAL '1 hour 20 minutes'),

(gen_random_uuid()::text, 'Hugo Leroy',
 'Les pauses déjeuner interminables à refaire le monde avec les potes. Ces moments simples me manquent déjà.',
 'Reste curieux. Le monde appartient à ceux qui posent des questions.',
 NULL, NOW() - INTERVAL '1 hour 10 minutes'),

(gen_random_uuid()::text, 'Manon Moreau',
 'La remise du premier diplôme intermédiaire. Ma famille était là et j''ai compris pour la première fois ce que signifiait être fière de soi.',
 'Tu as déjà prouvé que tu pouvais. Continue à te prouver que tu veux.',
 NULL, NOW() - INTERVAL '1 hour'),

(gen_random_uuid()::text, 'Gabriel Dubois',
 'Les TD de maths où on se battait tous ensemble contre les exercices impossibles. C''est dans l''adversité qu''on s''est vraiment connus.',
 'Les erreurs sont des leçons déguisées. Apprends-en autant que tu peux.',
 NULL, NOW() - INTERVAL '55 minutes'),

(gen_random_uuid()::text, 'Camille Laurent',
 'Le projet de groupe où tout a failli s''effondrer deux jours avant le rendu. On a tenu ensemble et on a présenté quelque chose dont on est fiers.',
 'Sois gentille avec toi-même. Tu mérites ton propre soutien autant que celui des autres.',
 NULL, NOW() - INTERVAL '50 minutes'),

(gen_random_uuid()::text, 'Théo Simon',
 'Le weekend d''intégration en première année. Je ne connaissais personne et je suis rentré avec des amis pour la vie.',
 'N''oublie pas d''où tu viens pour apprécier où tu vas.',
 NULL, NOW() - INTERVAL '45 minutes'),

(gen_random_uuid()::text, 'Inès Fontaine',
 'La conférence où un professionnel nous a dit que notre génération allait changer les choses. J''y ai cru et j''y crois encore.',
 'Tes rêves sont valables. Construis-les brique par brique, même les petites.',
 NULL, NOW() - INTERVAL '40 minutes'),

(gen_random_uuid()::text, 'Maxime Rousseau',
 'Le jour où j''ai eu ma première vraie note correcte après un début d''année catastrophique. La fierté de se relever vaut tous les succès faciles.',
 'Chaque recommencement est une chance. Ne la laisse pas passer.',
 NULL, NOW() - INTERVAL '35 minutes'),

(gen_random_uuid()::text, 'Jade Mercier',
 'Les soirées révisions chez Marie avec les pizzas et les fiches de couleur partout. On apprenait, on riait, on s''inquiétait ensemble.',
 'Entends-toi entrer dans une pièce avec confiance. Tu as tout ce qu''il faut.',
 NULL, NOW() - INTERVAL '30 minutes'),

(gen_random_uuid()::text, 'Antoine Girard',
 'Le cours magistral du professeur Arnaud sur l''éthique professionnelle. Ça a changé ma façon de voir mon futur métier.',
 'Sois la personne que tu aurais voulu avoir comme mentor.',
 NULL, NOW() - INTERVAL '25 minutes'),

(gen_random_uuid()::text, 'Zoé Bonnet',
 'Quand on a gagné le concours inter-promo. On s''y attendait tellement peu que les larmes sont venues toutes seules.',
 'La surprise de tes propres capacités est l''un des plus beaux cadeaux. Reste ouverte à l''être étonnée.',
 NULL, NOW() - INTERVAL '22 minutes'),

(gen_random_uuid()::text, 'Ethan Lefebvre',
 'Les discussions interminables dans le couloir après les cours, à refuser de rentrer chez soi parce que la conversation était trop bonne.',
 'Prends le temps de vivre les moments qui comptent. Ils ne reviennent pas.',
 NULL, NOW() - INTERVAL '18 minutes'),

(gen_random_uuid()::text, 'Clara Dumont',
 'Mon premier exposé oral en L1. J''étais terrifiée. Aujourd''hui je présente sans trembler. C''est cette évolution qui me rend fière.',
 'La personne que tu es aujourd''hui aurait été le rêve de la personne que tu étais hier.',
 NULL, NOW() - INTERVAL '15 minutes'),

(gen_random_uuid()::text, 'Louis Garnier',
 'Les matchs de foot du jeudi midi entre promos. Pas très sérieux, mais tellement importants pour la cohésion du groupe.',
 'Ne sous-estime jamais le pouvoir d''un moment de légèreté partagé.',
 NULL, NOW() - INTERVAL '12 minutes'),

(gen_random_uuid()::text, 'Anaïs Morel',
 'La semaine de rendu final du mémoire. Cinq jours d''enfer, mais quand j''ai cliqué sur "envoyer", j''ai pleuré de soulagement et de fierté.',
 'Tu es capable de bien plus que tu ne l''imagines. Tu viens d''en avoir la preuve.',
 NULL, NOW() - INTERVAL '8 minutes'),

(gen_random_uuid()::text, 'Raphaël Perrin',
 'La cérémonie de remise des titres de l''année précédente à laquelle on avait assisté en spectateurs. On s''était dit : dans un an ce sera nous. Et voilà.',
 'Souviens-toi de ce que tu ressentais ce soir. Cette fierté, garde-la. Elle te portera.',
 NULL, NOW() - INTERVAL '3 minutes');
