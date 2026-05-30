export function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </div>
      <section className="card pad soon">
        <div className="soon-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
        <strong>Đang phát triển</strong>
        <p>Tính năng này sẽ sớm có mặt. Hiện tại bạn có thể dùng ngay tính năng <b>Dịch thuật</b>.</p>
      </section>
    </div>
  );
}
