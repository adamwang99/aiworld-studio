import { useMemo, useState } from 'react';
import { activities, fakeProjects, jobs, modules, outputs } from './data';

type State = 'idle' | 'running' | 'blocked' | 'recovered' | 'ready_to_finalize';
type ModuleName = (typeof modules)[number]['name'];

function Pill({ state, children }: { state: State; children: React.ReactNode }) {
  return (
    <div className="status-pill" data-state={state}>
      {children}
    </div>
  );
}

const moduleContent: Record<ModuleName, { title: string; desc: string; cta: string }> = {
  Transcript: {
    title: 'Transcript workspace',
    desc: 'Nạp audio/video, nhận transcript thô, theo dõi runtime và partial output.',
    cta: 'Run transcription',
  },
  Subtitle: {
    title: 'Subtitle workspace',
    desc: 'Sinh SRT/VTT, kiểm timing, gom output subtitle trong cùng luồng.',
    cta: 'Generate subtitles',
  },
  Translate: {
    title: 'Translation workspace',
    desc: 'Chuẩn hóa luồng EN/KR/JP/ZH ↔ VI để tái dùng cho subtitle và voice.',
    cta: 'Translate content',
  },
  Voice: {
    title: 'Voice workspace',
    desc: 'Text → speech, preview voice, gom file âm thanh ready-to-publish.',
    cta: 'Create voiceover',
  },
  Outputs: {
    title: 'Outputs workspace',
    desc: 'Bundle transcript / subtitle / audio thành gói export thống nhất.',
    cta: 'Export bundle',
  },
  Settings: {
    title: 'Runtime settings',
    desc: 'Chọn engine, alignment, TTS, giới hạn workflow và cờ nâng cao.',
    cta: 'Save settings',
  },
};

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleName>('Transcript');
  const [selectedProject, setSelectedProject] = useState(fakeProjects[0]);
  const desktopMeta = window.aiworldStudio;

  const current = useMemo(() => moduleContent[activeModule], [activeModule]);

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
          {desktopMeta ? (
            <div className="glass hero-metric">
              <strong>{desktopMeta.platform}</strong>
              <span>electron {desktopMeta.version}</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="glass project-strip">
        <div>
          <p className="eyebrow">Current project</p>
          <strong>AI World / {selectedProject}</strong>
        </div>
        <div className="project-meta">
          <label className="select-shell">
            <span className="muted small-label">Project</span>
            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
              {fakeProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </label>
          <span className="tiny-badge">vi → en</span>
          <span className="tiny-badge">3 assets</span>
          <span className="tiny-badge">priority high</span>
        </div>
      </section>

      <section className="module-grid">
        {modules.map((module) => (
          <button
            key={module.name}
            className={`glass module-card ${activeModule === module.name ? 'active' : ''}`}
            onClick={() => setActiveModule(module.name)}
          >
            <div className="module-top">
              <strong>{module.name}</strong>
              <Pill state={module.state}>{module.state}</Pill>
            </div>
            <p className="muted">{module.desc}</p>
          </button>
        ))}
      </section>

      <section className="workspace-grid">
        <section className="glass block-card workspace-main">
          <div className="block-head">
            <div>
              <h2>{current.title}</h2>
              <p className="muted">{current.desc}</p>
            </div>
            <button className="primary-btn">{current.cta}</button>
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
                  <Pill state={job.state}>{job.state}</Pill>
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
              <span className="tiny-badge">{activeModule}</span>
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
