import { useState } from 'react';
import { loadLibrary, removeLibraryItem, clearLibrary, type LibraryItem, type LibraryKind } from '../library';
import { saveTextFile } from '../download';

const KIND_LABEL: Record<LibraryKind, string> = {
  transcribe: 'Ghi âm → Văn bản',
  subtitle: 'Phụ đề',
  translate: 'Dịch thuật',
  voice: 'Lồng tiếng',
};

const KIND_COLOR: Record<LibraryKind, string> = {
  transcribe: '#6366f1',
  subtitle: '#10b981',
  translate: '#f59e0b',
  voice: '#ec4899',
};

function fmtTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>(() => loadLibrary());
  const [error, setError] = useState('');

  function remove(id: string) {
    setItems(removeLibraryItem(id));
  }

  function clearAll() {
    clearLibrary();
    setItems([]);
  }

  async function exportItem(it: LibraryItem, kind: 'txt' | 'srt' | 'vtt') {
    const content = kind === 'srt' ? it.srt : kind === 'vtt' ? it.vtt : it.text;
    if (!content) return;
    const safe = it.title.replace(/[^\p{L}\p{N}\-_ ]/gu, '').slice(0, 60) || 'export';
    try {
      await saveTextFile(content, `${safe}.${kind}`);
    } catch (e) {
      setError('Không lưu được file: ' + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Thư viện</h1>
          <p>Kho kết quả đã xử lý, lưu ngay trên máy. Mở lại và xuất file bất cứ lúc nào.</p>
        </div>
        {items.length ? (
          <button className="btn btn-ghost dark" onClick={clearAll}>Xóa tất cả</button>
        ) : null}
      </div>

      {error ? <div className="alert error">{error}</div> : null}

      {items.length === 0 ? (
        <section className="card pad soon">
          <div className="soon-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4v16M9 4v16M13 5l5 15M3 4h6m0 0h4" />
            </svg>
          </div>
          <strong>Chưa có mục nào</strong>
          <p>Kết quả từ Ghi âm, Phụ đề, Dịch thuật sẽ tự lưu vào đây để bạn dùng lại.</p>
        </section>
      ) : (
        <div className="project-list">
          {items.map((it) => (
            <article key={it.id} className="project-row">
              <div className="project-thumb" style={{ background: `${KIND_COLOR[it.kind]}22`, color: KIND_COLOR[it.kind] }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 5h16v14H4zM4 9h16" />
                </svg>
              </div>
              <div className="project-info">
                <strong>{it.title}</strong>
                <span>{KIND_LABEL[it.kind]} · {fmtTime(it.createdAt)}</span>
              </div>
              <div className="row" style={{ gap: 8 }}>
                {it.text ? <button className="link-btn" onClick={() => exportItem(it, 'txt')}>Tải .txt</button> : null}
                {it.srt ? <button className="link-btn" onClick={() => exportItem(it, 'srt')}>Tải .srt</button> : null}
                {it.vtt ? <button className="link-btn" onClick={() => exportItem(it, 'vtt')}>Tải .vtt</button> : null}
                <button className="link-btn danger" onClick={() => remove(it.id)}>Xóa</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
