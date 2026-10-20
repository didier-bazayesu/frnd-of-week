# Friend of the Week ❤️

A beautiful, responsive React + TypeScript web application designed to connect community members with a new friend every week.

---

## 🌟 Features

### 1. Public Experience
- **Landing Page**: Modern welcoming interface with floating hearts, tagline, and an intuitive "Discover My Friend" search card.
- **Participant Search**:
  - Validates required first name, last name, and phone number with friendly inline feedback.
  - Normalizes names (trims whitespace, collapses multiple spaces, case-insensitive).
  - Normalizes Rwanda phone formats (`07XXXXXXXX`, `+2507XXXXXXXX`, `2507XXXXXXXX`).
  - Strict privacy: only reveals the matched friend if both name and phone number match registered records.
- **Friend Reveal Page (`/match/:participantId`)**:
  - Celebratory confetti burst.
  - Displays the matched friend's full name, academic year, and phone number.
  - Direct contact action via `tel:` link.
  - Inspiring friendship quote deterministically assigned per participant per week.
  - Friendly call-to-action encouraging the first step.

### 2. Matching Algorithm & Persistence
- Reciprocal pairs ($A \leftrightarrow B$) with deterministic weekly seeds based on the ISO-8601 week ID (e.g. `2024-W42`).
- Odd participant count handled gracefully with a rotating 3-person cycle ($A \rightarrow B \rightarrow C \rightarrow A$).
- Self-matching prevention and duplicate prevention validation.
- Consistent throughout the week and preserved in `localStorage`. Automatically advances when a new week arrives.
- Incomplete participant records (missing or malformed phone numbers) are flagged and excluded from public matching.

### 3. Demo Admin Area
- **Admin Login (`/admin/login`)**:
  - Demo credentials: `didierbazayesu@gmail.com` / `didier123`
  - Protected route guard using session storage.
- **Admin Dashboard (`/admin/dashboard`)**:
  - Key statistics: Total participants, ready for matching, incomplete records, current matches.
  - Current week identifier and match timestamp.
  - Manual match generation / regeneration with safety confirmation.
  - Match preview list.
  - Filterable & searchable participant table with status badges and flagged error notes.
  - **CSV Import / Export**:
    - Upload `.csv` with columns `id, firstName, lastName, year, phone`.
    - Live parse preview with validation error reporting.
    - Export current participants list as CSV.

---

## 🔒 Privacy & Frontend-Only Architecture

> **Important Notice on Security:**
> This project is a frontend-only demonstration with no backend or remote database.
> - Data is stored in browser `localStorage` and `sessionStorage`.
> - Admin authentication is simulated in client-side code and should not be used for production secrets or sensitive workloads.
> - Participant numbers and names are kept in local storage or initial seeded data.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18+ or 20+ recommended)
- npm

### Installation
```bash
# Clone or navigate to the repository
cd frnd-of-week

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production
```bash
npm run build
```

The production assets will be built in the `dist/` directory.

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ParticipantForm.tsx
│   ├── FriendCard.tsx
│   ├── FriendshipMessage.tsx
│   ├── ProtectedRoute.tsx
│   └── admin/
│       ├── StatsCard.tsx
│       ├── ParticipantsTable.tsx
│       └── CsvImport.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── MatchPage.tsx
│   ├── AdminLoginPage.tsx
│   └── AdminDashboardPage.tsx
├── data/
│   ├── participants.ts
│   └── friendshipMessages.ts
├── types/
│   ├── participant.ts
│   └── matching.ts
├── utils/
│   ├── matching.ts
│   ├── validation.ts
│   ├── phone.ts
│   ├── week.ts
│   └── csv.ts
├── services/
│   ├── participantStorage.ts
│   └── matchingStorage.ts
├── config/
│   └── admin.ts
├── App.tsx
├── main.tsx
└── index.css
```
