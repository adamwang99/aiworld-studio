import { useEffect, useRef, useState } from 'react';

export function VoicePage() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window.speechSynthesis === 'undefined') {
      setSupported(false);
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

  function speak() {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voices[voiceIdx]) u.voice = voices[voiceIdx];
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function stop() {
    window.speechSynthesis.cancel();
    setSpeaking(false);
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
          <p>Biến văn bản thành giọng nói tự nhiên. Chạy ngay trên máy, không cần mạng.</p>
        </div>
      </div>

      <section className="card pad">
        {!supported ? (
          <div className="alert error">Trình duyệt/ứng dụng này không hỗ trợ tổng hợp giọng nói.</div>
        ) : (
          <>
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
              {speaking ? (
                <button className="btn btn-ghost" onClick={stop}>Dừng</button>
              ) : null}
              <button className="btn btn-primary solid" onClick={speak} disabled={!text.trim()}>
                {speaking ? 'Đang đọc...' : 'Đọc to'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
