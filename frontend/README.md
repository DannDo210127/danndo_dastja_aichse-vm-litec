# Frontend - Dokumentation

## Overview
Next.js + React basierte Web-Anwendung für Classroom-Management und VM-Verwaltung mit JWT-Authentifizierung und Echtzeit-UI-Updates.

---

## 📁 Projektstruktur

### `/src/app`
**Next.js App Router & Pages**
- `layout.tsx` - Root Layout mit Navigation & Authentifizierung
- `page.tsx` - Dashboard/Startseite
- `classrooms/` - Classroom-Management & Student-Verwaltung
- `profile/` - Benutzerprofil
- `vm/` - Virtuelle Maschinen Übersicht
- `vnc/` - VNC-Viewer für VM-Zugriff

### `/src/components`
**Spezifische Modal- & Feature-Komponenten**
- `LoginModal.tsx` - Login-Authentifizierung
- `RegisterModal.tsx` - Benutzer-Registrierung
- `createClassroomModal.tsx` - Neues Classroom erstellen
- `deleteClassroomModal.tsx` - Classroom löschen
- `addStudentModal.tsx` - Schüler hinzufügen
- `deleteStudentModal.tsx` - Schüler entfernen
- `Navigation.tsx` - Haupt-Navigationsbar
- `NavigationButton.tsx` - Wiederverwendbarer Nav-Button

### `/src/shared`
**Generische, wiederverwendbare UI-Komponenten**
- `StandardButton.tsx` - Button mit customisierbar Styling
- `StandardInput.tsx` - Input-Feld mit Validierung
- `StandardModal.tsx` - Modal-Container (Basis)
- `ConfirmModal.tsx` - Bestätigungsdialog
- `LoadingScreen.tsx` - Vollbild-Ladebildschirm
- `Spinner.tsx` - Lade-Spinner
- `Snackbar.tsx` - Toast-Benachrichtigungen

### `/src/api`
**API-Client & HTTP-Kommunikation**
- `client.ts` - Axios-Instanz mit Interceptors
- `user.ts` - User-Endpoints
- `classroom.ts` - Classroom-Endpoints

### `/src/hooks`
**Custom React Hooks**
- `useAuth.ts` - Authentication State & User Management

### `/src/store`
**Zustand State Management**
- `token-store.ts` - JWT Token Persistence
- `snackbar-store.ts` - Notifications
- `theme-store.ts` - Theme Settings
- `error-store.ts` - Error Management

### `/src/types`
**TypeScript Definitionen**
- `global.tsx` - Globale Interfaces

---

## 🔑 Hauptfeatures

| Feature | Beschreibung |
|---------|-------------|
| **Authentication** | Login/Register mit JWT, Auto-Refresh, Logout |
| **Classrooms** | CRUD-Operationen |
| **Student Management** | Schüler hinzufügen/entfernen |
| **Virtual Machines** | VM-Verwaltung |
| **VNC Viewer** | Remote Desktop zu VMs |
| **Notifications** | Error & Success Snackbars |

---

## 🚀 Setup

```bash
cd frontend
npm install
npm run dev
```

**Port:** `http://localhost:3000`

**Abhängigkeiten:**
- Next.js 14+
- React 18+
- React Query
- Axios
- Zustand
- Tailwind CSS
