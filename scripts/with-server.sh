#!/bin/bash
# usage: scripts/with-server.sh <command...>  — serves dist/ on :4173 while the command runs
cd "$(dirname "$0")/.."
npx vite preview --port 4173 --host 127.0.0.1 >/tmp/preview.log 2>&1 & PID=$!
for i in $(seq 1 20); do curl -s -o /dev/null http://127.0.0.1:4173/ && break; sleep 0.3; done
"$@"; RC=$?; kill $PID 2>/dev/null; exit $RC
