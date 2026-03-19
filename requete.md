# Requêtes SQL utiles

## Insérer les 20 participants de test

Coller dans **Prisma Studio → Raw SQL** ou via `psql` :

```bash
psql $DATABASE_URL -f test-data.sql
```

> Les IDs sont générés automatiquement avec `gen_random_uuid()` — pas de conflit de clé primaire.

---

## Supprimer toutes les réponses

```sql
DELETE FROM responses;
```

---

## Voir toutes les réponses (sans photo)

```sql
SELECT id, name, question1, question2, question3, "createdAt"
FROM responses
ORDER BY "createdAt" DESC;
```

---

## Voir les réponses avec photo uniquement

```sql
SELECT id, name, "createdAt"
FROM responses
WHERE photo IS NOT NULL
ORDER BY "createdAt" DESC;
```

---

## Compter les participants

```sql
SELECT COUNT(*) AS total FROM responses;
```

---

## Supprimer une réponse par ID

```sql
DELETE FROM responses WHERE id = 'REMPLACER_PAR_ID';
```

---

## Supprimer une réponse par nom

```sql
DELETE FROM responses WHERE name ILIKE 'Prénom Nom';
```

---

## Vérifier les doublons de nom

```sql
SELECT name, COUNT(*) AS nb
FROM responses
GROUP BY name
HAVING COUNT(*) > 1;
```
