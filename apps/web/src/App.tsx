import { useState } from 'react';
import { navItems, projects, stats, workflows, type ProjectStatus } from './data';

const statusLabel: Record<ProjectStatus, string> = {
  done: 'Hoàn thành',
  processing: 'Đang xử lý',
  draft: 'Nháp',
};

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="url(#g)" />
          <path d="M12 7v10M7.5 9.5v5M16.5 9.5v5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.92" />
          <defs>
            <linearGradient id="g" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="brand-text">
        <strong>AI World Studio</strong>
        <span>Media Workspace</span>
      </div>
    </div>
  );
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: 'M3 11l9-8 9 8M5 10v10h14V10',
    projects: 'M3 7h7l2 2h9v11H3V7z',
    transcribe: 'M12 3v12m0 0a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zM5 11a7 7 0 0014 0M12 18v3',
    subtitle: 'M4 5h16v14H4V5zm3 9h5m3 0h2M7 10h2m3 0h5',
    translate: 'M4 5h7M7 4v1c0 4-2 7-5 9m1-4c1 3 3 4 6 5m4-6h6m-3 0v0l-3 8m6 0l-3-8m0 0l-1.5 4.5h7',
    voice: 'M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3M8 21h8',
    library: 'M5 4v16M9 4v16M13 5l5 15M3 4h6m0 0h4',
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name] ?? paths.home} />
    </svg>
  );
}

export function App() {
  const [active, setActive] = useState('home');

  return (
    <div className="layout">
      <aside className="sidebar">
        <Logo />
        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${active === item.key ? 'active' : ''}`}
              onClick={() => setActive(item.key)}
            >
              <Icon name={item.key} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="upgrade-card">
          <strong>Gói Pro</strong>
          <p>Mở khóa xử lý không giới hạn và lồng tiếng cao cấp.</p>
          <button className="btn btn-light">Nâng cấp</button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
            <input placeholder="Tìm dự án, file, hoặc tác vụ..." />
          </div>
          <div className="topbar-right">
            <button className="icon-btn" aria-label="Thông báo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span className="dot" />
            </button>
            <div className="avatar">AW</div>
          </div>
        </header>

        <main className="content">
          <section className="hero">
            <div className="hero-text">
              <span className="hero-eyebrow">Chào mừng trở lại 👋</span>
              <h1>Biến audio &amp; video thành nội dung hoàn chỉnh</h1>
              <p>Ghi âm, phụ đề, dịch thuật và lồng tiếng — tất cả trong một nơi, chỉ vài cú nhấp.</p>
              <div className="hero-actions">
                <button className="btn btn-primary">+ Dự án mới</button>
                <button className="btn btn-ghost">Xem hướng dẫn</button>
              </div>
            </div>
            <div className="hero-stats">
              {stats.map((s) => (
                <div key={s.label} className="stat">
                  <span className="stat-label">{s.label}</span>
                  <div className="stat-row">
                    <strong>{s.value}</strong>
                    <span className={`trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Bạn muốn làm gì hôm nay?</h2>
            </div>
            <div className="workflow-grid">
              {workflows.map((w) => (
                <button key={w.key} className="workflow-card">
                  <div className="workflow-icon" style={{ background: `${w.color}22`, color: w.color }}>
                    <Icon name={w.key} />
                  </div>
                  {w.badge ? <span className="workflow-badge">{w.badge}</span> : null}
                  <strong>{w.title}</strong>
                  <p>{w.desc}</p>
                  <span className="workflow-go">Bắt đầu →</span>
                </button>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <h2>Dự án gần đây</h2>
              <button className="link-btn">Xem tất cả</button>
            </div>
            <div className="project-list">
              {projects.map((p) => (
                <article key={p.title} className="project-row">
                  <div className="project-thumb" style={{ background: `${p.accent}22`, color: p.accent }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M8 5v14l11-7-11-7z" />
                    </svg>
                  </div>
                  <div className="project-info">
                    <strong>{p.title}</strong>
                    <span>{p.type} · {p.duration}</span>
                  </div>
                  <div className="project-progress">
                    {p.status === 'processing' ? (
                      <div className="bar">
                        <div className="bar-fill" style={{ width: `${p.progress}%`, background: p.accent }} />
                      </div>
                    ) : null}
                  </div>
                  <span className={`status status-${p.status}`}>{statusLabel[p.status]}</span>
                  <span className="project-time">{p.updated}</span>
                  <button className="icon-btn ghost" aria-label="Tùy chọn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="5" cy="12" r="1.6" />
                      <circle cx="12" cy="12" r="1.6" />
                      <circle cx="19" cy="12" r="1.6" />
                    </svg>
                  </button>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
