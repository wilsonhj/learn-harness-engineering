#!/usr/bin/env node
/**
 * benchmark-runner.js -- real-services benchmark driver, invoked by benchmark.sh.
 *
 * Loads the *compiled* services (PersistenceService, DocumentService,
 * IndexingService, QaService) from <compiled-dir>, points them at a throwaway
 * data directory, and times import, indexing, query, and integrity checks.
 * No Electron is involved: the services layer has no Electron dependency.
 *
 * Usage: node benchmark-runner.js <compiled-services-dir> <sample-dir> <data-dir>
 * Exit code: 0 if every task passes, 1 otherwise. Any thrown error is fatal.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const [compiledDir, sampleDir, dataDir] = process.argv.slice(2);
if (!compiledDir || !sampleDir || !dataDir) {
  console.error('usage: benchmark-runner.js <compiled-services-dir> <sample-dir> <data-dir>');
  process.exit(2);
}

const { PersistenceService } = require(path.join(compiledDir, 'services', 'persistence-service'));
const { DocumentService } = require(path.join(compiledDir, 'services', 'document-service'));
const { IndexingService } = require(path.join(compiledDir, 'services', 'indexing-service'));
const { QaService } = require(path.join(compiledDir, 'services', 'qa-service'));

const EXPECTED_FILES = ['design-notes.md', 'meeting-summary.txt', 'retrieval-plan.md'];
const QUERIES = [
  'What is the system architecture?',
  'How does document import work?',
  'Explain the indexing pipeline',
  'What was discussed in the meeting?',
  'How does logging work?',
];

const results = [];
const nowMs = () => Number(process.hrtime.bigint()) / 1e6;
const fmt = (ms) => ms.toFixed(1);

function record(name, ok, detail) {
  results.push({ name, ok });
  console.log(`  ${ok ? 'PASS' : 'FAIL'}: ${detail}`);
}

async function main() {
  const persistence = new PersistenceService(dataDir);
  const documents = new DocumentService(persistence);
  const indexing = new IndexingService(persistence);
  const qa = new QaService(persistence, indexing);

  const sampleFiles = fs
    .readdirSync(sampleDir)
    .filter((f) => fs.statSync(path.join(sampleDir, f)).isFile())
    .sort();

  // ---- [1/4] Import ----
  console.log('[1/4] Import Benchmark (DocumentService.importDocument)');
  let t0 = nowMs();
  const imported = [];
  for (const f of sampleFiles) {
    const doc = documents.importDocument(path.join(sampleDir, f));
    imported.push(doc);
    console.log(`  Imported: ${doc.filename} (${doc.size} bytes)`);
  }
  const importMs = nowMs() - t0;
  record(
    'import',
    imported.length >= EXPECTED_FILES.length && documents.listDocuments().length === imported.length,
    `${imported.length} files imported in ${fmt(importMs)}ms (listDocuments=${documents.listDocuments().length})`
  );
  console.log('');

  // ---- [2/4] Indexing ----
  console.log('[2/4] Indexing Benchmark (IndexingService.startIndexing)');
  t0 = nowMs();
  const status = await indexing.startIndexing();
  const indexMs = nowMs() - t0;
  const chunks = indexing.getAllChunks();
  const emptyChunks = chunks.filter((c) => !c.content || c.content.trim().length === 0).length;
  for (const doc of documents.listDocuments()) {
    console.log(`  ${doc.filename}: status=${doc.status} chunks=${doc.chunks ?? 0}`);
  }
  record(
    'index',
    status.status === 'ready' && chunks.length >= 5 && emptyChunks === 0,
    `${chunks.length} chunks (${emptyChunks} empty) in ${fmt(indexMs)}ms, status=${status.status}`
  );
  console.log('');

  // ---- [3/4] Query ----
  console.log('[3/4] Query Benchmark (QaService.ask; includes its simulated 100-500ms delay)');
  let answered = 0;
  let cited = 0;
  t0 = nowMs();
  for (const q of QUERIES) {
    const qs = nowMs();
    const resp = await qa.ask(q);
    const ms = nowMs() - qs;
    if (resp && typeof resp.answer === 'string' && resp.answer.length > 0) answered++;
    if (resp && resp.citations.length > 0) cited++;
    console.log(`  Query: "${q}" -> ${resp.citations.length} citations, confidence ${resp.confidence}, ${fmt(ms)}ms`);
  }
  const queryMs = nowMs() - t0;
  const historyLen = qa.getHistory().length;
  record(
    'query',
    answered === QUERIES.length && cited === QUERIES.length && historyLen === QUERIES.length,
    `${answered}/${QUERIES.length} answered, ${cited}/${QUERIES.length} with citations, history=${historyLen}, ` +
      `${fmt(queryMs)}ms total (${fmt(queryMs / QUERIES.length)}ms avg)`
  );
  console.log('');

  // ---- [4/4] Integrity ----
  console.log('[4/4] Data Integrity Verification');
  const problems = [];
  for (const name of EXPECTED_FILES) {
    const doc = imported.find((d) => d.filename === name);
    if (!doc) {
      problems.push(`missing imported document: ${name}`);
      continue;
    }
    const original = fs.readFileSync(path.join(sampleDir, name), 'utf-8');
    const stored = documents.getDocumentContent(doc.id);
    if (stored !== original) problems.push(`stored content differs from source: ${name}`);
    if (!fs.existsSync(path.join(persistence.getDocumentsDir(), name))) {
      problems.push(`copied file missing in documents dir: ${name}`);
    }
  }
  persistence.resetAll();
  if (documents.listDocuments().length !== 0) problems.push('listDocuments not empty after resetAll');
  if (indexing.getAllChunks().length !== 0) problems.push('chunks remain after resetAll');
  for (const p of problems) console.log(`  FAIL: ${p}`);
  record('verify', problems.length === 0, 'content round-trip, copied files, and resetAll verified');
  console.log('');

  const passed = results.filter((r) => r.ok).length;
  console.log('=== Benchmark Results (real services) ===');
  console.log(`Import: ${imported.length} files in ${fmt(importMs)}ms`);
  console.log(`Index:  ${chunks.length} chunks in ${fmt(indexMs)}ms`);
  console.log(`Query:  ${QUERIES.length} queries in ${fmt(queryMs)}ms`);
  console.log(`Tasks passed: ${passed}/${results.length}`);
  process.exit(passed === results.length && results.length === 4 ? 0 : 1);
}

main().catch((err) => {
  console.error('BENCHMARK ERROR:', err && err.stack ? err.stack : err);
  process.exit(1);
});
