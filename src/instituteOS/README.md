# Coaching Ledger — Restructured

This is a pure re-organization of `CoachingLedger.jsx` (was 11,025 lines / 647 KB,
one file) into a standard multi-file React/Vite structure. **No logic, JSX,
styling, or behavior was changed.** Every function and component was moved
byte-for-byte into its new file; only `import`/`export` statements were added
so the pieces can find each other again.

This was verified mechanically, not just by eye:
- A script walked every one of the 147 top-level functions/components/constants
  in the original file and confirmed every single one landed in exactly one
  new file (nothing missing, nothing duplicated).
- Every file was parsed with a JS AST parser to find every variable/identifier
  it uses, cross-checked against React, Firebase, Recharts, lucide-react, and
  your own code — anything not already in scope was auto-imported from the
  correct new file.
- The whole thing was then bundled end-to-end with esbuild (same class of
  bundler Vite uses) and **built successfully with zero errors**, confirming
  every import resolves and there are no leftover undefined references.

## What changed vs. what didn't

**Didn't change:** every calculation, every JSX element, every className,
every Firestore call, every piece of business logic (student lifecycle,
deposits, charges, Banking ledger, Credit/Loan ledger, receipts, statements,
Joining Form, promote/exit/undo, trash/restore, attendance, scores — all of it).

**Did change (organization only):**
- One 11,025-line file → 33 focused files, grouped by feature area.
- The big "UPDATE NOTES" comment block that lived at the top of the file is
  now `CHANGELOG.md` (same content, easier to read, doesn't push real code
  down 900 lines every time you open the file).
- Shared helper functions (date formatting, money formatting, ID generation,
  ledger math, etc.) now live in `src/lib/`, so they can eventually be unit
  tested on their own.

## New folder structure

```
src/
  App.jsx                              ← main orchestrator (was the CoachingLedger() function)
  main.jsx                             ← entry point
  constants/appConstants.js            ← DEFAULT_CLASSES, PAYMENT_MODES, EXIT_REASONS, etc.
  contexts/InstituteSettingsContext.jsx
  lib/
    dates.js                           ← fmtDate, chronoKey, compareChrono, etc.
    money.js                           ← fmtINR, round2
    ids.js                             ← generateStudentId, generateTeacherId, etc.
    finance.js                         ← computeStudentLedger, defaultFeeStructure, etc.
    academic.js                        ← findAutofillBatch, computeTeacherPerformance
    whatsapp.js                        ← sendWhatsAppReceipt
  components/
    common/UI.jsx                      ← Modal, WideModal, Card, Stamp, Field, etc.
    dashboard/DashboardTab.jsx
    students/                          ← StudentsTab, StudentModals, DuesTab
    fees/                              ← DepositsChargesExpensesTab, FeeModals
    banking/                           ← BankingTab, BankingModals
    academic/                          ← AttendanceTabs, ScoresTabs, BehaviourTab, PerformanceReports
    structure/StructureTab.jsx
    statements/CenterStatementTab.jsx
    staff/                             ← TeachersTab, BatchScheduleTab, StaffTab, SalaryAdvanceTab, InfrastructureTab
    trash/TrashTab.jsx
    notes/                             ← NotesTab, NoteFormModal
    settings/SettingsModal.jsx
```

## How to merge this into your GitHub repo

1. **Delete** the old `src/CoachingLedger.jsx` from your repo (its contents
   now live across the files above — nothing is lost, just moved).
2. **Copy** the entire `src/` folder from this download into your repo's
   `src/` folder, overwriting nothing else.
3. **Keep your existing `src/firebase.js` exactly as it is** — it wasn't
   touched or included here on purpose, since it holds your real Firebase
   project credentials and I don't have those. Nothing else needed changing
   in it.
4. Check your existing `src/main.jsx` — if it already does
   `import App from "./App"` (or similar) and renders it, you're already
   compatible. The `main.jsx` included here is a minimal reference version
   in case yours needs adjusting.
5. Commit and push. Run `npm run dev` locally first to confirm it loads
   exactly as before.

## Next steps (not done yet, per your request)

You mentioned wanting, next: password/auth security, individual student
and teacher logins with role-based views, attendance and score tracking
exposed to those logins, and WhatsApp integration. This restructure is
what makes those additions safe to build — for example, `contexts/` is
ready to hold an `AuthContext.jsx`, and `lib/` is ready to hold the
Firestore security-rule-aware data access functions those features will need.
Nothing for those features has been added yet, as requested.
