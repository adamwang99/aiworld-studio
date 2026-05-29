# UI Wireframe v0 — AI World Studio

## Layout model
- 1 cột dọc, mobile-first
- Dark aurora background
- Glass cards nổi trên nền tối
- Progressive disclosure qua `<details>`

## Screen: Main workspace

```text
┌──────────────────────────────────────┐
│ AI World Studio                      │
│ Project: [Current Project]   [State] │
├──────────────────────────────────────┤
│ [Transcript] [Subtitle] [Translate]  │
│ [Voice] [Outputs] [Settings]         │
├──────────────────────────────────────┤
│ Glass Card: Input                    │
│ - Drop audio/video/text              │
│ - Source language                    │
│ - Action button                      │
├──────────────────────────────────────┤
│ Glass Card: Queue / Runtime          │
│ - Job list                           │
│ - status-pill                        │
│ - progress                           │
├──────────────────────────────────────┤
│ Glass Card: Preview                  │
│ - transcript preview                 │
│ - subtitle preview                   │
│ - audio preview                      │
├──────────────────────────────────────┤
│ <details> Advanced                   │
│ - engine select                      │
│ - alignment options                  │
│ - translation controls               │
│ - TTS voice settings                 │
│ </details>                           │
├──────────────────────────────────────┤
│ <details> Logs                       │
│ - processing logs                    │
│ - retry info                         │
│ </details>                           │
└──────────────────────────────────────┘
```

## Visual rules
- Card radius: 24px
- Modal radius: 18px
- Input/button radius: 14px
- Pill radius: 999px
- Primary button: gradient tím → cyan
- Hover: nhấc nhẹ
- Focus: cyan ring

## Status colors
- idle → trắng mờ
- running → cyan
- blocked → hồng/đỏ
- recovered → vàng
- ready_to_finalize → tím

## Component priority
1. Dropzone
2. Runtime queue
3. Preview panel
4. Subtitle/timeline list
5. Audio preview
6. Export actions
7. Advanced collapsible controls
