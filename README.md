# Zawia Quest 🕌
**A heritage gamification web app for Zaoua de Sidi-Assa, Tbourba, Tunisia**

## Run with Docker

### Build the image
```bash
docker build -t zawia-quest .
```

### Run the container
```bash
docker run -d -p 8080:80 --name zawia-quest zawia-quest
```

### Open in browser
```
http://localhost:8080
```

### Stop the container
```bash
docker stop zawia-quest
```

## Run without Docker (just open in browser)
Simply open `index.html` in any modern browser — no server needed.

## Features
- 5 interactive quests with different mechanics
- Quiz, AR scan mockup, audio player, drag & drop, timeline puzzle
- Badge collection system (5 badges)
- Knowledge Points tracker
- Library with 9 articles across 3 categories
- User profile and milestones
- Full mobile-responsive design (390×844px)
- Beautiful heritage aesthetic: Deep Brown, Gold, Terracotta palette
