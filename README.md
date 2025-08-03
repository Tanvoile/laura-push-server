# Serveur de notifications pour l'app Laura ❤️

Ce serveur permet d'envoyer des notifications push à la PWA de Laura.
Il utilise `express`, `web-push`, et peut être déployé gratuitement sur Render ou Vercel.

## Endpoints

- `POST /subscribe` — enregistre un nouvel abonné push 
- `POST /send` — envoie une notification à tous les abonnés

## Lancer en local

```bash
npm install
npm run start
```
