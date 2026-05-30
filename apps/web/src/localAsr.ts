// On-device transcription using transformers.js (Whisper WASM).
// Runs entirely in the app — no server needed. Model downloads once, then cached.
import type { TranscriptResult } from './api';

let _pipeline: unknown = null;
let _loading: Promise<unknown> | null = null;

export type LocalModel = 'Xenova/whisper-tiny' | 'Xenova/whisper-base' | 'Xenova/whisper-small';

async function getPipeline(model: LocalModel, onProgress?: (msg: string) => void): Promise<unknown> {
  if (_pipeline) return _pipeline;
  if (_loading) return _loading;
  _loading = (async () => {
    onProgress?.('Đang tải engine nhận diện (lần đầu ~40-150MB)...');
    const tf = (await import('@huggingface/transformers')) as {
      pipeline: (task: string, model: string, opts?: Record<string, unknown>) => Promise<unknown>;
      env: { allowLocalModels: boolean };
    };
    tf.env.allowLocalModels = false;
    const asr = await tf.pipeline('automatic-speech-recognition', model, {
      progress_callback: (p: { status?: string; progress?: number; file?: string }) => {
        if (p.status === 'progress' && typeof p.progress === 'number') {
          onProgress?.(`Đang tải model: ${Math.round(p.progress)}%`);
        }
      },
    });
    _pipeline = asr;
    return asr;
  })();
  return _loading;
}

async function decodeToPcm(file: File): Promise<Float32Array> {
  const ab = await file.arrayBuffer();
  const AC = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
  const ac = new AC({ sampleRate: 16000 });
  try {
    const audio = await ac.decodeAudioData(ab);
    // Downmix to mono.
    if (audio.numberOfChannels === 1) return audio.getChannelData(0);
    const len = audio.length;
    const out = new Float32Array(len);
    for (let ch = 0; ch < audio.numberOfChannels; ch++) {
      const data = audio.getChannelData(ch);
      for (let i = 0; i < len; i++) out[i] += data[i] / audio.numberOfChannels;
    }
    return out;
  } finally {
    ac.close().catch(() => {});
  }
}

export async function transcribeLocal(
  file: File,
  model: LocalModel,
  language: string | null,
  onProgress?: (msg: string) => void,
): Promise<TranscriptResult> {
  const asr = (await getPipeline(model, onProgress)) as (
    pcm: Float32Array,
    opts: Record<string, unknown>,
  ) => Promise<{ text: string; chunks?: { timestamp: [number, number]; text: string }[] }>;
  onProgress?.('Đang giải mã âm thanh...');
  const pcm = await decodeToPcm(file);
  onProgress?.('Đang nhận diện giọng nói trên máy...');
  const opts: Record<string, unknown> = { return_timestamps: true, chunk_length_s: 30, stride_length_s: 5 };
  // whisper-tiny.en is English-only; multilingual models accept a language hint.
  if (language && !model.endsWith('.en')) opts.language = language;
  const r = await asr(pcm, opts);
  const segments = (r.chunks ?? []).map((c) => ({
    start: c.timestamp[0] ?? 0,
    end: c.timestamp[1] ?? 0,
    text: c.text,
  }));
  const duration = segments.length ? segments[segments.length - 1].end : 0;
  return {
    text: r.text.trim(),
    language: language || 'auto',
    duration,
    segments: segments.length ? segments : [{ start: 0, end: duration, text: r.text.trim() }],
  };
}
