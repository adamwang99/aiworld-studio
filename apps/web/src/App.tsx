import { activities, jobs, modules, outputs } from './data';

type State = 'idle' | 'running' | 'blocked' | 'recovered' | 'ready_to_finalize';

function Pill({ state, children }: { state: State; children: React.ReactNode }) {
  return (
    <div className="status-pill" data-state={state}>
      {children}
    </div>
  );
}

export function App() {
  return (
    <main className="app-shell">
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="aurora aurora-c" />

      <section className="glass hero-card">
        <div className="hero-copy">
          <p className="eyebrow">AI World Studio</p>
          <h1>Media workflow. 1 cửa vào. Nhiều engine phía sau.</h1>
          <p className="muted">
            Operator workspace cho transcript, subtitle, translation, voice, queue, output package.
          </p>
          <div className="hero-actions">
            <button className="primary-btn">New project</button>
            <button className="ghost-btn">Open queue</button>
          </div>
        </div>

        <div className="hero-side">
          <Pill state="running">runtime running</Pill>
          <div className="glass hero-metric">
            <strong>12</strong>
            <span>outputs tuần này</span>
          </div>
          <div className="glass hero-metric">
            <strong>4</strong>
            <span>engines active</span>
          </div>
        </div>
      </section>

      <section className="glass project-strip">
        <div>
          <p className="eyebrow">Current project</p>
          <strong>AI World / Podcast localization batch</strong>
        </div>
        <div className="project-meta">
          <span className="tiny-badge">vi → en</span>
          <span className="tiny-badge">3 assets</span>
          <span className="tiny-badge">priority high</span>
        </div>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <article key={module.name} className="glass module-card">
            <div className="module-top">
              <strong>{module.name}</strong>
              <Pill state={module.state as State}>{module.state}</Pill>
            </div>
            <p className="muted">{module.desc}</p>
          </article>
        ))}
      </section>

      <section className="workspace-grid">
        <section className="glass block-card workspace-main">
          <div className="block-head">
            <div>
              <h2>Input</h2>
              <p className="muted">Drop audio / video / text. Chọn workflow rồi chạy.</p>
            </div>
            <button className="primary-btn">Create job</button>
          </div>

          <div className="dropzone">
            <span>Drop file here</span>
            <small>MP3, WAV, MP4, TXT</small>
          </div>

          <div className="quick-actions">
            <button className="ghost-btn">Transcribe</button>
            <button className="ghost-btn">Translate</button>
            <button className="ghost-btn">Voiceover</button>
          </div>
        </section>

        <aside className="glass block-card workspace-side">
          <div className="block-head compact">
            <div>
              <h2>Runtime</h2>
              <p className="muted">Live state</p>
            </div>
            <span className="tiny-badge">3 jobs</span>
          </div>

          <div className="stat-stack">
            <div className="stat-box">
              <span className="muted">Queued</span>
              <strong>2</strong>
            </div>
            <div className="stat-box">
              <span className="muted">Running</span>
              <strong>1</strong>
            </div>
            <div className="stat-box">
              <span className="muted">Blocked</span>
              <strong>1</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="workspace-grid lower-grid">
        <section className="glass block-card">
          <div className="block-head">
            <div>
              <h2>Queue / Jobs</h2>
              <p className="muted">Tác vụ đang chạy, chờ, blocked, sẵn finalize.</p>
            </div>
            <span className="tiny-badge">mock runtime</span>
          </div>

          <div className="job-list">
            {jobs.map((job) => (
              <article key={job.name} className="job-item">
                <div>
                  <div className="job-title-row">
                    <strong>{job.name}</strong>
                    <span className="tiny-badge">{job.owner}</span>
                  </div>
                  <p className="muted">{job.meta}</p>
                </div>
                <div className="job-side">
                  <Pill state={job.state as State}>{job.state}</Pill>
                  <span className="tiny-badge">{job.eta}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass block-card">
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
              Hệ thống này gom transcript, subtitle, translation và voice vào chung 1 luồng xử lý.
            </p>
            <div className="preview-meta">
              <span className="tiny-badge">vi</span>
              <span className="tiny-badge">00:32</span>
              <span className="tiny-badge">draft</span>
            </div>
          </div>
        </section>
      </section>

      <section className="workspace-grid lower-grid">
        <details className="glass details-card" open>
          <summary>Advanced</summary>
          <div className="details-body">
            <div className="tiny-badge">Engine: Faster-Whisper</div>
            <div className="tiny-badge">Align: WhisperX</div>
            <div className="tiny-badge">TTS: Edge-TTS</div>
            <div className="tiny-badge">Translate: multi-layer</div>
          </div>
        </details>

        <section className="glass block-card outputs-card">
          <div className="block-head compact">
            <div>
              <h2>Outputs</h2>
              <p className="muted">Ready artifacts</p>
            </div>
          </div>
          <div className="output-list">
            {outputs.map((output) => (
              <div key={output.label} className="output-item">
                <span>{output.label}</span>
                <span className="tiny-badge">{output.kind}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <details className="glass details-card">
        <summary>Logs</summary>
        <div className="log-box">
          {activities.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </details>
    </main>
  );
}
