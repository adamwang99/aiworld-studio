# Architecture Overview v0 — AI World Studio

## Layers
1. **UI layer** — React app, operator-first workspace
2. **Orchestration layer** — job intake, queue, state transitions
3. **Media engine layer** — transcript / alignment / translation / TTS adapters
4. **Storage layer** — project metadata, job metadata, generated outputs

## Core principles
- UI tách khỏi engine
- Engine thay được
- Job state rõ, reproducible
- Output gom theo project
- Ưu tiên local-first/internal-first trước khi scale product

## Initial module map
- `apps/web` → UI shell + interaction layer
- `packages/ui` → shared tokens/components
- `packages/core` → shared types/state/contracts
- `packages/agents` → orchestration workflows
- `packages/media` → engine wrappers/adapters

## Runtime states
- `idle`
- `queued`
- `running`
- `blocked`
- `recovered`
- `ready_to_finalize`
- `done`
- `failed`

## Near-term next build
- component extraction into `packages/ui`
- project/job types into `packages/core`
- mock service layer for UI wiring
- real engine adapter contracts after UI pass
