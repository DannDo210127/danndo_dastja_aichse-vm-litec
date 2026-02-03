# Backend - Dokumentation

## Overview
Express.js + Prisma REST API für Classroom-Management, Benutzer-Authentifizierung und VM-Verwaltung.

---

## 📁 Projektstruktur

### `/src/server.ts`
**Entry Point**
- Express Server-Konfiguration
- Route-Registrierung
- CORS & Middleware Setup

### `/src/routes`
**API Endpoints**
- `authentification.ts` - Login, Register, Logout, Token-Refresh
- `user.ts` - User-Daten abrufen/aktualisieren
- `classroom.ts` - Classroom CRUD, Student-Verwaltung
- `incus.ts` - VM-Verwaltung (Incus/LXD)

### `/src/controller`
**Business Logic**
- `AuthentificationController.ts` - Auth-Logik (JWT, Passwort-Hashing)
- `UserController.ts` - User-Operationen
- `ClassroomController.ts` - Classroom & Student-Verwaltung
- `IncusController.ts` - VM-Operationen

### `/src/middleware`
**Express Middleware**
- `authentication.ts` - JWT-Verifizierung + User-Injection

### `/src/auth`
**Authentifizierung**
- `token.ts` - JWT Token Generation (Access & Refresh)

### `/src/db`
**Datenbankverbindung**
- `client.ts` - Prisma Client Singleton

### `/src/config`
**Konfiguration**
- `config.ts` - Umgebungsvariablen & Settings

### `/src/util`
**Hilfsfunktionen**
- `Error.ts` - Standardisiertes Error-Format
- `Success.ts` - Standardisiertes Success-Format

### `/prisma`
**Datenbankschema**
- `schema.prisma` - Models: User, Role, Token, Classroom, ClassroomUser, VirtuelMachine
- `migrations/` - Migrations History

---

## 🗄️ Datenmodelle

| Modell | Zweck |
|--------|-------|
| **User** | Benutzer mit Role + Tokens |
| **Role** | Benutzerrollen + Flags |
| **Token** | Refresh Tokens (TTL) |
| **Classroom** | Klassenzimmer |
| **ClassroomUser** | N:M Beziehung User ↔ Classroom |
| **VirtuelMachine** | VMs mit Owner |

---

## 🔑 Hauptfeatures

| Endpoint | Methode | Beschreibung |
|----------|---------|-------------|
| `/auth/login` | POST | Login mit Email/Password |
| `/auth/register` | POST | Registrierung |
| `/auth/logout` | POST | Logout |
| `/auth/token` | POST | Token-Refresh |
| `/user/:id` | GET | User-Daten abrufen |
| `/classroom` | GET/POST | Classrooms abrufen/erstellen |
| `/classroom/:id` | DELETE | Classroom löschen |
| `/classroom/:id/students` | GET/POST/DELETE | Student-Verwaltung |
| `/incus/*` | POST/GET | VM-Operationen |

---

## 🔐 Authentifizierung

**JWT-Flow:**
1. Login → Access Token + Refresh Token
2. Request mit Authorization Header: `Bearer <accessToken>`
3. 401 → Refresh mit Refresh Token
4. Logout → Tokens löschen

**Middleware:** `isAuthenticated` verifiziert Token + injiziert User mit Role

---

## 🚀 Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

**Abhängigkeiten:**
- Express
- Prisma
- JSONWebToken
- Bcrypt
- PostgreSQL (DB)

**Umgebungsvariablen (.env):**
```
DATABASE_URL=postgresql://...
JWT_ACCESS_TOKEN_SECRET=...
JWT_REFRESH_TOKEN_SECRET=...
PORT=4000
```

---

## 📝 Response-Format

**Success:**
```json
{
  "success": { "message": "Operation erfolgreich" }
}
```

**Error:**
```json
{
  "error": { "code": 101, "message": "Fehlermeldung" }
}
```

