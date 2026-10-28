#!/usr/bin/env bash
# benchmark.sh -- Performance benchmark suite for the Knowledge Base application.
#
# Measures import throughput, indexing speed, query latency, and data integrity
# by exercising the REAL services layer (src/services: PersistenceService,
# DocumentService, IndexingService, QaService). No Electron is needed.
#
# How it works:
#   1. Compiles src/ with the project's TypeScript compiler into a temp dir.
#   2. Runs scripts/benchmark-runner.js against a throwaway data directory,
#      importing data/sample-documents/*.
#
# What it does NOT measure: the Electron UI/IPC layer, or real LLM latency
# (QaService is a mock that sleeps 100-500ms per question by design).
#
# Requires: `npm install` already run (needs node_modules/.bin/tsc and uuid).
# Usage:    bash scripts/benchmark.sh
# Exit:     0 if every task passes; non-zero on any failure or error.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SAMPLE_DIR="$ROOT/data/sample-documents"
TSC="$ROOT/node_modules/.bin/tsc"

if [ ! -x "$TSC" ] || [ ! -d "$ROOT/node_modules/uuid" ]; then
  echo "ERROR: dependencies missing. Run 'npm install' in $ROOT first." >&2
  exit 1
fi
if [ ! -d "$SAMPLE_DIR" ]; then
  echo "ERROR: sample data directory not found: $SAMPLE_DIR" >&2
  exit 1
fi

BENCH_DIR=$(mktemp -d)
trap 'rm -rf "$BENCH_DIR"' EXIT

echo "=== Knowledge Base Benchmark Suite (real services) ==="
echo ""
echo "Working directory: $BENCH_DIR"
echo "Sample data: $SAMPLE_DIR"
echo ""

echo "Compiling services..."
"$TSC" -p "$ROOT/tsconfig.node.json" \
  --outDir "$BENCH_DIR/build" \
  --declaration false --declarationMap false --sourceMap false
echo ""

# Quiet the structured logger so benchmark output stays readable; errors still print.
LOG_LEVEL=ERROR NODE_PATH="$ROOT/node_modules" \
  node "$ROOT/scripts/benchmark-runner.js" \
    "$BENCH_DIR/build" "$SAMPLE_DIR" "$BENCH_DIR/data"
status=$?

# Not reached on failure (set -e), but keep the verdict explicit.
echo ""
if [ "$status" -eq 0 ]; then
  echo "ALL BENCHMARKS PASSED"
fi
exit "$status"
