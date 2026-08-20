#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

log() {
  printf '[build-mobile] %s\n' "$1"
}

ensure_next_export() {
  if [ ! -f "next.config.mjs" ]; then
    log "next.config.mjs not found. Creating a minimal static export config."
    cat <<'EOF' > /tmp/build-mobile-next-config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

export default nextConfig
EOF
    cp /tmp/build-mobile-next-config.mjs next.config.mjs
  elif ! grep -q "output:[[:space:]]*'export'\|output:[[:space:]]*\"export\"" next.config.mjs; then
    log "next.config.mjs exists but does not declare output: 'export'. Please update it manually before building."
    return 1
  fi
}

run_web_build() {
  log "Step 1/4: Web static export"
  ensure_next_export
  npm run build
  if [ -d "out" ]; then
    log "Static export generated at: $ROOT_DIR/out"
  else
    log "Build finished but /out was not generated"
    return 1
  fi
}

run_cap_sync() {
  log "Step 2/4: Capacitor sync"
  npx cap sync
}

run_android_builds() {
  log "Step 3/4: Android binary compilation"
  if [ ! -d "android" ]; then
    log "android directory is missing"
    return 1
  fi
  export GRADLE_OPTS="-Dorg.gradle.internal.http.connectionTimeout=120000 -Dorg.gradle.internal.http.socketTimeout=120000 ${GRADLE_OPTS:-}"
  cd "$ROOT_DIR/android"
  ./gradlew assembleDebug
  ./gradlew bundleRelease
  cd "$ROOT_DIR"
}

report_android_outputs() {
  log "Android artifact locations:"
  if [ -f "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    printf '%s\n' "$ROOT_DIR/android/app/build/outputs/apk/debug/app-debug.apk"
  else
    printf '%s\n' "APK not found"
  fi

  if [ -f "$ROOT_DIR/android/app/build/outputs/bundle/release/app-release.aab" ]; then
    printf '%s\n' "$ROOT_DIR/android/app/build/outputs/bundle/release/app-release.aab"
  else
    printf '%s\n' "AAB not found"
  fi
}

run_ios_step() {
  log "Step 4/4: iOS app archive"
  if [ -d "ios/App" ]; then
    log "Open in Xcode with: npx cap open ios"
    log "CLI archive example: xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -sdk iphoneos -archivePath ios/App/build/App.xcarchive archive"
  else
    log "ios directory is missing"
    return 1
  fi
}

main() {
  run_web_build
  run_cap_sync
  run_android_builds
  report_android_outputs
  run_ios_step
}

main "$@"
