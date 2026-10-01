# EduPlus — version Vercel

Structure prête pour Vercel :
- `index.html` : interface EduPlus
- `api/ai.js` : fonction serveur de l'assistant IA
- `package.json` : configuration
- `.env.example` : variables d'environnement

Après import dans Vercel, ajoute `OPENAI_API_KEY` dans les Environment Variables. Ne mets jamais ta vraie clé API dans GitHub.

Cette version de base ne comprend pas encore les comptes utilisateurs, la base de données, l'upload de PDF ni l'espace administrateur.
