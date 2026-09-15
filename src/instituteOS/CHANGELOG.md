# Coaching Ledger — Update History

This is the full change history that used to live as a comment block at the top of the single `CoachingLedger.jsx` file. It's moved here as part of the project restructure so the code file stays clean; nothing in it was altered.

UPDATE NOTES — read this before touching anything below.

IMPORTANT: every existing feature in this file (student lifecycle,
deposits, charges, write-offs, Banking ledger, Credit/Loan ledger,
receipts, statements, joining form, promote/exit/undo, trash/restore,
etc.) is intact and unchanged in behavior except where explicitly noted
below. Nothing was removed. If you (a future Claude, or anyone editing
this file) are asked to add more on top of this, keep that same rule:
add / fix, never silently drop something that already worked.

Changes made in this update pass:
  1. Fee & Class Structure → "Manage Streams" was floating in the
     SectionHeader action slot, misaligned from the "Fee Matrix Pricing"
     / "Class & Subject List" sub-tab pill row underneath it. It's now a
     third button inside that same bordered pill row, right after
     "Class & Subject List", styled to match (see StructureTab).
  2. Dashboard "Net Liquidity" (Cash Balance / Online Balance) used a
     simplified formula — deposits minus expenses only — which silently
     ignored Cash⇄Bank transfers, Credit/Loan entries, and Interest
     payments. It now reuses the exact same running-balance figures
     (bankingCashBalance / bankingBankBalance) the Banking tab computes,
     so the two screens always agree to the rupee (see the "Dashboard
     Net Liquidity" note near the Banking Ledger block, and the
     totalCashBalance / totalOnlineBalance assignment).
  3. Dashboard was reorganized into clearly labeled sections (Overview →
     Financial Health → Trends & Activity) and gained a new "Top
     Outstanding Dues" panel for a quick at-a-glance view of who owes
     the most, without needing to open the Dues tab (see DashboardTab).
  4. Center Statement: the Student ID under each row was a clickable
     button that also toggled the mini "student info" panel open. It's
     now plain, non-clickable text — the info panel still opens, just
     via a separate small ▸/▾ toggle next to the ID instead of the ID
     itself being clickable. Search now also matches on mobile number,
     not just name / Student ID (see CenterStatementTab).
  5. Banking Statement: Student ID was already shown on every row; search
     now also matches mobile number in addition to Student ID / name /
     description / remarks (see BankingTab).

Changes made in this second update pass:
  6. Fee & Class Structure → "Manage Streams" is now a real third tab
     (not a modal launched from a button) inside the same pill row as
     "Fee Matrix Pricing" / "Class & Subject List" — clicking it swaps
     the panel below inline, exactly like the other two. The old modal
     component was converted to an inline panel, StreamManagerPanel
     (see StructureTab).
  7. Banking → Credit & Loan Ledger: interest payments now also have
     their own separate "Interest Payments Log" section (below the
     Credit & Loan Ledger, same pattern as the Cash ⇄ Bank Transfer
     Logs section), so they can be deleted independently instead of
     only from inside a credit entry's expanded history (which is now
     view-only) (see BankingTab).
  8. Center Statement & Banking Statement: the Student ID under each row
     is now plain, non-clickable text with no ▸/▾ arrow at all — the
     per-row "view student info" toggle from the previous pass has been
     removed entirely, per request (see CenterStatementTab / BankingTab).
  9. Every transaction list ("statement") was sorted by date only, so
     same-day entries could appear out of the order they actually
     happened in. Every deposit/charge/expense/bank-transfer/credit/
     interest-payment record now also stores a `createdAt` timestamp at
     creation time, and every statement/log sort (Center Statement,
     Banking Statement, Student Statement, Deposits/Charges/Expenses
     logs, Credit Ledger, Transfer logs) uses date + createdAt together
     via the new chronoKey()/compareChrono() helpers — so same-day
     entries now land in true chronological order. No time is ever
     displayed anywhere; only the date still shows, exactly as before.
 10. Students Register → "Total Due": a student who has deposited extra
     or paid in advance now shows their Total Due as a NEGATIVE amount
     (e.g. "-₹500 (advance)") instead of ₹0. computeStudentLedger() now
     returns an additional `rawBalance` (unclamped, can go negative)
     alongside the existing `balance` (still clamped at 0) — every other
     total in the app (Dues tab, Dashboard, totalOutstanding, etc.)
     keeps using the clamped `balance` exactly as before; only the
     Students Register table reads the new signed figure.
 11. Every date shown anywhere in the UI (statements, receipts, the
     Joining Form, Trash tab, student details, etc.) now displays as
     DD-MM-YYYY via the new fmtDate() helper. Nothing about how dates
     are stored, filtered, or compared changed — <input type="date">/
     "month"> fields, Firestore fields, and all string comparisons still
     use the original YYYY-MM-DD (ISO) format; fmtDate() is purely a
     last-mile display formatter, never used for storage or logic.
 12. Student form gained a "Joining Date" field (type="date", optional).
     If left blank, it's auto-filled with today's date at save time
     (see submit() in StudentFormModal). Stored as `joiningDate` on the
     student record and shown in the Students Register expanded row and
     on the printed Joining Form.

Changes made in this third update pass:
 13. Add Student → "Joining Date" field now visibly defaults to TODAY'S
     date the moment the form opens (not just silently at save time as
     before) — office staff see it pre-filled and can change it to
     backdate a student if needed; if they don't touch it, today's date
     is what gets saved (see the joiningDate useState in
     StudentFormModal).
 14. Student Statement → Description column no longer shows the small
     "Unpaid" stamp next to an outstanding charge line. The Debit /
     Credit / running Balance columns already show exactly what's owed,
     so the stamp was redundant clutter (see StudentStatementModal).
 15. Every date shown anywhere in the app now displays as "D Month
     YYYY" (e.g. "17 August 2026") instead of "DD-MM-YYYY" — this is a
     one-line change to the shared fmtDate() helper, so it applies
     everywhere at once: Students Register, Student/Center/Banking
     Statements, all receipts & slips, the Joining Form, Trash tab,
     credit/interest logs, everywhere. Storage format (YYYY-MM-DD),
     <input type="date"/"month">, filtering, and sorting are completely
     untouched — only the last-mile display formatter changed.
 16. Printable Statement (Student Statement, Center Statement, Banking
     Statement) — the "Print / Export" button used to clone the on-
     screen preview's HTML into a bare popup window that never loaded
     the app's Tailwind styling or fonts, so everything printed as
     unstyled black text with no layout, colors, or letterhead — even
     though the on-screen preview looked correct. Each of these three
     print windows now loads the same Google Fonts import and the
     Tailwind CDN the live app effectively relies on, plus a proper A4
     @page rule, a bordered letterhead document wrapper matching the
     Joining Form's professional look, and print-safe table rules (no
     row splitting across pages, repeating header). The on-screen
     preview markup itself is unchanged — only what the popup window
     loads before printing it changed.

Changes made in this fourth update pass:
 17. NEW FEATURE — Notes: a simple internal notepad tab (sidebar, right
     above Trash / Restore) completely separate from the financial
     ledger. Add / edit / pin / delete free-text notes (title + body),
     cloud-synced like everything else via a new "notes" Firestore
     collection. Pinned notes float to the top. Nothing here touches
     any student, deposit, charge, or balance (see NotesTab,
     NoteFormModal, saveNote / toggleNotePin / deleteNote).
 18. BUG FIX — Statement dates wrapping onto 3 lines (DD on one line,
     Month on the next, YYYY on the last): fmtDate() itself always
     produced a correct single-line "D Month YYYY" string — the actual
     bug was that the narrow table cells showing it had no
     `whitespace-nowrap`, so the browser wrapped the string wherever it
     ran out of column width. Added `whitespace-nowrap` to every date
     cell across every statement/log table (Deposits, Charges,
     Expenses, Center Statement, Banking Statement, Cash⇄Bank Transfer
     Logs, Credit & Loan Ledger, Interest Payments Log, Trash tab,
     Student Statement) — dates now always render on one line.
 19. Banking tab reorganized into four separate, professional pill-tab
     panels — Banking Statement, Cash ⇄ Bank Transfer Logs, Credit &
     Loan Ledger, Interest Payments Log — instead of one long stacked
     scroll, using the same sub-tab pattern already used by Fee &
     Class Structure (see StructureTab). Every feature that existed
     before (search & filters on the main statement, print/export,
     add/delete on each log, expand a credit entry's interest-payment
     history, Pay Interest) is fully intact — this only changes how
     the four sections are navigated, not what they do (see
     BankingTab, BANKING_SUB_TABS).
 20. BUG FIX — a student saved with ZERO subjects/batches selected was
     being silently charged the 1-subject Fee Matrix rate every month,
     because both computeStudentLedger() and the dashboard's
     forecastForMonth() did `batches.length || 1`, and expectedFeeFor()
     itself also forced any falsy batch count up to 1. A batch count of
     0 is falsy in JavaScript, so "no subjects chosen" was
     indistinguishable from "1 subject chosen" and got billed as if
     the student had taken a single subject they were never actually
     enrolled in. expectedFeeFor() now returns ₹0 immediately for a
     batch count of 0 (before ever consulting the fee matrix), and
     both call sites no longer force that fallback to 1 — a
     subject-less student now correctly accrues ₹0 tuition instead of
     the 1-subject rate. Students with 1+ subjects are billed exactly
     as before.

Changes made in this fifth update pass:
 21. NAVIGATION — the six sidebar tabs Students Register, Pending Dues,
     Deposits Log, Charges, Center Statement, and Fee & Class Structure
     are now one sidebar entry, "Student Management" (id
     "students-management"), with an internal bordered pill row of six
     sub-tabs in that exact left-to-right order — same pattern already
     used by Fee & Class Structure's own 3-way pill row and Banking's
     4-way pill row. This is purely a navigation regroup: StudentsTab,
     DuesTab, DepositsTab, ChargesTab, CenterStatementTab, and
     StructureTab are all reused completely unchanged, wired with the
     exact same props (search boxes, filters, Add Student / Add Charge
     / Record Deposit / Print-Export buttons, receipts, modals,
     add/edit/delete/restore actions) they had as standalone tabs — none
     of that behavior changed. See StudentManagementTab and
     STUDENT_MANAGEMENT_SUB_TABS. Fee & Class Structure's own internal
     3-way pill row (Fee Matrix Pricing / Class & Subject List / Manage
     Streams) is untouched and still lives one level down, inside the
     new "Fee & Class Structure" sub-tab. Expenses Log and Banking are
     unaffected and remain separate sidebar tabs, exactly as before.

Changes made in this sixth update pass:
 22. NEW FEATURE — Academic Monitoring: a new sidebar tab (id
     "academic-monitoring", right after Student Management) tracking
     student academic performance, for internal use and for
     parent-facing printouts. Uses the exact same bordered pill-tab
     pattern as Fee & Class Structure / Student Management (see
     AcademicMonitoringTab / ACADEMIC_MONITORING_SUB_TABS), with four
     sub-tabs in this order: Attendance (mark daily/class-wise
     Present/Absent/Late per student, date filter, per-student
     attendance % summary — see AttendanceTab), Test Scores (test name,
     subject, date, marks, remarks per student, with per-student score
     history and class-wise averages — see TestScoresTab), Behaviour &
     Conduct (dated notes tagged positive / neutral / needs-attention —
     see BehaviourTab), and Performance Report (a printable A4,
     parent-facing summary combining attendance %, recent test scores,
     and behaviour notes for one student, reusing the same Tailwind CDN
     + Google Fonts print-popup pattern as the Joining Form / Center
     Statement — see PerformanceReportTab). Each of Attendance, Test
     Scores, and Behaviour & Conduct has its own Firestore collection
     ("attendance", "testScores", "behaviourNotes" respectively), synced
     live via onSnapshot exactly like every other collection in this
     file, and each fully supports soft-delete + Trash/Restore +
     permanent delete, wired into the existing TrashTab and trashCount
     (see AttendanceFormModal / TestScoreFormModal / BehaviourFormModal
     and the saveAttendance / saveTestScore / saveBehaviourNote +
     soft/restore/permanent-delete functions below). Nothing about any
     existing tab, collection, or handler changed.

Changes made in this seventh update pass:
 23. NEW FEATURE — Teacher Management, Batch Schedule, Staff, Teacher
     Performance, Attendance (batch-wise), and Test Marks. Five new
     Firestore collections, synced live via onSnapshot exactly like
     every other collection in this file: "teachers", "staff",
     "batchSchedule", "attendanceLog", "tests".
     NOTE on naming: the brief asked for a Firestore collection named
     "attendance" for the new batch-wise marking feature, but this file
     already has a per-student "attendance" collection powering the
     existing Academic Monitoring → Attendance sub-tab (see change #22
     above). That collection is untouched — this pass uses a
     differently-named collection, "attendanceLog", for the new
     roster/date/subject-based marking feature so the two never collide
     or get mixed up. Flagging this rename since it wasn't explicitly
     asked for.
   - Teacher Management (new sidebar tab, right after Student
     Management): sub-tabs Teachers (register/list/expand-row, mirrors
     StudentsTab + StudentFormModal — see TeachersTab /
     TeacherFormModal), Performance (see computeTeacherPerformance /
     TeacherPerformanceTab), Batch Schedule (see BatchScheduleTab /
     BatchScheduleFormModal), and Staff (reuses the Teacher form shell
     minus expertise/batch fields, plus a free-text Title — see
     StaffTab / StaffFormModal). Batch Schedule and Staff were placed
     here as sub-tabs rather than their own sidebar entries, to keep
     the sidebar from getting crowded — flagged as a judgment call per
     the brief, easy to promote to top-level nav later if preferred.
   - Attendance (new sidebar tab): sub-tabs "Mark Attendance" (date +
     class + subject, autofill from Batch Schedule only when the date
     is today and exactly one schedule window matches the current
     time, defaults everyone to Absent, idempotent upsert keyed by
     date+class+subject — see MarkAttendanceTab) and "Test Marks"
     (auto-generated Test ID {class}{subject}{YY}{seq}, roster pulled
     from the matching Batch Schedule record — see TestMarksTab). Test
     Marks was placed under Attendance rather than its own sidebar
     entry, same sidebar-crowding judgment call as above.
   - Teacher Performance is intentionally NOT hardcoded to one
     weighting formula — see computeTeacherPerformance(), an isolated,
     clearly-commented function with the attendance/test-score weights
     called out as the one thing to confirm/tune. The Performance
     sub-tab shows the computed summary AND the batch-level numbers it
     was built from, so it's auditable rather than a black box.
   - "Student active in a batch as of date X" (Test Marks roster) reuses
     the same batchHistory-by-month logic batchesForMonth() already
     uses for fee calculation (matched on the selected test date's
     month) — see studentsActiveInBatch(). Flagged: this checks the
     student's CURRENT class against the batch's class, since class
     itself isn't tracked with per-date history the way subjects/
     batches are (only the latest class change is snapshotted via
     Promote). Worth confirming if that's precise enough.
   - Trash/Restore: Teachers and Staff are fully wired into the
     existing Trash tab (soft delete / restore / permanent delete),
     same as students. Batch Schedule entries use a simple confirm +
     permanent delete (no trash bin) since they're setup/config
     records, not financial or attendance history. Attendance and Test
     Marks records save as one upserted document per key (date+class+
     subject, or the generated Test ID) exactly as specified, so
     re-opening the same combination edits in place rather than
     creating a duplicate to trash.
     Nothing about any existing tab, collection, component, or handler
     changed.

Changes made in this fourth update pass:
 24. Teacher Management → renamed to "Institute Management" in the
     sidebar label and the tab's own SectionHeader/eyebrow text only —
     the internal id stays "teacher-management" so nothing that already
     referenced it (routing, trashCount, etc.) broke. Subtitle reworded
     to mention Salary and Advance now living here too.
     NEW FEATURE — Salary (see SalaryTab / SalaryFormModal /
     SalarySlipModal): a new sub-tab, right after "Staff", for paying
     teachers and other staff. The picker merges visibleTeachers and
     visibleStaff into one list (see mergeStaffAndTeachers()) with a
     personType flag ("teacher"|"staff") carried through everywhere.
     Pay Salary writes a `salaryPayments` record (own generateSalaryId()
     sequence, "SAL<year>####", same mechanism as generateStaffId) and,
     when the net amount paid is > 0, a matching banking feed line
     (kind: "debit", bucket by mode) so it lands in the Banking
     Statement's running Cash/Bank balance exactly like an expense —
     see bankingSalaryLines, folded into bankingFeedAsc alongside
     bankingExpenseLines. A printable salary slip (ChargeReceiptModal's
     print-window pattern) is shown after saving and can be reopened
     from the Salary history table.
     NEW FEATURE — Advance (see AdvanceTab / AdvanceFormModal): another
     new sub-tab, right after "Salary", for recording an advance given
     to a teacher or staff member. Give Advance writes an `advances`
     record (own generateAdvanceId() sequence, "ADV<year>####|,
     outstandingAmount starts equal to amount, status "open") and its
     own banking debit line (bankingAdvanceLines), same treatment as an
     expense. The Salary form reads a person's open advances (oldest
     first) and lets the office deduct part or all of the outstanding
     total from a salary payment; the deducted amount is subtracted
     from that payment's net payable and walked across the person's
     open advance records (oldest first) reducing each one's
     outstandingAmount, flipping status to "settled" at zero — see the
     settlement loop inside saveSalaryPayment(). The salary slip lists
     which advance record(s) were deducted, with date/reference.
     Both new collections follow the exact same onSnapshot subscribe /
     visibleX = x.filter(r => !r.deleted) / trashedX / soft-delete
     pattern as teachers/staff, and are fully wired into the existing
     Trash tab (new "Deleted Salary Payments" / "Deleted Advances"
     sections, counted in trashCount) exactly like every other
     collection. ASSUMPTION: soft-deleting a salary payment does not
     reverse any advance settlement it made (no existing soft-delete in
     this file reverses side effects either, e.g. deleting a deposit
     doesn't undo the charges it paid off) — flagging this in case the
     office wants that behavior changed.
     NEW — Per-person Statement (see PersonStatementModal): a combined,
     chronological (compareChrono) history of every salary payment and
     every advance given/settled for one teacher or staff member, with
     running totals, modeled directly on StudentStatementModal. Opens
     from a row in Salary/Advance history or from a new small
     "Statement" action added next to the existing Edit/Remove actions
     on each row in the Teachers and Staff registers (see TeachersTab /
     StaffTab) — those two tables' existing columns and actions are
     otherwise untouched.

Changes made in this eighth update pass:
 25. BUG FIX — advance settled from salary not showing correctly in the
     statement. Root causes, confirmed by walking every place the brief
     flagged:
       a) saveSalaryPayment()'s open-advances filter matched a person by
          personId ALONE, unlike SalaryFormModal's outstandingAdvance
          preview (which also checked personType) — a real scoping gap
          if a teacher and a staff member ever shared a personId.
          Fixed by factoring the "find this person's open advances
          oldest-first, and apply a deduction across them" logic into
          two shared helpers — openAdvancesFor() and
          allocateAdvancePayoff() (both scoped by personId AND
          personType) — now used by SalaryFormModal's live preview,
          saveSalaryPayment()'s settlement loop, AND
          saveAdvanceReturn()'s settlement loop (see #26 below), so all
          three can never drift apart again.
       b) Confirmed as the strongest suspect: bankingSalaryLines only
          ever created a line when netPaid > 0, so a salary payment
          whose advance deduction fully absorbed the base salary
          (netPaid = 0) left NO trace anywhere in the Banking Statement
          — the settlement was completely invisible even though it
          happened. Fixed with a new bankingSalarySettlementLines feed
          — one "Advance Settled via Salary <slipId>" line per advance
          actually settled by a payment (same per-advance breakdown
          PersonStatementModal's settlementLines already uses, so the
          two always agree), created regardless of whether netPaid
          ended up 0. These are zero-cash-impact — kind: "memo" — the
          cash already moved when the advance was originally given
          (bankingAdvanceLines); the running-balance pass in the
          Banking Ledger computation now has an explicit memo branch
          that leaves runningCash/runningBank untouched, so nothing is
          ever double-counted. The existing bankingSalaryLines DEBIT
          line is untouched — still only created when real cash/bank
          actually moved (netPaid > 0).
       c) PersonStatementModal itself was fine internally, but the
          call site that builds its salaryPayments/advances props
          (App's render of <PersonStatementModal .../>) had the exact
          same personId-only filtering gap as (a) above — fixed to
          filter by personId AND personType, so its
          settlementLines/runningOutstanding can never show stale or
          cross-person data.
       d) SalaryTab's "Advance Deducted" column and the printed salary
          slip were AUDITED and found already correct — saveSalaryPayment
          always overwrites the saved record's advanceDeducted with the
          actual (post-clamp) amount before saving, so both already
          read actualDeducted/settledAdvances, never the raw requested
          input, including on partial settlement. No change needed
          there; confirming it explicitly since the brief asked for it
          to be checked.
     Added two new banking line types to BANKING_TXN_TYPE_META —
     advance_settled and advance_returned (the latter for #26 below) —
     so both show a proper label/Stamp in the Banking Statement's Type
     column and filter dropdown instead of falling back to the raw
     type string.
 26. NEW FEATURE — Return Advance (see AdvanceReturnFormModal /
     saveAdvanceReturn): a teacher/staff member can now directly return
     advance money (e.g. handing back cash) outside of a salary run.
     A new "Return Advance" button sits immediately to the left of
     "Give Advance" in AdvanceTab's action row, same visual weight.
     The new modal mirrors AdvanceFormModal (PersonPicker, Amount,
     Date, Payment Mode, optional Remarks) and shows the selected
     person's current outstanding advance total, sourced from the same
     openAdvancesFor() helper #25 introduced. On save, the returned
     amount is walked across that person's open advances oldest-first
     via the shared allocateAdvancePayoff() helper (the exact same one
     saveSalaryPayment() uses), reducing outstandingAmount and flipping
     status to "settled" at zero — so a salary deduction and a direct
     return can never disagree about how a person's advances get paid
     down. Stored in a new "advanceReturns" Firestore collection (own
     generateAdvanceReturnId() sequence, "ADR<year>####", same
     mechanism as generateAdvanceId), synced live via onSnapshot and
     fully wired into Trash/Restore (new "Deleted Advance Returns"
     section in TrashTab, counted in trashCount), exactly like every
     other collection in this file. AdvanceTab also gained a second,
     read-only-style "Advance Returns" history table below the existing
     Advances table (Date / Person / Amount Returned / Mode / Remove),
     so the soft-delete action actually has a button to reach it from,
     same as every other collection's own tab. This is real money
     coming back IN — a new bankingAdvanceReturnLines feed (type:
     "advance_returned", kind: "credit") was added, folded into
     bankingFeedAsc alongside every other banking line type; Dashboard's
     "Net Liquidity" figures pick this up automatically since they're
     already sourced from the same running bankingCashBalance /
     bankingBankBalance the Banking tab computes (see UPDATE NOTES #2),
     no separate Dashboard change was needed. PersonStatementModal
     gained a matching new timeline line kind ("advance_returned"),
     reducing runningOutstanding at the correct chronological point via
     compareChrono, same as advance_settled lines. ASSUMPTION, same one
     UPDATE NOTES #24 already flags for salary payments: soft-deleting
     an advance return does not reverse the advance settlement it made
     — no existing soft-delete in this file reverses side effects
     either — flagging this in case the office wants that changed.
 27. NAVIGATION — the standalone "Attendance" sidebar tab (id
     "attendance", AttendanceMgmtTab / ATTENDANCE_MGMT_SUB_TABS, see
     UPDATE NOTES #23) has been removed. Its two sub-tabs,
     MarkAttendanceTab ("Mark Attendance") and TestMarksTab ("Test
     Marks") — both batch-wise, driven off batchSchedule/attendanceLog
     and batchSchedule/tests respectively — are now rendered directly
     inside Academic Monitoring instead, REPLACING the older per-student
     "Attendance" and "Test Scores" sub-tabs that used to live there
     (AttendanceTab / TestScoresTab, reading the older "attendance" /
     "testScores" collections). ACADEMIC_MONITORING_SUB_TABS now reads,
     left to right: Mark Attendance → Test Marks → Behaviour & Conduct
     → Performance Report, and AcademicMonitoringTab's subTab now
     defaults to "mark-attendance" (the same role the old "attendance"
     id played as the default). AttendanceMgmtTab and
     ATTENDANCE_MGMT_SUB_TABS themselves have been deleted as dead code
     now that nothing renders them; MarkAttendanceTab and TestMarksTab
     are untouched, just relocated to render directly inside
     AcademicMonitoringTab with the same props they always took.
     IMPORTANT, called out per the brief's request: AttendanceTab,
     TestScoresTab, the "attendance" / "testScores" Firestore
     collections, their onSnapshot listeners, and their Trash/Restore
     support (softDeleteAttendance / softDeleteTestScore / restore /
     permanent-delete, the "Deleted Attendance" / "Deleted Test Scores"
     sections in TrashTab) are all completely UNTOUCHED — nothing was
     deleted there, exactly as instructed, since PerformanceReportTab
     (the "Performance Report" sub-tab) still reads attendance/
     testScores props sourced from those same old collections. This
     DOES create the visible mismatch the brief asked to be flagged
     rather than silently resolved: going forward, new attendance/test
     data entered through the visible "Mark Attendance" / "Test Marks"
     sub-tabs is written to the newer attendanceLog/tests collections
     (see UPDATE NOTES #23), NOT to the older attendance/testScores
     collections Performance Report reads from — so Performance
     Report's attendance % and test score history will progressively
     diverge from what "Mark Attendance"/"Test Marks" show, since
     nothing in the visible UI writes to attendance/testScores anymore
     (their only entry points, the old AttendanceTab/TestScoresTab
     "Add"/"Edit" buttons, are no longer rendered anywhere — the
     AttendanceFormModal/TestScoreFormModal components, their
     onAdd/onEdit/onRemove handlers, and their top-level state are ALL
     still fully intact and unchanged, just currently unreachable from
     any button). Please confirm whether Performance Report should
     instead be pointed at attendanceLog/tests, or whether the old
     Attendance/Test Scores entry forms should be restored somewhere so
     the two stay in sync — left as-is pending your call, per the
     brief's explicit instruction not to silently pick a side.

Changes made in this fourth update pass:
 28. Academic Monitoring → the "Mark Attendance" sub-tab is renamed
     "Attendance" and now has its own inner pill row with two panels:
     "Mark Attendance" (unchanged — still MarkAttendanceTab, the
     existing batch-wise fill form) and a new "View Attendance" panel
     (new component ViewAttendanceTab) to browse/search previously
     saved attendanceLog sessions — filter by class/subject/date, free-
     text search by class/subject/student name/Student ID, expand a
     session to see the roster, and edit + re-save statuses in place.
     Both panels read/write the exact same attendanceLog collection via
     the same onSave (saveAttendanceLog, same date_class_subject upsert
     key), so an edit made in View Attendance is immediately reflected
     if that same session is reopened in Mark Attendance, and vice
     versa. New wrapper component AttendanceSectionTab hosts the inner
     pill row and switches between the two; ACADEMIC_MONITORING_SUB_TABS'
     "mark-attendance" entry now routes to it instead of directly to
     MarkAttendanceTab (id kept as "mark-attendance" so nothing else
     referencing that id needed to change).
 29. Academic Monitoring → the "Test Marks" sub-tab is renamed "Scores"
     and, same pattern as #28, now has its own inner pill row: "Fill
     Marks" (unchanged — still TestMarksTab) and a new "View & Search
     Scores" panel (new component ViewScoresTab) to browse the "tests"
     collection with filters (class/subject/date) plus free-text search
     across Test ID, description, class, subject, and student name/
     Student ID. Expanding a test reveals its full score table with an
     optional "Sort: Top Scorers" toggle (ranks students by marks,
     highest first, with a #1/#2/... badge) and lets you edit Max
     Marks, Description, and any student's marks, saving through the
     same onSave (saveTest, upserts by testId) TestMarksTab already
     uses — so nothing about how tests are stored changed, this only
     adds a second way to reach and edit the same records. New wrapper
     component ScoresSectionTab hosts the inner pill row; the
     "test-marks" sub-tab id is unchanged.

Changes made in this fifth update pass:
 30. Test ID generation (generateTestId) no longer includes the literal
     word "Class" when the class field itself is stored as e.g. "Class
     12" — a new classCodeForId() strips a leading "Class" (any casing)
     before building the ID, so "Class 12Mathematics2601" becomes
     "12Mathematics2601". This only changes the generated ID string;
     the actual `class` field/value everywhere else (display, filters,
     Firestore storage) is completely untouched.
 31. Attendance — saveAttendanceLog now also captures `time` (HH:MM,
     auto-captured once at first save via nowTimeStr(), shown via the
     new fmtTime() helper) and `remarks` (free text, entered in Mark
     Attendance). Both are new fields on the attendanceLog doc,
     additive — old records without them just render with no time/
     remarks shown, nothing breaks.
 32. Attendance/View Attendance — new dedicated Edit and Delete buttons
     on every row (visible without expanding first). Clicking a row
     still only opens a READ-ONLY roster view (this used to be
     editable directly — that accidental-edit path is now closed).
     "Edit" opens a separate panel with Date, Time, and Remarks inputs
     plus per-student status toggles, saved through the new
     editAttendanceLog() (deletes+recreates the doc under the new
     date_class_subject key if the date changed, so nothing is
     duplicated or orphaned; class/subject aren't editable here since
     that would change which batch the session belongs to — out of
     scope of "edit the date and time"). "Delete" calls the new
     deleteAttendanceLog() (window.confirm, then a hard delete — no
     Trash/restore for this collection; see the existing note above
     about the attendanceLog/tests vs. old attendance/testScores Trash
     mismatch — flagging this as the same kind of assumption rather
     than silently building out full Trash support for it).
 33. Scores/View & Search Scores — same pattern as #32: dedicated Edit
     and Delete buttons on every row; expanding a row is READ-ONLY
     (also gained its own "Sort: Top Scorers" toggle, independent of
     Edit mode, so you can rank without entering edit). "Edit" opens a
     panel where Class, Subject, Date, Maximum Marks, Description, and
     every student's marks are all editable, saved through the new
     editTest() — writes to the same Firestore doc id (stable since
     creation) rather than looking up by testId, and regenerates the
     testId via generateTestId() if class/subject/date changed, so
     editing those fields renames/moves the test in place instead of
     creating a duplicate or leaving the old testId as an orphan (a UI
     hint appears when class/subject/date differ from the saved values
     to make that clear). "Delete" calls the new deleteTest() (confirm
     + hard delete, same rationale as #32).
 34. BUGFIX — Performance Report (Academic Monitoring → Performance
     Report) was reading the old, no-longer-written-to `attendance` /
     `testScores` props, so it always showed "No data" / stale numbers
     no matter how much was marked in Mark Attendance / Fill Marks —
     this was flagged as a known risk in update #27 and is now fixed.
     PerformanceReportTab is repointed at `attendanceLog` / `tests`
     (the same batch-wise collections everything else already uses)
     and derives each student's attendance % / recent scores by
     scanning those collections for that student's own record/score on
     each saved session/test. AcademicMonitoringTab's "report" sub-tab
     now passes attendanceLog/tests instead of attendance/testScores;
     the old attendance/testScores props are left wired through
     unchanged (per convention) even though this tab no longer reads
     them. "X day(s) recorded" is relabelled "X session(s) recorded"
     to match what's actually being counted (one per saved
     date+class+subject session the student appears in, not one per
     calendar day).

Changes made in this sixth update pass:
 35. View & Search Scores — each test row now shows how many students
     appeared ("N student(s) appeared" in the summary line, and "N
     student(s) on this test" inside the Edit panel), and the marks
     table (both the read-only view and the Edit panel) always has a
     leading "#" row-number column now instead of only showing numbers
     when "Sort: Top Scorers" was on.
 36. Test IDs are now always fully UPPERCASE (generateTestId uppercases
     the whole generated string). The sequence-number lookup that
     finds "the next number for this prefix" now also compares
     existing testIds case-insensitively, so older mixed-case IDs
     already in Firestore still get recognized and numbered correctly
     going forward instead of restarting from 01.
 37. Attendance — AttendanceSectionTab's header now shows a running
     total ("N attendance session(s) recorded so far"), and View
     Attendance gives every session its own permanent sequence number
     ("Session #N", oldest = #1, ascending) plus a "Showing X of Y"
     line above the list — together these answer "how many classes'
     attendance has been filled so far" both as a total and per-row.
 38. Scores — same pattern as #37: ScoresSectionTab's header shows a
     running total ("N test(s) conducted so far"), and View & Search
     Scores gives every test its own permanent sequence number ("Test
     #N", oldest = #1) plus a "Showing X of Y" line.
 39. Add/Edit Batch modal (Teacher Management → Batch Schedule) — Batch
     Name now auto-fills from Class + Subject as either is picked
     (e.g. Class "12" + Subject "Physics" -> "12 Physics"; Class "JEE"
     + Subject "Mathematics" -> "JEE Mathematics", reusing the same
     classCodeForId() from #30 so a class stored as "Class 12" still
     auto-fills to "12 Physics" not "Class 12 Physics"). Auto-fill
     stops the moment the user types into Batch Name themselves (a
     small hint line explains this), and never overwrites an existing
     batch's saved name when opening it to edit — only applies to a
     genuinely untouched name, whether on a new batch or after
     clearing an existing one.

Changes made in this seventh update pass:
 40. View Attendance / View & Search Scores — the "#" row badge is now
     dynamic: it's the row's position within whatever is currently
     displayed (i.e. after search/class/subject/date filters, and —
     for a test's marks table — after the "Sort: Top Scorers" toggle),
     so it renumbers live as you filter/search/sort instead of showing
     a fixed lifetime session/test number. The fixed sessionNumberById
     / testNumberById lookups from update #37/#38 are removed — the
     "Showing X of Y" line and the header running totals (from #37/#38)
     are untouched and still reflect the true lifetime totals.
 41. Add/Edit Batch modal — Class and Subject now render above Batch
     Name (previously Batch Name was first). Pure reorder of the JSX —
     same fields, same state, same auto-fill-from-Class+Subject
     behavior from #39, nothing about how the form works changed.
 42. Batch Schedule (Teacher Management → Batch Schedule) gained a
     search box (matches batch name, class, subject, teacher/
     substitute name, or day) plus Class/Subject filter dropdowns —
     same Card/filter pattern used everywhere else in the app — a
     "Showing X of Y batches" line, and a dynamic "#" numbering column
     (position within the filtered list, same as #40) on the table.

Changes made in this eighth update pass:
 43. Recycle Bin (Trash / Restore) was fully re-laid-out — previously
     all 15 deleted-record categories (Students, Receipts, Charges,
     Expenses, Bank Transactions, Credit/Loan Entries, Interest
     Payments, Attendance Records, Test Scores, Behaviour Notes,
     Teachers, Staff, Salary Payments, Advances, Advance Returns) were
     stacked one after another, always fully open — a long scroll even
     when most were empty. It's now the same bordered pill-row +
     single-panel pattern used everywhere else in the app (Academic
     Monitoring, Structure, Batch Schedule): one category active at a
     time, its table fills the panel below. Each pill shows a live
     count badge, e.g. "Receipts (3)"; empty categories stay visible
     (not hidden) but greyed out so it's obvious at a glance what has
     nothing in it. Opening the tab defaults to the first category
     that actually has something in it (falls back to Students if the
     whole bin is empty) rather than always landing on a possibly-empty
     first pill. Added a search box scoped to whichever category is
     active (matches name/ID/description-ish fields relevant to that
     record type — never amounts or dates, which already have their
     own columns), plus a total-items-in-bin count in the intro line.
     New TRASH_CATEGORIES config array drives the pill row; every
     category's actual data (all trashed*/onRestore*/onDelete* props),
     every table's columns, and every Restore/Delete Permanently button
     are exactly what they were before — this is a pure re-layout, no
     restore/delete behavior changed and TrashTab's own prop signature
     (and therefore its call site) is untouched.

Changes made in this ninth update pass:
 44. Recycle Bin's category pill row (#43) — fixed two visual bugs seen
     in production: (a) the row was one bordered strip with internal
     left-border dividers between pills, which broke apart into an
     orphan box with a stray border whenever it wrapped to a new line
     (visible with 15 categories on a normal-width screen); and (b)
     the "empty category" text/icon color (#B8AF95) was so washed out
     that on a fresh install — where every category is empty — the
     entire row looked disabled/unreadable. Replaced with individual
     chip buttons (each with its own border + rounded corners, so
     wrapping is always clean) and swapped the empty-category color for
     #9C8F6E, the same muted tone already used for secondary text
     everywhere else in the app, so it stays legible. Icons follow the
     same color automatically (lucide icons use currentColor) — no
     separate icon-color fix needed. Non-empty / active states, the
     count badges, and everything else about how the pill row behaves
     are unchanged.

Changes made in this tenth update pass:
 45. Teachers — added a dedicated Deactivate / Reactivate action
     (separate "Status History" panel on the teacher's expanded row,
     Option 1 from discussion) replacing the old plain Status dropdown
     in the Add/Edit Teacher form, which recorded neither a date nor a
     reason. Every transition now requires a date + remarks (new
     TeacherStatusModal) and is appended to a new `statusLog` array on
     the teacher doc (same append-only pattern as `salaryHistory`), so
     full activation history is preserved. New changeTeacherStatus()
     function; Performance (TeacherPerformanceTab) is completely
     untouched, exactly as planned.
 46. Dashboard gained an "Institute Snapshot" row (Overview → Institute
     Snapshot → Financial Health) with a Month/Year toggle: Institute
     Attendance % and Institute Avg Score % (derived from
     attendanceLog/tests — the same batch-wise collections Performance
     Report was just repointed at), plus Active Teachers and Active
     Staff counts. Purely additive; nothing else on the Dashboard
     changed.
 47. Settings — new "Settings" button just above "Lock Portal" opens a
     Institute Info form (Name, Tagline, Address, Phone, GST/
     Registration Number — text only per decision, logo deferred until
     Firebase Storage is confirmed set up). Backed by a new
     settings/institute Firestore doc, same live-sync pattern as
     classList/subjectList/streamList. Bigger win found while
     implementing: all 12 printed documents (receipts, slips,
     statements, the joining form) had "COACHING CLASSES" hardcoded as
     a duplicated literal — replaced with one shared InstituteHeader
     component (fed via InstituteSettingsContext) so setting the
     institute name here now updates every printout at once. Falls
     back to the same "COACHING CLASSES" placeholder text until
     Settings is filled in, so nothing looks broken pre-setup. The
     app's own product branding ("InstituteOS" in the sidebar) is
     untouched — this only governs the institute's own identity shown
     on documents.
 48. Add/Edit Batch modal gained a Room Number field (free text, per
     decision — Infrastructure Management's own room names are meant
     to be kept consistent with what's typed here, upgradeable to a
     dropdown later). Shown as a new "Room" column in the Batch
     Schedule table and included in its search.
 49. New "Infrastructure Management" sub-tab in Institute Management,
     right after "Advance" — a campus rooms/areas registry (Name,
     Category from the specified list, Capacity, Floor/Location,
     Remarks) with the same search/filter/numbering pattern as Batch
     Schedule (#42). New `infrastructure` Firestore collection, same
     simple upsert/hard-delete as tests/attendanceLog (no Trash
     support, same rationale as those two).
 50. Banking reorganization (per direct request): "Expenses Log" is no
     longer its own sidebar tab — it's now a Banking sub-tab, right
     after "Banking Statement". Salary, Advance, and Deposits Log are
     now ALSO reachable inside Banking (right before "Cash ⇄ Bank
     Transfer Logs"), alongside their original tabs in Student
     Management / Institute Management — true reuse, not a duplicate:
     depositsTabProps/expensesTabProps/salaryTabProps/advanceTabProps
     were pulled out into local consts (computed once) so both
     locations render the exact same component with the exact same
     data/handlers. Nothing about how any of the four behave changed.

Changes made in this eleventh update pass:
 51. Performance reorganization (per direct request): Institute
     Management's "Performance" sub-tab (TeacherPerformanceTab) is
     removed from there — Institute Management no longer has a
     Performance entry, its intro line updated to point at the new
     location. Academic Monitoring's "Performance Report" sub-tab is
     renamed "Performance" (id kept as "report") and now hosts its own
     inner pill row (new PerformanceSectionTab, same pattern as
     AttendanceSectionTab/ScoresSectionTab) with three panels in this
     order: "Performance Report" (the exact same PerformanceReportTab,
     individual student view, completely unchanged), "Teachers
     Performance" (the exact same TeacherPerformanceTab moved from
     Institute Management — same component, same props object, just
     relocated, nothing about its calculation changed), and "Institute
     Performance" (new — see #52). teacherPerformanceTabProps is
     passed into AcademicMonitoringTab now instead of
     TeacherManagementTab; same object shape as before.
 52. New Institute Performance tab (new InstitutePerformanceTab) —
     overall attendance % and average test score % across the whole
     institute, with its own Month/Year toggle (independent of the
     Dashboard's), plus a By Class and By Subject breakdown table
     (attendance %, avg score %, sessions held, tests conducted per
     group). Same attendanceLog/tests-derived calculation approach as
     the Dashboard's Institute Snapshot tiles (#46), just with its own
     period control and per-class/subject detail those tiles don't
     have room for.

Changes made in this twelfth update pass:
 53. BUGFIX — Add Room / Area (Infrastructure Management): clicking "Add
     to Registry" repeatedly created duplicate entries with identical
     data. Cause: saveInfrastructure() never closed the modal after
     saving (every other Add-form's save function does this —
     saveBatchScheduleEntry, saveTeacher, etc. — this one was missed).
     With the modal left open, a repeated/double click called onSave
     again while `data.id` was still undefined, so a fresh uid() ran
     each time and wrote a second doc. Fixed by closing the modal on
     save, matching the established convention, plus a `submitting`
     guard directly in InfrastructureFormModal as defense-in-depth
     against a fast double-click landing before the modal visually
     closes.
 54. Add/Edit Batch → Room Number now autocompletes from Infrastructure
     Management's registry (via a <datalist>, so free text still works
     if nothing's registered yet — this doesn't block saving a batch)
     and shows a live indicator right under the field: a green match
     confirmation naming the matched room + category if what's typed
     matches a registered room exactly (case-insensitive), an amber
     "no matching room found" warning if it doesn't match any
     registered room, or a neutral hint to go register rooms if
     Infrastructure Management is still empty. BatchScheduleFormModal
     now receives the `infrastructure` list as a prop for this.
 55. Banking's sub-tab row (8 tabs: Statement, Expenses, Salary,
     Advance, Deposits Log, Transfer Logs, Credit & Loan Ledger,
     Interest Payments Log) used the single-bordered-strip-with-
     internal-dividers pattern, which breaks apart into a stray-
     bordered orphan box whenever it wraps to a new line — the exact
     same visual bug already found and fixed on Recycle Bin's category
     row. Replaced with the same fix: individual chip buttons, each
     with its own border and rounded corners, so wrapping at any width
     stays clean. Sub-tab order/behavior is unchanged.

Changes made in this thirteenth update pass:
 56. Rebrand — app product name changed from "Batch Ledger Pro" to
     "InstituteOS" (login screen + sidebar header), tagline changed
     from "Coaching Register" to "Institute Operating System" (settled
     on after a couple of revisions — briefly "The Complete Institute,
     in One Place," which was too long for the sidebar strip). This is
     purely the app's own product branding — separate from Settings'
     Institute Name/Tagline (#47), which is the institute's own
     identity shown on printed documents and is untouched by this. The
     underlying component/function name (`CoachingLedger`) and this
     file's name are left as-is, since renaming those would require
     touching whatever file imports this component (App.js or
     similar), which isn't in view here — purely cosmetic/internal,
     doesn't affect what's shown on screen.

Changes made in this fourteenth update pass:
 57. BUGFIX — Institute Performance's Month/Year toggle (and, found
     proactively while fixing it, the identical toggle on Dashboard's
     Institute Snapshot) used the single-bordered-strip-with-internal-
     divider pattern already found buggy twice before (Recycle Bin,
     Banking) — visually breaking when toggled, likely because the
     button label width swings a lot between the two states (e.g.
     "August 2026" vs "2026", or a full month name vs a bare year),
     which reflows the shared border oddly. Both replaced with
     individual chip buttons (own border + rounded corners each), the
     same fix already applied elsewhere.
 58. Settings is now a tabbed modal (new SETTINGS_SUB_TABS config, one
     entry today — "Institute Information" — with the same chip-button
     row pattern from #57, ready for more categories later without a
     redesign). Institute Information's single "Phone" field is split
     into separate "Mobile Number" and "Telephone Number" fields, as
     requested — DEFAULT_INSTITUTE_SETTINGS and InstituteHeader (the
     shared print-header component from #47) both updated to match;
     printed documents now show "M: ... · T: ..." instead of one
     generic phone line. Existing settings docs with the old `phone`
     field just show blank Mobile/Telephone until re-saved — nothing
     crashes, no data was deleted.

Changes made in this fifteenth update pass:
 59. Institute Performance's period control reordered: the date/value
     box (Month picker or Year number input) now comes first, then the
     Month button, then the Year button — so the two buttons (fixed-
     width, always "Month"/"Year") never shift position when their
     sibling's width changes a lot between modes, instead of the
     buttons leading. Also made the Year box directly editable (a
     number input) instead of a read-only badge — previously the only
     way to change year was to switch to Month mode and pick a
     different month.
 60. BUGFIX — found the real, systemic cause of "documents don't look
     professional": 8 of the 12 printable documents (Salary Slip, Fee
     Receipt, Bank Transaction Slip, Credit Slip, Interest Payment
     Slip, Expense Receipt, Charge Receipt — the "receipt-style" ones)
     use Tailwind utility classes in their JSX, but their print popup
     never loaded the Tailwind CDN script — only 4 of the 12
     (Performance Report, Center Statement, Banking Statement, Student
     Statement) did. That means on those 8, essentially all layout/
     spacing/border/color styling was silently doing nothing in print;
     only inline `style` attributes survived, everything else fell
     back to unstyled browser defaults. All 8 now load the same
     Tailwind CDN + Google Fonts (FONT_IMPORT) the other 4 already
     used, so what prints now actually matches what's shown on screen.
 61. All 12 printable documents now explicitly set `@page { size: A4;
     margin: ...; }` with NO landscape orientation anywhere — per
     request, everything prints portrait. Center Statement and Banking
     Statement were the two previously set to A4 landscape (their
     tables have 8-11 columns); converted to portrait with print-only
     compaction (smaller font, tighter cell padding, forced text
     wrapping instead of nowrap) added specifically inside the print
     popup's stylesheet so the wide tables still fit and stay legible
     — the on-screen Card preview in the app itself is completely
     untouched by this, only the separate print popup document changed.
 62. Joining Form and Performance Report gained the same Google Fonts
     import (FONT_IMPORT) the other documents already had — previously
     requesting 'Zilla Slab'/'Inter' via inline styles but never
     loading them, so they silently fell back to generic system fonts
     in print. Also replaced hardcoded "Coaching Classes" text in both
     documents' footers with the real institute name from Settings
     (#47/#58) via InstituteSettingsContext, matching every other
     document's letterhead, which already used it.

Admin Access Password