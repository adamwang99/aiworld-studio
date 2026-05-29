# PRD v0 — AI World Studio

## 1. Product name
**AI World Studio**

## 2. Problem
Workflow transcript, subtitle, translation, voice còn rời rạc. Người dùng phải ghép nhiều tool thủ công → chậm, lỗi, khó chuẩn hóa, khó đào tạo, khó sản phẩm hóa.

## 3. Goal
Tạo 1 ứng dụng operator-first để xử lý chuỗi:
**input media/text → transcript → translation → subtitle → voice → output package**

## 4. Target users
- Nội bộ AI World
- Operator content/video
- Biên tập viên cần output nhanh, chuẩn
- Sau này có thể mở rộng cho user ngoài

## 5. MVP scope
### Core modules
1. Projects
2. Transcription
3. Subtitle
4. Translation
5. Voice / TTS
6. Queue / status
7. Outputs

### Non-goals for MVP
- Billing
- Marketplace/plugin ecosystem
- Collaboration sâu nhiều vai trò
- Publish automation full-stack
- Quá nhiều engine cùng lúc

## 6. UX principles
- 1 giao diện thống nhất
- Tối ưu thao tác operator
- Trạng thái rõ, ít click thừa
- Advanced options mặc định ẩn
- Output tải được ngay

## 7. Design direction
- Glassmorphism dark
- Aurora gradients
- Accent tím `#9f8cff`
- Accent cyan `#67ddff`
- Text `#f8fbff`
- Danger `#ff8da1`
- Radius lớn, blur kính, glow mềm
- Status pill theo runtime state

## 8. Expected impact
- Giảm thời gian xử lý media
- Giảm thao tác tay
- Chuẩn hóa output
- Dễ chuyển thành SOP
- Tạo nền cho sản phẩm hóa

## 9. End-state vision
AI World Studio trở thành app trung tâm cho media/content automation của AI World: UI riêng, engine thay được, workflow rõ, dùng nội bộ mỗi ngày và có thể mở rộng thương mại sau này.
