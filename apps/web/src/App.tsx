const tabs = ['Transcript', 'Subtitle', 'Translate', 'Voice', 'Outputs', 'Settings'];
const jobs = [
  { name: 'Podcast EP12', state: 'running', meta: 'Whisper → 42%' },
  { name: 'News clip VN', state: 'ready_to_finalize', meta: 'SRT ready' },
  { name: 'Interview KR', state: 'blocked', meta: 'Need source audio retry' },
];

export function App() {
  return (
    <main className="app-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />

      <section className="glass hero-card">
        <div>
          <p className="eyebrow">AI World Studio</p>
          <h1>Media workflow. 1 cửa vào. Nhiều engine phía sau.</h1>
          <p className="muted">
            Glassmorphism dark UI cho transcript, subtitle, translation, voice, queue, output.
          </p>
        </div>
        <div className="status-pill" data-state="running">runtime running</div>
      </section>

      <section className="module-grid">
        {tabs.map((tab) => (
          <button key={tab} className="glass module-chip">
            {tab}
          </button>
        ))}
      </section>

      <section className="glass block-card">
        <div className="block-head">
          <div>
            <h2>Input</h2>
            <p className="muted">Drop audio / video / text. Chọn workflow rồi chạy.</p>
          </div>
          <button className="primary-btn">New job</button>
        </div>
        <div className="dropzone">
          <span>Drop file here</span>
          <small>MP3, WAV, MP4, TXT</small>
        </div>
      </section>

      <section className="glass block-card">
        <div className="block-head">
          <div>
            <h2>Queue / Runtime</h2>
            <p className="muted">Tác vụ đang chạy, chờ, blocked, sẵn finalize.</p>
          </div>
          <div className="tiny-badge">3 jobs</div>
        </div>

        <div className="job-list">
          {jobs.map((job) => (
            <article key={job.name} className="job-item">
              <div>
                <strong>{job.name}</strong>
                <p className="muted">{job.meta}</p>
              </div>
              <div className="status-pill" data-state={job.state}>{job.state}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="glass block-card preview-card">
        <div className="block-head">
          <div>
            <h2>Preview</h2>
            <p className="muted">Transcript, subtitle, audio preview trong cùng 1 canvas.</p>
          </div>
          <button className="ghost-btn">Export</button>
        </div>

        <div className="preview-panel">
          <p>
            Xin chào, đây là bản transcript mẫu để dựng cảm giác operator workspace theo style VS-Brain.
          </p>
          <div className="preview-meta">
            <span className="tiny-badge">vi</span>
            <span className="tiny-badge">00:32</span>
            <span className="tiny-badge">draft</span>
          </div>
        </div>
      </section>

      <details className="glass details-card">
        <summary>Advanced</summary>
        <div className="details-body">
          <div className="tiny-badge">Engine: Faster-Whisper</div>
          <div className="tiny-badge">Align: WhisperX</div>
          <div className="tiny-badge">TTS: Edge-TTS</div>
        </div>
      </details>

      <details className="glass details-card">
        <summary>Logs</summary>
        <div className="log-box">
          [00:00] ingest file<br />
          [00:02] speech detect<br />
          [00:05] transcription start<br />
          [00:11] partial output ready
        </div>
      </details>
    </main>
  );
}
