import { useState } from 'react';
import { isConfigured, loadSettings, ping, saveSettings, warmupTts, TTS_ENGINES, type Settings, type TtsEngine } from '../api';

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

  // Switching engine preset fills endpoint/model/voice with that engine's defaults
  // (user can still tweak them afterwards). 'custom' leaves current values.
  function selectEngine(id: TtsEngine) {
    const e = TTS_ENGINES.find((x) => x.id === id);
    if (!e) return;
    if (id === 'custom') {
      update({ ttsEngine: id });
      return;
    }
    const next = { ttsEngine: id, ttsEndpoint: e.endpoint, ttsModel: e.model, ttsVoice: e.voice };
    update(next);
    // Pre-load the newly selected engine's model on the Mac server in the
    // background, so it is ready when the user renders voice. Best-effort.
    void warmupTts({ ...s, ...next });
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
          <span>Chế độ ghi âm → văn bản</span>
          <select value={s.asrMode} onChange={(e) => update({ asrMode: e.target.value as Settings['asrMode'] })}>
            <option value="local">Trên máy (offline, không cần mạng)</option>
            <option value="api">Máy chủ API (online)</option>
          </select>
          <small>"Trên máy" xử lý ngay trên thiết bị bằng AI offline. Lần đầu tải model ~40-150MB rồi dùng lại.</small>
        </label>

        {s.asrMode === 'local' ? (
          <label className="form-field">
            <span>Model trên máy</span>
            <select value={s.localModel} onChange={(e) => update({ localModel: e.target.value as Settings['localModel'] })}>
              <option value="Xenova/whisper-tiny">Tiny — nhanh nhất, nhẹ (~40MB)</option>
              <option value="Xenova/whisper-base">Base — cân bằng (~75MB)</option>
              <option value="Xenova/whisper-small">Small — chính xác hơn (~250MB)</option>
            </select>
          </label>
        ) : (
          <label className="form-field">
            <span>Máy chủ ghi âm (transcription)</span>
            <input
              value={s.asrEndpoint}
              onChange={(e) => update({ asrEndpoint: e.target.value })}
              placeholder="http://192.168.1.9:6021"
            />
            <small>Dịch vụ chuyển giọng nói → văn bản (Whisper). Mặc định nội bộ: http://192.168.1.9:6021</small>
          </label>
        )}

        <label className="form-field">
          <span>Chế độ lồng tiếng (text → speech)</span>
          <select value={s.ttsMode} onChange={(e) => update({ ttsMode: e.target.value as Settings['ttsMode'] })}>
            <option value="local">Trên máy (giọng hệ điều hành)</option>
            <option value="api">Máy chủ TTS (OpenAI-compatible)</option>
          </select>
          <small>"Trên máy" dùng giọng đọc của Windows/macOS (Linux thường không có — dùng Máy chủ TTS).</small>
        </label>

        {s.ttsMode === 'api' ? (
          <>
            <label className="form-field">
              <span>Mô hình lồng tiếng (engine)</span>
              <select value={s.ttsEngine} onChange={(e) => selectEngine(e.target.value as TtsEngine)}>
                {TTS_ENGINES.map((e) => (
                  <option key={e.id} value={e.id}>{e.label}</option>
                ))}
              </select>
              {(() => {
                const e = TTS_ENGINES.find((x) => x.id === s.ttsEngine);
                if (!e) return null;
                const strong = e.id === 'omni';
                return (
                  <div className={`engine-note ${strong ? 'warn' : ''}`}>
                    <div><b>Chất lượng:</b> {e.quality}</div>
                    <div><b>Yêu cầu:</b> {e.requirement}</div>
                  </div>
                );
              })()}
            </label>

            <label className="form-field">
              <span>Endpoint TTS</span>
              <input
                value={s.ttsEndpoint}
                onChange={(e) => update({ ttsEndpoint: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
              <small>Máy chủ tương thích OpenAI /audio/speech. Piper mặc định nội bộ: http://192.168.1.5:6022/v1 (offline, không cần key).</small>
            </label>
            <label className="form-field">
              <span>TTS API Key</span>
              <input
                type="password"
                value={s.ttsApiKey}
                onChange={(e) => update({ ttsApiKey: e.target.value })}
                placeholder="Để trống nếu máy chủ không yêu cầu"
              />
            </label>
            <div className="row gap">
              <label className="form-field" style={{ flex: 1 }}>
                <span>TTS Model</span>
                <input
                  value={s.ttsModel}
                  onChange={(e) => update({ ttsModel: e.target.value })}
                  placeholder="tts-1"
                />
              </label>
              <label className="form-field" style={{ flex: 1 }}>
                <span>Giọng (voice)</span>
                <input
                  value={s.ttsVoice}
                  onChange={(e) => update({ ttsVoice: e.target.value })}
                  placeholder="vi"
                />
              </label>
            </div>
          </>
        ) : null}

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
