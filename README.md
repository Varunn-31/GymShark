# GymShark

Modern fitness web app with exercise discovery, AI nutrition analysis, and Firebase authentication.

## Features

- Exercise search with list view (difficulty, type, equipment, muscle)
- Show all exercises via curated muscle aggregation
- AI Fitness Coach with markdown-highlighted responses
- Nutrition calculator with text input and image-to-text (Groq)
- Firebase authentication (Email/Password + Google)
- Guest mode access
- Responsive layout with mobile dropdown navbar

## Tech Stack

- React + React Router
- Tailwind CSS (via CRACO)
- Firebase Auth
- Groq API (text + vision)
- API Ninjas Exercises

## Getting Started

```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file in the project root:

```bash
# Groq
REACT_APP_GROQ_API_KEY=your_groq_key
REACT_APP_GROQ_API_KEY_2=your_groq_key_for_nutrition

# API Ninjas
REACT_APP_RAPID_API_KEY=your_api_ninjas_key

# Firebase
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

## Notes

- Image analysis requires a Groq key with vision access.
- Restart the dev server after editing `.env`.

## Screenshots

<img src='https://i.ibb.co/6XBLNnx/Screenshot-from-2023-01-14-11-04-40.png' width="100%" />
<br />
<img src='https://i.ibb.co/KGLsnLP/Screenshot-from-2023-01-14-11-11-02.png' width="100%" />
<br />
<img src='https://i.ibb.co/ypqBX0h/Screenshot-from-2023-01-14-11-11-39.png' width="100%" />
