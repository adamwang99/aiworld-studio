# Build status v0 — AI World Studio

## Current migration state
- Electron path removed in favor of Tauri (electron/ deleted)
- Frontend React app retained
- Tauri shell wired with real app icons
- GitHub Actions cross-platform build prepared

## Verified locally on current host (Linux x86_64, Ubuntu 22.04)
- Rust toolchain installed: `rustc 1.96.0`, `cargo 1.96.0`
- Frontend build OK: `npm run build` → 151 KB JS (48 KB gzip), 6.4 KB CSS
- Native Tauri build OK: `npm run tauri:build`
- All Linux bundles produced and verified:
  - `.deb` — 3.0 MB
  - `.rpm` — 3.0 MB
  - `.AppImage` — 78 MB (self-contained, bundles GTK/WebKit libs)
- Raw binary: 11 MB, all dynamic libs resolve, GTK backend initializes
  (headless smoke test stops only at no-display, which is expected on a server)

## Size comparison vs Electron
- Tauri `.deb`/`.rpm` installers: ~3 MB each
- Tauri raw binary: ~11 MB
- Equivalent Electron app: typically 80–150 MB
- AppImage is larger (78 MB) only because it inlines the full GTK/WebKit
  runtime for distro-independent execution; native installers stay ~3 MB.

## Build notes / gotchas resolved
- `tauri.conf.json` `bundle.icon` was empty `[]` → AppImage bundler aborted
  with "couldn't find a square icon". Fixed by referencing real icons in
  `src-tauri/icons/` (32/64/128/128@2x png + icon.png/icns/ico).
- AppImage step downloads helper tools from GitHub at bundle time
  (`linuxdeploy`, `linuxdeploy-plugin-gtk`, `-gstreamer`, `-appimage`).
  Transient network timeouts can fail this step; the tools are cached under
  `~/.cache/tauri/` and CI runners have stable network so this is CI-safe.

## Cross-platform path (macOS + Windows)
Native macOS `.dmg`/`.app` and Windows `.msi`/`.exe` require their own OS to
build (codesigning + platform bundlers), so they are produced by CI.

Workflow file: `.github/workflows/build-tauri.yml`
Matrix: `ubuntu-22.04`, `windows-latest`, `macos-latest`
Trigger: push to `main` or manual `workflow_dispatch`.

## Expected CI outcome
After the workflow runs on `main`:
- native artifact for macOS (`.dmg` / `.app`)
- native artifact for Windows (`.msi` / `.exe`)
- native artifact for Linux (`.deb` / `.rpm` / `.AppImage`)
- package size dramatically lower than Electron for the installers
