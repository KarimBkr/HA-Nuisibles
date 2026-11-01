#!/usr/bin/env bash
# Builds the production export with the real Web3Forms key and copies it to deliverable/.
# Usage: NEXT_PUBLIC_WEB3FORMS_KEY=... bash tools/deliver.sh   (or put the key in .env.local)
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] && { set -a; . ./.env.local; set +a; }
KEY="${NEXT_PUBLIC_WEB3FORMS_KEY:-}"
if [ -z "$KEY" ] || [ "$KEY" = "check-placeholder-key" ]; then
  echo "deliver: NEXT_PUBLIC_WEB3FORMS_KEY is missing or a placeholder; the quote form would not send." >&2; exit 1
fi
export NEXT_TELEMETRY_DISABLED=1
npx next build --webpack
grep -rqF "$KEY" out/_next/static || { echo "deliver: the key is not in the built JS" >&2; exit 1; }
test -f out/.htaccess || { echo "deliver: out/.htaccess missing" >&2; exit 1; }
rm -rf deliverable && cp -R out deliverable
echo "deliver: deliverable/ ready ($(find deliverable -name index.html | wc -l | tr -d ' ') pages)"
