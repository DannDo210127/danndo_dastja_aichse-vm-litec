# Diploma Arbeit - Classroom & VM Management System

## 📋 Projektbeschreibung

**Vollständiges Classroom-Management & Virtual Machine Verwaltungssystem** mit Web-Interface für Schulen und Lehreinrichtungen.

Die Anwendung ermöglicht Lehrern und Administratoren:
- Klassenzimmer (Classrooms) zu verwalten
- Schüler zu Klassen zuzuordnen
- Virtuelle Maschinen bereitzustellen und zu kontrollieren
- Remote Desktop Zugriff (VNC) auf VMs
- Benutzerprofile und Rollen zu verwalten

---

## 🏗️ Systemarchitektur

```
┌─────────────────────┐
│   Frontend (Next.js)│
│  React + Zustand    │
│   Port: 3000        │
└──────────┬──────────┘
           │ (HTTP/REST)
           ↓
┌─────────────────────────────┐
│  Backend (Express.js)       │
│  Prisma + PostgreSQL        │
│  Port: 4000                 │
│                             │
│  - Authentication (JWT)     │
│  - Classroom Management     │
│  - User Management          │
│  - VM Management (Incus)    │
└─────────────────────────────┘
           │
           ↓
┌─────────────────────┐
│   PostgreSQL DB     │
│   (Daten-Store)     │
└─────────────────────┘
           │
           ↓
┌─────────────────────┐
│   Incus/LXD         │
│   (VM-Hypervisor)   │
└─────────────────────┘
```

---

## 📦 Projektstruktur

```
DiplomArbeit/
├── frontend/                    # Next.js Web-Anwendung
│   ├── src/
│   │   ├── app/                # Pages & Layouts
│   │   ├── components/         # Spezifische Komponenten
│   │   ├── shared/             # Wiederverwendbare UI
│   │   ├── api/                # API Client & Requests
│   │   ├── hooks/              # Custom Hooks
│   │   ├── store/              # Zustand State
│   │   └── types/              # TypeScript Types
│   └── README.md               # Frontend Dokumentation
│
├── backend/                     # Express.js REST API
│   ├── src/
│   │   ├── server.ts           # Entry Point
│   │   ├── routes/             # API Routes
│   │   ├── controller/         # Business Logic
│   │   ├── middleware/         # Express Middleware
│   │   ├── auth/               # JWT Token Generation
│   │   ├── db/                 # Prisma Client
│   │   ├── config/             # Konfiguration
│   │   └── util/               # Helper Functions
│   ├── prisma/                 # DB Schema & Migrations
│   └── README.md               # Backend Dokumentation
│
└── doc/                         # Zusätzliche Dokumentation
```

---

## 🔑 Kernfunktionalitäten

### 🔐 Authentifizierung
- **Login/Register** mit Email & Passwort
- **JWT Token System**: Access + Refresh Token
- **Auto-Refresh**: Automatisches Token-Refresh bei Ablauf
- **Logout**: Sichere Abmeldung mit Token-Clearing
- **Rollen-Management**: User, Admin, Teacher Rollen

### 🏫 Classroom Management
- **Erstellen**: Neue Klassenzimmer mit Namen & Beschreibung
- **Bearbeiten**: Classroom-Details aktualisieren
- **Löschen**: Classrooms entfernen
- **Student-Verwaltung**: Schüler hinzufügen/entfernen
- **Übersicht**: Alle Classrooms mit Schüler-Anzahl

### 👥 User Management
- **Registrierung**: Neue Benutzer registrieren
- **Profil**: Benutzerdaten anzeigen
- **Rollen**: Zuordnung zu Rollen & Berechtigungen
- **Flags**: Rollen-spezifische Flags/Permissions

### 💻 Virtual Machines
- **Verwaltung**: VMs über Incus/LXD
- **Status**: Live VM-Status anzeigen
- **Start/Stop**: VM-Kontrolle
- **Zuordnung**: VMs zu Classrooms zuordnen
- **VNC Zugriff**: Remote Desktop zu VMs

### 📢 User Experience
- **Snackbar-Notifications**: Error & Success Messages
- **Loading States**: Spinner während API-Calls
- **Form Validation**: Input-Validierung
- **Responsive Design**: Mobile-friendly UI
- **Dark/Light Theme**: Theme-Unterstützung

---

## 💾 Datenmodelle

### User
\`\`\`
- id (PK)
- email (unique)
- firstName, lastName
- password (hashed)
- roleId (FK → Role)
- tokens (1:N Relation)
- classrooms (N:M via ClassroomUser)
\`\`\`

### Role
\`\`\`
- id (PK)
- name (unique)
- users (1:N Relation)
- flags (1:N Relation)
\`\`\`

### Classroom
\`\`\`
- id (PK)
- name
- description
- users (N:M via ClassroomUser)
\`\`\`

### Token
\`\`\`
- id (PK)
- token (unique)
- userId (FK → User)
- createdAt, expiresAt
\`\`\`

### VirtuelMachine
\`\`\`
- id (PK)
- name
- hostname
- description
- operatingSystem
- ownerId (FK → User)
\`\`\`

---

## 🔌 API Endpoints (Übersicht)

### Auth Routes
\`\`\`
POST   /auth/login              - Login mit Email/Password
POST   /auth/register           - Neue Benutzer registrieren
POST   /auth/logout             - Logout
POST   /auth/token              - Token Refresh
\`\`\`

### User Routes
\`\`\`
GET    /user/:id                - User-Daten abrufen
GET    /user                    - Aktueller User
\`\`\`

### Classroom Routes
\`\`\`
GET    /classroom               - Alle Classrooms
POST   /classroom               - Neues Classroom erstellen
DELETE /classroom/:id           - Classroom löschen
GET    /classroom/:id/students  - Schüler eines Classrooms
POST   /classroom/:id/students  - Schüler hinzufügen
DELETE /classroom/:id/students/:studentId - Schüler entfernen
\`\`\`

### VM Routes
\`\`\`
GET    /incus/vms               - Alle VMs
POST   /incus/vm/create         - VM erstellen
GET    /incus/vm/:id/start      - VM starten
GET    /incus/vm/:id/stop       - VM stoppen
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm oder yarn
- PostgreSQL 14+
- Incus/LXD (optional, für VM-Features)

### Backend Setup
\`\`\`bash
cd backend
npm install
npm install -g @prisma/cli
npx prisma generate
npx prisma db push
npm run dev
\`\`\`

**Server läuft auf:** `http://localhost:4000`

### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

**Frontend läuft auf:** `http://localhost:3000`

---

## 📡 Kommunikation zwischen Frontend & Backend

**Request-Flow:**
1. User interagiert mit Component
2. Component nutzt React Query Hook
3. Hook ruft API Client auf
4. Axios Interceptor fügt JWT Token hinzu
5. Request geht zum Backend
6. Backend validiert Token & verarbeitet Request
7. Response mit Success/Error
8. Zustand Store wird aktualisiert
9. Component re-rendert mit neuen Daten

**Authentication:**
- JWT in `Authorization: Bearer <token>` Header
- 401 Response → Auto-Refresh
- Erfolgreiche Responses triggern Snackbar

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 + React 18
- **State:** Zustand + React Query
- **HTTP:** Axios
- **Styling:** Tailwind CSS
- **UI Icons:** Lucide React
- **Language:** TypeScript

### Backend
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (jsonwebtoken)
- **Hashing:** Bcrypt
- **Language:** TypeScript

---

## 📚 Weitere Informationen

Detaillierte Dokumentation für Frontend und Backend:
- [Frontend README](./frontend/README.md) - Frontend Architecture & Components
- [Backend README](./backend/README.md) - Backend API & Database
- [Doc Folder](./doc/README.md) - Zusätzliche Dokumentation

---

## 👨‍💻 Entwicklung

Die Anwendung wurde mit modernen Development Best Practices entwickelt:
- TypeScript für Type Safety
- Middleware für Cross-Cutting Concerns
- State Management für Global State
- React Query für Server State
- Component-basierte Architektur
- Standardisierte Error/Success Responses
