# Clean State Checklist

Run this checklist before committing and at the end of each session.

**Verification status**: 41 items total. Items marked `[x]` were verified by running the
named command (`npm run check`, `npm run build` via `init.sh`, `bash init.sh`,
`bash scripts/check-architecture.sh`, `bash scripts/benchmark.sh`) in a clean copy of this
directory (the cleanup scanner was run on a freshly generated data dir). Unchecked items were NOT verified (they need the running Electron app, git state,
or manual review) and must be checked by whoever performs the next session.

## Build

- [x] `npm run check` passes with no type errors
- [x] `npm run build` completes successfully
- [ ] No TypeScript warnings about unused variables or imports

## Architecture

- [x] No `fs` or `path` imports in renderer code (`src/renderer/`) (scripts/check-architecture.sh)
- [x] No Electron IPC in service code (`src/services/`) (scripts/check-architecture.sh)
- [x] No React imports in services or main process (scripts/check-architecture.sh)
- [ ] All IPC channels defined in `src/shared/types.ts`
- [ ] All new APIs exposed in `src/preload/preload.ts`

## Runtime

- [ ] Application starts without errors (`npm run dev`)
- [ ] Structured JSON log output appears in console at startup
- [ ] Document import works (check logs for "Document imported" event)
- [ ] Batch indexing works (check logs for "Batch indexing complete" event)
- [ ] Q&A returns answers with citations (check logs for "Answer generated" event)
- [ ] Conversation history displays in chat-style layout
- [ ] Feedback buttons appear on Q&A responses
- [ ] Reset button clears all data with confirmation dialog
- [ ] Status bar shows correct document count and index status

## Logging

- [x] All log entries are valid JSON (parseable) (services layer only, via benchmark runner at LOG_LEVEL=DEBUG; main.ts/IPC logs not exercised)
- [x] Log entries include timestamp, level, service, and message (services layer only)
- [x] Document import emits INFO log with documentId, filename, size (message: "Document imported successfully", field sizeBytes)
- [x] Indexing emits INFO log with chunkCount, durationMs (chunkCount on "Document indexed in batch"; durationMs on "Batch indexing complete")
- [x] Q&A emits INFO log with confidence, citationCount, durationMs
- [ ] IPC handlers log channel invocations

## Data Integrity

- [x] No empty chunks in indexed documents (verify with GET_CHUNKS) (checked via IndexingService.getAllChunks() in benchmark, not via the IPC channel)
- [ ] Q&A history persists across restarts
- [ ] Feedback entries persist across restarts
- [ ] Document metadata is consistent with actual files
- [ ] Clean state reset removes all data files

## Performance

- [x] `bash scripts/benchmark.sh` runs without errors
- [x] Import throughput is reasonable (3 files under 1 second) (~3ms measured)
- [x] Indexing completes for sample data (under 1 second) (~2ms measured)
- [x] Query latency is under 1 second per question (max ~490ms measured; includes the mock's 100-500ms delay)

## Repository

- [ ] No unintended files in git status
- [ ] No sensitive data (.env, credentials) staged
- [ ] No files in `dist/` committed
- [ ] `claude-progress.md` updated with current state
- [ ] `feature_list.json` reflects actual feature status
- [ ] `session-handoff.md` updated if session is ending

## Scripts

- [x] `bash scripts/cleanup-scanner.sh` reports no stale artifacts (run against a freshly generated data dir with 3 imported/indexed docs and 1 Q&A, not a live app data dir)
- [x] `bash scripts/benchmark.sh` completes the full task suite (4/4 tasks)
- [x] `bash init.sh` passes all verification steps
