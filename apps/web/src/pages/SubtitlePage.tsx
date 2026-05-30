import { useRef, useState } from 'react';
import { buildSrt, loadSettings, transcribe, type TranscriptResult } from '../api';

function buildVtt(segments: { start: number; end: number; text: string }[]): string {
  const ts = (sec: number) => {
    const ms = Math.round(sec * 1000);
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const r = ms % 1000;
    const p = (n: number, l = 2) => String(n).padStart(l, '0');
    return `${p(h)}:${p(m)}:${p(s)}.${p(r, 3)}`;
  };
  return 'WEBVTT\n\n' + segments.map((s) => `${ts(s.start)} --> ${ts(s.end)}\n${s.text.trim()}`).join('\n\n') + '\n';
}

export function SubtitlePage({ onNeedSettings }: { onNeedSettings: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function run() {
    setError('');
    setResult(null);
    if (!file) { setError('Chọn một file audio hoặc video trước.'); return; }
    const settings = loadSettings();
    if (settings.asrMode === 'api' && !settings.asrEndpoint.trim()) {
      setError('Chưa cấu hình máy chủ ghi âm. Mở Cài đặt, hoặc chuyển sang chế độ Trên máy.');
      onNeedSettings();
      return;
    }
    setBusy(true);
    setProgress('Đang tạo phụ đề...');
    abortRef.current = new AbortController();
    try {
      const r = await transcribe(settings, file, null, setProgress, abortRef.current.signal);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setProgress('');
    }
  }

  function download(kind: 'srt' | 'vtt') {
    if (!result) return;
    const content = kind === 'srt' ? buildSrt(result.segments) : buildVtt(result.segments);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'subtitle') + '.' + kind;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const ts = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Phụ đề</h1>
          <p>Tạo phụ đề tự động cho video. Xuất SRT hoặc VTT chuẩn timing, sẵn sàng dùng.</p>
        </div>
      </div>

      <section className="card pad">
        <div
          className={`dropzone ${dragOver ? 'over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setResult(null); } }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="audio/*,video/*" hidden onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); }} />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 14h5m3 0h2M7 10h2m3 0h5" />
          </svg>
          {file ? (
            <><strong>{file.name}</strong><span>{(file.size / 1048576).toFixed(1)} MB · nhấn để đổi file</span></>
          ) : (
            <><strong>Kéo thả video/audio vào đây hoặc nhấn để chọn</strong><span>MP4, MOV, MKV, MP3, WAV...</span></>
          )}
        </div>

        <div className="row gap">
          <div className="spacer" />
          {busy ? <button className="btn btn-ghost" onClick={() => abortRef.current?.abort()}>Hủy</button> : null}
          <button className="btn btn-primary solid" onClick={run} disabled={busy || !file}>
            {busy ? 'Đang xử lý...' : 'Tạo phụ đề'}
          </button>
        </div>
        {busy && progress ? <div className="progress-note"><div className="dots"><span /><span /><span /></div>{progress}</div> : null}
      </section>

      {error ? <div className="alert error">{error}</div> : null}

      {result ? (
        <section className="card pad">
          <div className="field-head">
            <span className="field-label">{result.segments.length} dòng phụ đề ({result.language})</span>
            <div className="row" style={{ gap: 8 }}>
              <button className="link-btn" onClick={() => download('srt')}>Tải .srt</button>
              <button className="link-btn" onClick={() => download('vtt')}>Tải .vtt</button>
            </div>
          </div>
          <div className="result-box tall">
            {result.segments.length ? result.segments.map((s, i) => (
              <p key={i} style={{ marginBottom: 8 }}>
                <span style={{ color: 'var(--accent2)', fontVariantNumeric: 'tabular-nums', marginRight: 8 }}>
                  {ts(s.start)} → {ts(s.end)}
                </span>
                {s.text.trim()}
              </p>
            )) : <span className="placeholder">(không nhận diện được giọng nói)</span>}
          </div>
        </section>
      ) : null}
    </div>
  );
}
