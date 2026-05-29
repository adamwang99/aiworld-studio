export const modules = [
  {
    name: 'Transcript',
    desc: 'Audio/video → text',
    state: 'running',
  },
  {
    name: 'Subtitle',
    desc: 'SRT / VTT / timing',
    state: 'ready_to_finalize',
  },
  {
    name: 'Translate',
    desc: 'EN/KR/JP/ZH ↔ VI',
    state: 'idle',
  },
  {
    name: 'Voice',
    desc: 'TTS / voice output',
    state: 'recovered',
  },
  {
    name: 'Outputs',
    desc: 'Bundle / export / archive',
    state: 'idle',
  },
  {
    name: 'Settings',
    desc: 'Engine / advanced / limits',
    state: 'idle',
  },
];

export const jobs = [
  {
    name: 'Podcast EP12',
    state: 'running',
    meta: 'Whisper → 42%',
    owner: 'Media desk',
    eta: '02:11',
  },
  {
    name: 'News clip VN',
    state: 'ready_to_finalize',
    meta: 'SRT ready',
    owner: 'News desk',
    eta: 'done',
  },
  {
    name: 'Interview KR',
    state: 'blocked',
    meta: 'Need source audio retry',
    owner: 'Research desk',
    eta: 'retry',
  },
];

export const activities = [
  '[00:00] ingest file',
  '[00:02] detect language: vi',
  '[00:05] transcription start',
  '[00:11] partial output ready',
  '[00:16] alignment pending',
];

export const outputs = [
  { label: 'Transcript.txt', kind: 'text' },
  { label: 'Subtitle.srt', kind: 'subtitle' },
  { label: 'Voiceover.mp3', kind: 'audio' },
];
