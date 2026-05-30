# AI World Studio — Brand Assets

Thư mục source-of-truth cho logo và nhận diện AI World Studio. File gốc là **SVG vector** (edit lại + xuất mọi kích thước không vỡ nét).

## File gốc (canonical)

| File | Mô tả |
|---|---|
| `logo.svg` | Logo chính (vector gốc) — lục giác kính + sóng âm đan xuyên vòng quỹ đạo |
| `logo-mark.svg` | Bản rút gọn (3 thanh sóng, viền đơn) — dùng cho cỡ nhỏ / favicon |
| `logo-1024.png` | Bản raster master 1024×1024, nền trong suốt |
| `icons/logo-512..32.png` | App icon / hero / README, nền trong suốt |
| `icons/favicon-64..16.png` | Favicon trình duyệt (xuất từ `logo-mark.svg`) |

> Mọi PNG có **nền trong suốt** (RGBA) — dùng đẹp trên cả nền tối lẫn sáng.

## Bảng màu (đồng bộ với app — `apps/web/src/styles.css`)

| Vai trò | Hex |
|---|---|
| Indigo (gốc gradient) | `#6366f1` |
| Violet (accent chính) | `#9f8cff` |
| Cyan (accent phụ / glow) | `#67ddff` |
| Pink (cuối gradient) | `#ec4899` |
| Pink-soft (glow) | `#ff8da1` |
| Nền tối app (navy) | `#0f1121` |

Gradient logo: indigo → violet → pink (chéo, góc ~45°). Viền glow: cyan → violet → pink-soft.

## Ý tưởng thiết kế

- **Lục giác kính (glassmorphism):** khối emblem chính, bo góc, bề mặt gradient.
- **Sóng âm trắng:** 7 thanh đối xứng (bản chính) / 3 thanh (bản mark) — đại diện media/audio/voice.
- **Vòng quỹ đạo:** nửa dưới đè trước, nửa trên ra sau sóng âm → tạo chiều sâu 3D, gợi "world".

## Regenerate (xuất lại các kích thước)

Cần `cairosvg` + `Pillow`:

```bash
cd brand
# master từ vector
cairosvg logo.svg -o logo-1024.png -W 1024 -H 1024

# bộ icon từ master (cairosvg bỏ qua -W/-H khi SVG có size cố định → resize bằng Pillow)
python3 - <<'PY'
from PIL import Image
m = Image.open('logo-1024.png').convert('RGBA')
for s in (512,256,192,128,64,48,32):
    m.resize((s,s), Image.LANCZOS).save(f'icons/logo-{s}.png', optimize=True)
PY

# favicon từ bản rút gọn
cairosvg logo-mark.svg -o /tmp/mark.png -W 512 -H 512
python3 - <<'PY'
from PIL import Image
m = Image.open('/tmp/mark.png').convert('RGBA')
for s in (64,48,32,16):
    m.resize((s,s), Image.LANCZOS).save(f'icons/favicon-{s}.png', optimize=True)
PY
```

## Lưu ý

- Sửa logo: chỉ sửa file `.svg` rồi regenerate, **không** chỉnh trực tiếp PNG.
- Để thay icon app desktop (Tauri), copy/convert sang `src-tauri/icons/` (cần `.ico` cho Windows, `.icns` cho macOS, PNG nhiều cỡ cho Linux).
- Ảnh trong `docs/images/` là bản dùng cho README/tài liệu, đồng bộ với bản gốc ở đây.
