import { useRef, useState } from 'react';
import { buildSrt, loadSettings, transcribe, type TranscriptResult } from '../api';

const SOURCE_LANGS = [
  { code: '', label: 'Tự động nhận diện' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export function TranscribePage({ onNeedSettings }: { onNeedSettings: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  function pick(f: File | null) {
    setFile(f);
    setResult(null);
    setError('');
  }

  async function run() {
    setError('');
    setResult(null);
    if (!file) {
      setError('Chọn một file audio hoặc video trước.');
      return;
    }
    const settings = loadSettings();
    if (!settings.asrEndpoint.trim()) {
      setError('Chưa cấu hình máy chủ ghi âm. Mở Cài đặt.');
      onNeedSettings();
      return;
    }
    setBusy(true);
    setProgress('Đang tải lên...');
    abortRef.current = new AbortController();
    try {
      const r = await transcribe(settings, file, lang || null, setProgress, abortRef.current.signal);
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setProgress('');
    }
  }

  function download(kind: 'txt' | 'srt') {
    if (!result) return;
    const content = kind === 'srt' ? buildSrt(result.segments) : result.text;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'transcript') + '.' + kind;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Ghi âm → Văn bản</h1>
          <p>Tải audio hoặc video lên, nhận bản ghi chính xác. Xuất văn bản hoặc phụ đề SRT.</p>
        </div>
      </div>

      <section className="card pad">
        <div
          className={`dropzone ${dragOver ? 'over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) pick(f);
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.mov,.mkv,.webm,.ogg,.flac"
            hidden
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
          />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          {file ? (
            <>
              <strong>{file.name}</strong>
              <span>{(file.size / 1048576).toFixed(1)} MB · nhấn để đổi file</span>
            </>
          ) : (
            <>
              <strong>Kéo thả file vào đây hoặc nhấn để chọn</strong>
              <span>MP3, WAV, M4A, MP4, MOV, MKV, WEBM...</span>
            </>
          )}
        </div>

        <div className="row gap">
          <label className="select-field">
            <span>Ngôn ngữ nguồn</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>
              {SOURCE_LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </label>
          <div className="spacer" />
          {busy ? <button className="btn btn-ghost" onClick={() => abortRef.current?.abort()}>Hủy</button> : null}
          <button className="btn btn-primary solid" onClick={run} disabled={busy || !file}>
            {busy ? 'Đang xử lý...' : 'Chuyển thành văn bản'}
          </button>
        </div>
        {busy && progress ? <div className="progress-note"><div className="dots"><span /><span /><span /></div>{progress}</div> : null}
      </section>

      {error ? <div className="alert error">{error}</div> : null}

      {result ? (
        <section className="card pad">
          <div className="field-head">
            <span className="field-label">Kết quả ({result.language}, {result.duration.toFixed(1)}s)</span>
            <div className="row" style={{ gap: 8 }}>
              <button className="link-btn" onClick={() => download('txt')}>Tải .txt</button>
              <button className="link-btn" onClick={() => download('srt')}>Tải .srt</button>
            </div>
          </div>
          <div className="result-box tall">
            <p>{result.text || '(không nhận diện được giọng nói)'}</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
