# AI World Studio

Unified AI workspace for transcription, translation, subtitles, voice, and media-content production.

## Vision
AI World Studio là ứng dụng điều phối workflow media/content AI trong 1 giao diện thống nhất. Mục tiêu: biến audio/video thô thành transcript, subtitle, bản dịch, voice output, và gói output sẵn dùng mà không phải ghép nhiều tool thủ công.

## Product direction
- UI style: Glassmorphism dark, aurora background, accent tím–cyan
- Operator-first workflow
- Modular architecture
- Tách UI / orchestration / media engines
- Dùng nội bộ trước, sản phẩm hóa sau
- Desktop-first packaging qua Electron

## Planned MVP
- Project workspace
- Transcription
- Subtitle generation
- Translation layer
- Voice / TTS
- Job queue + status
- Output manager

## Repository structure
```text
apps/web             # frontend app
packages/ui          # design system + shared components
packages/core        # shared business logic
packages/agents      # orchestration / agent workflows
packages/media       # transcript / subtitle / tts / translation helpers
electron             # desktop shell
docs/product         # PRD, scope, roadmap
docs/architecture    # system design, ADRs
docs/decisions       # decision logs
public               # static assets
```

## Development
```bash
npm install
npm run dev
npm run desktop:dev
```

## Build
```bash
npm run build
npm run pack
npm run dist
```

## Cross-platform targets
- macOS: `dmg`, `zip`
- Windows: `nsis`, `portable`
- Linux: `AppImage`, `deb`, `tar.gz`

GitHub Actions workflow: `.github/workflows/build-desktop.yml`

## Current status
- Workspace scaffold initialized
- UI shell v2 implemented
- Electron shell added
- Linux unpacked desktop build verified
