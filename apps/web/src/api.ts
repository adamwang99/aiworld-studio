// Real API client for AI World Studio.
// Talks to any OpenAI-compatible chat endpoint (9router, DS2API, OpenAI, etc).
// Settings persist in localStorage so the desktop app remembers them.

export type Settings = {
  endpoint: string; // e.g. http://192.168.1.9:6011/v1  or  https://api.openai.com/v1
  apiKey: string;
  model: string;
  asrEndpoint: string; // transcription service, e.g. http://192.168.1.9:6021
  asrMode: 'local' | 'api'; // 'local' = on-device WASM Whisper, 'api' = ASR server
  localModel: 'Xenova/whisper-tiny' | 'Xenova/whisper-base' | 'Xenova/whisper-small';
  ttsMode: 'local' | 'api'; // 'local' = OS speech synthesis, 'api' = OpenAI-compatible /audio/speech
  ttsEngine: TtsEngine; // which server engine preset is selected (only when ttsMode='api')
  ttsEndpoint: string; // base URL with /v1, e.g. https://api.openai.com/v1
  ttsApiKey: string;
  ttsModel: string; // e.g. tts-1, gpt-4o-mini-tts
  ttsVoice: string; // e.g. alloy, nova
};

// TTS engine presets. All speak the same OpenAI-compatible /audio/speech API
// (we wrap each engine behind that contract), so switching is just endpoint +
// voice + a hardware-requirement hint shown to the user.
export type TtsEngine = 'valtec' | 'piper' | 'vieneu' | 'omni' | 'custom';

export const TTS_ENGINES: {
  id: TtsEngine;
  label: string;
  endpoint: string;
  model: string;
  voice: string;
  quality: string;
  requirement: string;
}[] = [
  {
    id: 'valtec',
    label: 'Valtec (mặc định — giọng Việt tự nhiên)',
    endpoint: 'http://192.168.1.5:6025/v1',
    model: 'valtec',
    voice: 'vi',
    quality: 'Giọng tiếng Việt tự nhiên (VITS), 5 giọng Bắc/Nam nam-nữ',
    requirement: 'Chạy trên máy chủ nội bộ (không tốn tài nguyên máy bạn). Gần thời gian thực, không cần GPU.',
  },
  {
    id: 'piper',
    label: 'Piper (nhẹ + nhanh nhất)',
    endpoint: 'http://192.168.1.5:6022/v1',
    model: 'tts-1',
    voice: 'vi',
    quality: 'Giọng cơ bản, rõ ràng — nhanh nhất',
    requirement: 'Siêu nhẹ, nhanh hơn thời gian thực. Chọn khi ưu tiên tốc độ.',
  },
  {
    id: 'vieneu',
    label: 'VieNeu-TTS-v2 (giọng tự nhiên + voice clone)',
    endpoint: 'http://192.168.1.5:6023/v1',
    model: 'vieneu',
    voice: 'vi',
    quality: 'Giọng tiếng Việt tự nhiên, có voice cloning',
    requirement: 'Khuyến nghị RAM ≥ 8GB. Trên CPU chậm (~2x thời gian audio); mượt nếu có GPU/Apple Silicon (Metal).',
  },
  {
    id: 'omni',
    label: 'OmniVoice (chất lượng cao nhất)',
    endpoint: 'http://192.168.1.5:6024/v1',
    model: 'omnivoice',
    voice: 'female',
    quality: 'Chất lượng cao nhất, voice design + cloning',
    requirement: 'BẮT BUỘC GPU (NVIDIA CUDA / Apple Silicon M-series) + RAM ≥ 16GB. KHÔNG chạy thực dụng trên CPU thường.',
  },
  {
    id: 'custom',
    label: 'Tùy chỉnh (OpenAI, endpoint khác)',
    endpoint: 'https://api.openai.com/v1',
    model: 'tts-1',
    voice: 'alloy',
    quality: 'Tùy nhà cung cấp',
    requirement: 'Bất kỳ máy chủ nào tương thích OpenAI /audio/speech. Cần mạng + API key nếu là dịch vụ trả phí.',
  },
];

const KEY = 'aiworld.settings.v1';

const DEFAULTS: Settings = {
  endpoint: 'http://192.168.1.9:20128/v1',
  apiKey: '',
  model: 'Linh',
  asrEndpoint: 'http://192.168.1.9:6021',
  asrMode: 'local',
  localModel: 'Xenova/whisper-base',
  ttsMode: 'api',
  ttsEngine: 'valtec',
  ttsEndpoint: 'http://192.168.1.5:6025/v1',
  ttsApiKey: '',
  ttsModel: 'valtec',
  ttsVoice: 'vi',
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function isConfigured(s: Settings): boolean {
  return Boolean(s.endpoint.trim() && s.model.trim());
}

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  return `${b}/${p}`;
}

export async function chat(
  settings: Settings,
  messages: { role: string; content: string }[],
  signal?: AbortSignal,
): Promise<string> {
  if (!settings.endpoint.trim()) {
    throw new Error('Chưa cấu hình endpoint. Vào Cài đặt để nhập.');
  }
  const url = joinUrl(settings.endpoint, 'chat/completions');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (settings.apiKey.trim()) headers.Authorization = `Bearer ${settings.apiKey.trim()}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: settings.model, messages, temperature: 0.2, stream: false }),
    signal,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Lỗi máy chủ (${res.status}). ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== 'string') throw new Error('Phản hồi không hợp lệ từ máy chủ.');
  return text.trim();
}

export const LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어 (Hàn)' },
  { code: 'ja', label: '日本語 (Nhật)' },
  { code: 'zh', label: '中文 (Trung)' },
  { code: 'fr', label: 'Français' },
] as const;

export async function translate(
  settings: Settings,
  text: string,
  targetLabel: string,
  signal?: AbortSignal,
): Promise<string> {
  const messages = [
    {
      role: 'system',
      content:
        'You are a professional translator. Translate the user text accurately and naturally ' +
        `into ${targetLabel}. Preserve meaning, tone, line breaks and formatting. ` +
        'Return ONLY the translation, no notes, no quotes.',
    },
    { role: 'user', content: text },
  ];
  return chat(settings, messages, signal);
}

export async function ping(settings: Settings): Promise<string> {
  const out = await chat(settings, [
    { role: 'user', content: 'Reply with the single word: OK' },
  ]);
  return out;
}

export type TranscriptResult = {
  text: string;
  language: string;
  duration: number;
  segments: { start: number; end: number; text: string }[];
};

export async function transcribe(
  settings: Settings,
  file: File,
  language: string | null,
  onProgress?: (msg: string) => void,
  signal?: AbortSignal,
): Promise<TranscriptResult> {
  // Local mode: run Whisper on-device via WASM (no server).
  if (settings.asrMode === 'local') {
    const { transcribeLocal } = await import('./localAsr');
    return transcribeLocal(file, settings.localModel, language, onProgress);
  }
  // API mode: send to a transcription server.
  if (!settings.asrEndpoint.trim()) {
    throw new Error('Chưa cấu hình máy chủ ghi âm. Vào Cài đặt để nhập địa chỉ, hoặc chuyển sang chế độ Trên máy.');
  }
  const base = settings.asrEndpoint.replace(/\/+$/, '');
  const url = `${base}/v1/audio/transcriptions`;
  const form = new FormData();
  form.append('file', file);
  form.append('model', 'base');
  if (language) form.append('language', language);
  onProgress?.('Đang tải file lên và xử lý...');
  const res = await fetch(url, { method: 'POST', body: form, signal });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Lỗi máy chủ ghi âm (${res.status}). ${body.slice(0, 200)}`);
  }
  return (await res.json()) as TranscriptResult;
}

export function buildSrt(segments: { start: number; end: number; text: string }[]): string {
  const ts = (sec: number) => {
    const ms = Math.round(sec * 1000);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const r = ms % 1000;
    const p = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${p(h)}:${p(m)}:${p(s)},${p(r, 3)}`;
  };
  return segments
    .map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(s.end)}\n${s.text.trim()}\n`)
    .join('\n');
}

// Synthesize speech via an OpenAI-compatible /audio/speech endpoint.
// Returns the audio bytes (typically MP3) for playback and download.
export async function synthesizeSpeech(
  settings: Settings,
  text: string,
  signal?: AbortSignal,
): Promise<{ bytes: Uint8Array; mime: string }> {
  if (!settings.ttsEndpoint.trim()) {
    throw new Error('Chưa cấu hình máy chủ lồng tiếng. Vào Cài đặt để nhập endpoint TTS.');
  }
  const url = joinUrl(settings.ttsEndpoint, 'audio/speech');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (settings.ttsApiKey.trim()) headers.Authorization = `Bearer ${settings.ttsApiKey.trim()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: settings.ttsModel || 'tts-1',
      voice: settings.ttsVoice || 'alloy',
      input: text,
      response_format: 'mp3',
    }),
    signal,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Lỗi máy chủ lồng tiếng (${res.status}). ${body.slice(0, 200)}`);
  }
  const buf = await res.arrayBuffer();
  const mime = res.headers.get('content-type') || 'audio/mpeg';
  return { bytes: new Uint8Array(buf), mime };
}
