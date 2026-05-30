export type ProjectStatus = 'done' | 'processing' | 'draft';

export const projects: {
  title: string;
  type: string;
  status: ProjectStatus;
  progress: number;
  updated: string;
  duration: string;
  accent: string;
}[] = [
  {
    title: 'Podcast EP12 — Localization',
    type: 'Lồng tiếng đa ngôn ngữ',
    status: 'processing',
    progress: 42,
    updated: '2 phút trước',
    duration: '48:20',
    accent: '#6366f1',
  },
  {
    title: 'Bản tin tối — Phụ đề',
    type: 'Phụ đề SRT',
    status: 'done',
    progress: 100,
    updated: 'Hôm nay 09:15',
    duration: '12:04',
    accent: '#10b981',
  },
  {
    title: 'Phỏng vấn CEO (KR → VI)',
    type: 'Dịch & lồng tiếng',
    status: 'draft',
    progress: 0,
    updated: 'Hôm qua',
    duration: '26:51',
    accent: '#f59e0b',
  },
  {
    title: 'Quảng cáo sản phẩm Q2',
    type: 'Voiceover',
    status: 'done',
    progress: 100,
    updated: '2 ngày trước',
    duration: '00:45',
    accent: '#ec4899',
  },
];

export const workflows: {
  key: string;
  title: string;
  desc: string;
  badge: string;
  color: string;
}[] = [
  {
    key: 'transcribe',
    title: 'Chuyển giọng nói thành văn bản',
    desc: 'Tải audio hoặc video lên, nhận bản ghi chính xác trong vài phút.',
    badge: 'Phổ biến',
    color: '#6366f1',
  },
  {
    key: 'subtitle',
    title: 'Tạo phụ đề tự động',
    desc: 'Sinh phụ đề chuẩn timing, xuất SRT/VTT sẵn dùng.',
    badge: '',
    color: '#10b981',
  },
  {
    key: 'translate',
    title: 'Dịch sang ngôn ngữ khác',
    desc: 'Dịch nội dung sang Anh, Hàn, Nhật, Trung và ngược lại.',
    badge: '',
    color: '#f59e0b',
  },
  {
    key: 'voice',
    title: 'Lồng tiếng AI',
    desc: 'Biến văn bản thành giọng nói tự nhiên, nhiều chất giọng.',
    badge: 'Mới',
    color: '#ec4899',
  },
];

export const stats: { label: string; value: string; trend: string; up: boolean }[] = [
  { label: 'Dự án tháng này', value: '24', trend: '+12%', up: true },
  { label: 'Phút đã xử lý', value: '1.842', trend: '+8%', up: true },
  { label: 'Thời gian tiết kiệm', value: '36h', trend: '+21%', up: true },
];

export const navItems: { key: string; label: string }[] = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'projects', label: 'Dự án' },
  { key: 'transcribe', label: 'Ghi âm → Văn bản' },
  { key: 'subtitle', label: 'Phụ đề' },
  { key: 'translate', label: 'Dịch thuật' },
  { key: 'voice', label: 'Lồng tiếng' },
  { key: 'library', label: 'Thư viện' },
];
