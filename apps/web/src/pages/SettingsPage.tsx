import { useState } from 'react';
import { isConfigured, loadSettings, ping, saveSettings, type Settings } from '../api';

export function SettingsPage() {
  const [s, setS] = useState<Settings>(() => loadSettings());
  const [saved, setSaved] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'busy' | 'ok' | 'fail'>('idle');
  const [testMsg, setTestMsg] = useState('');

  function update(patch: Partial<Settings>) {
    setS((prev) => ({ ...prev, ...patch }));
    setSaved(false);
    setTestState('idle');
  }

  function save() {
    saveSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  async function test() {
    saveSettings(s);
    setTestState('busy');
    setTestMsg('');
    try {
      const out = await ping(s);
      setTestState('ok');
      setTestMsg(`Kết nối thành công. Máy chủ trả về: "${out}"`);
    } catch (e) {
      setTestState('fail');
      setTestMsg(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Cài đặt</h1>
          <p>Kết nối tới máy chủ AI (tương thích OpenAI). Hỗ trợ 9router, DS2API nội bộ, OpenAI, hoặc bất kỳ endpoint nào.</p>
        </div>
      </div>

      <section className="card pad form">
        <label className="form-field">
          <span>Địa chỉ máy chủ (endpoint)</span>
          <input
            value={s.endpoint}
            onChange={(e) => update({ endpoint: e.target.value })}
            placeholder="http://192.168.1.9:20128/v1"
          />
          <small>Mặc định nội bộ AI World: http://192.168.1.9:20128/v1 (9router) — hoặc https://api.openai.com/v1</small>
        </label>

        <label className="form-field">
          <span>API Key</span>
          <input
            type="password"
            value={s.apiKey}
            onChange={(e) => update({ apiKey: e.target.value })}
            placeholder="Để trống nếu máy chủ nội bộ không yêu cầu"
          />
        </label>

        <label className="form-field">
          <span>Model</span>
          <input
            value={s.model}
            onChange={(e) => update({ model: e.target.value })}
            placeholder="Linh"
          />
        </label>

        <label className="form-field">
          <span>Máy chủ ghi âm (transcription)</span>
          <input
            value={s.asrEndpoint}
            onChange={(e) => update({ asrEndpoint: e.target.value })}
            placeholder="http://192.168.1.9:6021"
          />
          <small>Dịch vụ chuyển giọng nói → văn bản (Whisper). Mặc định nội bộ: http://192.168.1.9:6021</small>
        </label>

        <div className="row gap">
          <button className="btn btn-primary solid" onClick={save}>{saved ? 'Đã lưu ✓' : 'Lưu cài đặt'}</button>
          <button className="btn btn-ghost dark" onClick={test} disabled={!isConfigured(s) || testState === 'busy'}>
            {testState === 'busy' ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
          </button>
        </div>

        {testState === 'ok' ? <div className="alert ok">{testMsg}</div> : null}
        {testState === 'fail' ? <div className="alert error">{testMsg}</div> : null}
      </section>
    </div>
  );
}
