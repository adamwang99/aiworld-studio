import { useEffect, useRef, useState } from 'react';
import { loadSettings, synthesizeSpeech, warmupTts, ttsStatus, type TtsState } from '../api';
import { saveBytesFile } from '../download';

export function VoicePage({ onNeedSettings }: { onNeedSettings: () => void }) {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [osSupported, setOsSupported] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const audioBytesRef = useRef<Uint8Array | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // 'local' = OS speech synthesis (Web Speech API), 'api' = server TTS.
  // Default follows saved settings, but auto-fall back to API when the OS
  // webview (e.g. WebKitGTK on Linux) has no speechSynthesis.
  const [mode, setMode] = useState<'local' | 'api'>(() => loadSettings().ttsMode);
  // Readiness of the selected Mac TTS engine (lazy-loaded on the server).
  const [engineState, setEngineState] = useState<TtsState>('unknown');

  // When the Voice page opens in API mode, tell the Mac server to start loading
  // the selected engine's model now (the user still has to type/paste text),
  // then poll until it reports ready so we can show a status badge.
  useEffect(() => {
    const settings = loadSettings();
    if (settings.ttsMode !== 'api') return;
    let stop = false;
    const ctrl = new AbortController();
    (async () => {
      const st = await warmupTts(settings, ctrl.signal);
      if (stop) return;
      setEngineState(st);
      if (st === 'ready' || st === 'unknown') return;
      // Poll status until ready (cold start of OmniVoice/VieNeu can take ~80s).
      for (let i = 0; i < 90 && !stop; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const cur = await ttsStatus(settings, ctrl.signal);
        if (stop) return;
        setEngineState(cur);
        if (cur === 'ready' || cur === 'unknown') break;
      }
    })();
    return () => { stop = true; ctrl.abort(); };
  }, []);

  useEffect(() => {
    if (typeof window.speechSynthesis === 'undefined') {
      setOsSupported(false);
      setMode('api');
      return;
    }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) setVoices(v);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  function speakLocal() {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) u.voice = voices[voiceIdx];
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function stopLocal() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  async function speakApi() {
    if (!text.trim()) return;
    setError('');
    setProgress('Đang tạo giọng nói...');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(''); }
    const settings = loadSettings();
    if (!settings.ttsEndpoint.trim()) {
      setError('Chưa cấu hình máy chủ lồng tiếng. Mở Cài đặt để nhập endpoint TTS.');
      setProgress('');
      onNeedSettings();
      return;
    }
    abortRef.current = new AbortController();
    try {
      const { bytes, mime } = await synthesizeSpeech(settings, text, abortRef.current.signal);
      audioBytesRef.current = bytes;
      const blob = new Blob([bytes as unknown as BlobPart], { type: mime });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // auto-play
      const audio = new Audio(url);
      audio.play().catch(() => { /* user can press play */ });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setProgress('');
    }
  }

  async function downloadAudio() {
    if (!audioBytesRef.current) return;
    try {
      await saveBytesFile(audioBytesRef.current, 'long-tieng.mp3', 'audio/mpeg');
    } catch (e) {
      setError('Không lưu được file: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  // Prefer Vietnamese / English voices at top of list for relevance.
  const sortedVoices = voices
    .map((v, i) => ({ v, i }))
    .sort((a, b) => {
      const score = (lang: string) => (lang.startsWith('vi') ? 0 : lang.startsWith('en') ? 1 : 2);
      return score(a.v.lang) - score(b.v.lang);
    });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Lồng tiếng</h1>
          <p>Biến văn bản thành giọng nói tự nhiên. Chạy trên máy hoặc qua máy chủ TTS.</p>
        </div>
      </div>

      <section className="card pad">
        <div className="field-head">
          <span className="field-label">Nội dung</span>
          <span className="char-count">{text.length} ký tự</span>
        </div>
        <textarea
          className="ta"
          placeholder="Nhập văn bản cần đọc..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="row gap" style={{ marginTop: 12 }}>
          <label className="select-field">
            <span>Chế độ</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'local' | 'api')}
            >
              <option value="local" disabled={!osSupported}>
                Trên máy (giọng hệ điều hành){osSupported ? '' : ' — không khả dụng'}
              </option>
              <option value="api">Máy chủ TTS (OpenAI-compatible)</option>
            </select>
          </label>
        </div>

        {!osSupported && mode === 'local' ? (
          <div className="alert error" style={{ marginTop: 12 }}>
            Ứng dụng này (webview Linux) không có giọng đọc hệ điều hành. Chuyển sang "Máy chủ TTS" và cấu hình endpoint trong Cài đặt.
          </div>
        ) : null}

        {mode === 'local' && osSupported ? (
          <>
            <div className="voice-controls">
              <label className="select-field" style={{ width: '100%' }}>
                <span>Giọng đọc ({voices.length})</span>
                <select value={voiceIdx} onChange={(e) => setVoiceIdx(Number(e.target.value))} style={{ width: '100%' }}>
                  {sortedVoices.map(({ v, i }) => (
                    <option key={i} value={i}>{v.name} — {v.lang}</option>
                  ))}
                </select>
              </label>
              <div className="range-field">
                <span>Tốc độ: {rate.toFixed(1)}x</span>
                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
                <span>Cao độ: {pitch.toFixed(1)}</span>
                <input type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(Number(e.target.value))} />
              </div>
            </div>
            <div className="row gap">
              <div className="spacer" />
              {speaking ? <button className="btn btn-ghost" onClick={stopLocal}>Dừng</button> : null}
              <button className="btn btn-primary solid" onClick={speakLocal} disabled={!text.trim()}>
                {speaking ? 'Đang đọc...' : 'Đọc to'}
              </button>
            </div>
          </>
        ) : (
          <>
            {engineState !== 'unknown' ? (
              <div className={`engine-status ${engineState}`} style={{ marginTop: 12, marginBottom: 4 }}>
                {engineState === 'ready'
                  ? '● Giọng đã sẵn sàng — tạo là có ngay.'
                  : engineState === 'loading'
                  ? '◌ Đang nạp giọng trên máy chủ... (có thể mất tới ~80 giây cho lần đầu, bạn cứ soạn nội dung trước)'
                  : '○ Đang khởi động giọng...'}
              </div>
            ) : null}
            <div className="row gap">
              <div className="spacer" />
              <button className="btn btn-primary solid" onClick={speakApi} disabled={!text.trim() || progress !== ''}>
                {progress ? 'Đang xử lý...' : 'Tạo giọng nói'}
              </button>
            </div>
            {progress ? <div className="progress-note"><div className="dots"><span /><span /><span /></div>{progress}</div> : null}
            {audioUrl ? (
              <div className="card pad" style={{ marginTop: 12 }}>
                <div className="field-head">
                  <span className="field-label">Kết quả</span>
                  <button className="link-btn" onClick={downloadAudio}>Tải .mp3</button>
                </div>
                <audio src={audioUrl} controls style={{ width: '100%', marginTop: 8 }} />
              </div>
            ) : null}
          </>
        )}
      </section>

      {error ? <div className="alert error">{error}</div> : null}
    </div>
  );
}
