import { useRef, useState } from 'react';
import { LANGUAGES, loadSettings, translate } from '../api';
import { addLibraryItem } from '../library';

export function TranslatePage({ onNeedSettings }: { onNeedSettings: () => void }) {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('en');
  const [result, setResult] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const targetLabel = LANGUAGES.find((l) => l.code === target)?.label ?? target;

  async function run() {
    setError('');
    setResult('');
    setCopied(false);
    const text = source.trim();
    if (!text) {
      setError('Nhập nội dung cần dịch.');
      return;
    }
    const settings = loadSettings();
    if (!settings.endpoint.trim()) {
      setError('Chưa cấu hình máy chủ AI. Mở Cài đặt để nhập endpoint.');
      onNeedSettings();
      return;
    }
    setBusy(true);
    abortRef.current = new AbortController();
    try {
      const out = await translate(settings, text, targetLabel, abortRef.current.signal);
      setResult(out);
      if (out?.trim()) {
        addLibraryItem({
          kind: 'translate',
          title: `Dịch sang ${targetLabel}: ` + text.slice(0, 40).replace(/\s+/g, ' '),
          text: out,
          meta: { target: targetLabel },
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setBusy(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Dịch thuật</h1>
          <p>Dịch nội dung sang ngôn ngữ khác bằng AI. Dán văn bản, chọn ngôn ngữ, nhấn Dịch.</p>
        </div>
      </div>

      <div className="translate-grid">
        <section className="card pad">
          <div className="field-head">
            <span className="field-label">Nội dung gốc</span>
            <span className="char-count">{source.length} ký tự</span>
          </div>
          <textarea
            className="ta"
            placeholder="Dán hoặc nhập văn bản cần dịch..."
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <div className="row gap">
            <label className="select-field">
              <span>Dịch sang</span>
              <select value={target} onChange={(e) => setTarget(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </label>
            <div className="spacer" />
            {busy ? (
              <button className="btn btn-ghost" onClick={cancel}>Hủy</button>
            ) : null}
            <button className="btn btn-primary solid" onClick={run} disabled={busy}>
              {busy ? 'Đang dịch...' : 'Dịch ngay'}
            </button>
          </div>
        </section>

        <section className="card pad">
          <div className="field-head">
            <span className="field-label">Bản dịch ({targetLabel})</span>
            {result ? (
              <button className="link-btn" onClick={copy}>{copied ? 'Đã chép ✓' : 'Sao chép'}</button>
            ) : null}
          </div>
          <div className={`result-box ${busy ? 'loading' : ''}`}>
            {busy ? (
              <div className="dots"><span /><span /><span /></div>
            ) : result ? (
              <p>{result}</p>
            ) : (
              <span className="placeholder">Bản dịch sẽ hiện ở đây.</span>
            )}
          </div>
        </section>
      </div>

      {error ? <div className="alert error">{error}</div> : null}
    </div>
  );
}
