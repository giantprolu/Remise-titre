# 📝 ToDo — Dashboard interactif (Remise des titres 4e année)

## 🎯 Objectif du projet
Créer une application Next.js projetable sur tableau blanc lors d’une cérémonie de remise des titres.
Les participants se connectent via QR code, répondent à 3 questions, et les réponses s’affichent en temps réel.
À la fin, les réponses sont exportables en PDF sous forme de livre d’or élégant.

---

## 🧱 Base du projet
- [ ] Vérifier que le projet utilise une version moderne de Next.js
- [ ] Mettre en place l’App Router (`/app`)
- [ ] Nettoyer le boilerplate inutile
- [ ] Structurer le projet :
  - `/app`
  - `/components`
  - `/lib`
  - `/styles`
  - `/types`

---

## 🎨 UI & Design global
- [ ] Fond blanc par défaut
- [ ] Typographie moderne, lisible de loin (ex: Inter, DM Sans, ou équivalent)
- [ ] Layout pensé pour projection (grands titres, marges aérées)
- [ ] Animations légères (fade-in, slide-up)
- [ ] Responsive (tableau / mobile)

---

## 🖥️ Dashboard principal (projection)
- [ ] Page plein écran dédiée au tableau
- [ ] Zone principale d’affichage des réponses
- [ ] Affichage en temps réel sans rechargement
- [ ] Deux modes :
  - [ ] Mode live (réponses au fil de l’eau)
  - [ ] Mode récapitulatif final
- [ ] Gestion élégante des longues réponses
- [ ] Animations lors de l’arrivée d’une nouvelle réponse

---

## 📱 Connexion via QR Code
- [ ] Générer un QR code dynamique
- [ ] Positionner le QR code en bas à droite du dashboard
- [ ] Le QR code mène vers une page mobile dédiée
- [ ] Texte d’aide discret (“Scannez pour participer”)

---

## ✍️ Formulaire participant (mobile)
- [ ] Page mobile-friendly
- [ ] Champ prénom / nom (obligatoire)
- [ ] 3 questions fixes (configurables dans le code)
  - [ ] Question 1 : souvenir marquant
  - [ ] Question 2 : mot pour la promo
  - [ ] Question 3 : message pour l’avenir
- [ ] Validation du formulaire
- [ ] Feedback visuel après envoi (merci / confirmation)

---

## ⚡ Temps réel
- [ ] Backend temps réel prisma (avec vercel)
- [ ] Synchronisation instantanée des réponses
- [ ] Gestion des connexions multiples
- [ ] Sécurité minimale (éviter spam / doublons évidents)

---

## 📦 Stockage des données
- [ ] Définir un modèle de données clair
- [ ] Stocker :
  - pseudo
  - réponses aux 3 questions
  - date / ordre d’arrivée
- [ ] Prévoir un reset simple pour un nouvel événement

---

## 📘 Export PDF — Livre d’or
- [ ] Bouton “Exporter en PDF” (visible côté dashboard)
- [ ] Générer un PDF avec :
  - [ ] Page de couverture (titre, date, promo)
  - [ ] Mise en page type livre
  - [ ] Une ou plusieurs réponses par page
- [ ] Typographie élégante
- [ ] Marges et hiérarchie visuelle soignées
- [ ] PDF prêt à être imprimé ou partagé

---

## ✨ UX & Finitions
- [ ] Transitions douces entre les états
- [ ] Pas de surcharge visuelle
- [ ] Lisibilité parfaite à distance
- [ ] Ton solennel mais chaleureux (cérémonie académique)

---

## 🧪 Tests & Robustesse
- [ ] Tester sur mobile (scan QR réel)
- [ ] Tester avec plusieurs participants simultanés
- [ ] Tester la projection plein écran
- [ ] Tester l’export PDF avec beaucoup de réponses

---

## 🚀 Bonus (si temps)
- [ ] Thème couleur configurable
- [ ] Logo de l’école / promo
- [ ] Mode “pause” pour figer l’affichage
- [ ] Animation finale de clôture

---

## ✅ Résultat attendu
Une application élégante, fiable et émotive, adaptée à une remise de titres,
avec un rendu digne d’un **livre d’or numérique**.
