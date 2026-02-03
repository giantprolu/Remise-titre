# Remise des Titres - Livre d'Or Numérique

Application Next.js interactive pour une cérémonie de remise des titres. Les participants se connectent via QR code, répondent à 3 questions, et les réponses s'affichent en temps réel sur un dashboard projetable. À la fin, les réponses sont exportables en PDF sous forme de livre d'or élégant.

## Fonctionnalités

- **Dashboard interactif** : Affichage en temps réel des réponses sur grand écran
- **QR Code** : Connexion facile pour les participants via mobile
- **Formulaire mobile** : Interface optimisée pour smartphone
- **Export PDF** : Génération d'un livre d'or élégant et imprimable
- **Modes d'affichage** : Mode live et mode récapitulatif
- **Design soigné** : Interface moderne, lisible de loin, avec animations douces

## Installation

1. Cloner le projet

2. Installer les dépendances :
```bash
npm install
```

3. Initialiser la base de données :
```bash
npx prisma generate
npx prisma migrate dev
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000)

## Utilisation

### Dashboard (projection)

1. Ouvrir l'application sur l'ordinateur connecté au projecteur
2. Le dashboard principal s'affiche à `/`
3. Un QR code apparaît en bas à droite

### Participants (mobile)

1. Scanner le QR code avec leur smartphone
2. Remplir le formulaire à `/participate` :
   - Nom / Prénom
   - Souvenir marquant
   - Un mot pour la promo
   - Message pour l'avenir
3. Valider le formulaire
4. La réponse s'affiche instantanément sur le dashboard

### Contrôles du dashboard

- **Mode Récapitulatif / Mode Live** : Basculer entre l'affichage en temps réel et la vue d'ensemble
- **Pause / Reprendre** : Figer l'affichage des nouvelles réponses
- **Exporter en PDF** : Générer le livre d'or complet
- **Réinitialiser** : Supprimer toutes les réponses (pour un nouvel événement)

## Structure du projet

```
remise-des-titres/
├── app/
│   ├── api/
│   │   └── responses/      # API routes (GET, POST, DELETE)
│   ├── participate/        # Page formulaire participant
│   ├── globals.css         # Styles globaux + animations
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Dashboard principal
├── components/
│   ├── Dashboard.tsx       # Composant dashboard avec polling
│   ├── QRCodeDisplay.tsx   # Affichage du QR code
│   └── ResponseCard.tsx    # Carte d'affichage d'une réponse
├── lib/
│   ├── prisma.ts           # Client Prisma
│   ├── pdf.ts              # Génération PDF
│   └── generated/          # Prisma client généré
├── types/
│   └── index.ts            # Types TypeScript + questions
├── prisma/
│   ├── schema.prisma       # Schéma de base de données
│   └── dev.db              # Base SQLite
└── package.json
```

## Technologies utilisées

- **Next.js 16** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Prisma** : ORM pour SQLite
- **Tailwind CSS** : Styles utilitaires
- **jsPDF** : Génération de PDF
- **qrcode** : Génération de QR codes

## Personnalisation

### Modifier les questions

Éditer [types/index.ts](types/index.ts:9-24) :

```typescript
export const QUESTIONS = [
  {
    id: 'question1',
    label: 'Votre nouvelle question 1?',
    placeholder: 'Réponse...'
  },
  // ...
];
```

### Changer les couleurs

Modifier les classes Tailwind dans les composants ou ajouter un thème personnalisé dans [globals.css](app/globals.css).

## Base de données

Le projet utilise SQLite par défaut (fichier `prisma/dev.db`).

### Réinitialiser la base de données

```bash
npx prisma migrate reset
```

### Inspecter la base de données

```bash
npx prisma studio
```

## Déploiement

### Vercel (recommandé)

1. Pusher le projet sur GitHub
2. Connecter le repo à Vercel
3. Vercel détectera automatiquement Next.js
4. Ajouter une base de données (Vercel Postgres ou autre)
5. Mettre à jour `DATABASE_URL` dans les variables d'environnement

## Production

### Build

```bash
npm run build
```

### Démarrer en production

```bash
npm start
```

## Notes importantes

- Les réponses sont stockées localement dans SQLite
- Pour un usage en production, utiliser une base PostgreSQL ou MySQL
- Le polling se fait toutes les 3 secondes (modifiable dans Dashboard.tsx)
- Les QR codes sont générés côté client (nécessite JavaScript activé)

## Support

Pour toute question ou problème, consulter la documentation Next.js ou Prisma.

---

**Développé pour une cérémonie de remise des titres - 4ème Année**
