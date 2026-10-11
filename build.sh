#!/usr/bin/env bash
set -euo pipefail

npx web-ext build   --overwrite-dest   --ignore-files   "test-page.html"   "CHANGELOG.md"   "screenshot.png"   "build.sh"   "package.json"   "package-lock.json"   ".github/**"
