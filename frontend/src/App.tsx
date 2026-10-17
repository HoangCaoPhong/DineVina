import { FormEvent, useEffect, useMemo, useState } from 'react'

type Venue = {
  id: number
  name: string
  area: string
  cuisine: string
  price: string
  rating: number
  reviews: number
  deal: string
  image: string
  tags: string[]
  reason: string
}

const venues: Venue[] = [
  { id: 1, name: 'Bếp Nhà An', area: 'Quận 1', cuisine: 'Món Việt', price: '180K – 350K', rating: 4.9, reviews: 326, deal: 'Giảm 20%', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85', tags: ['Phòng riêng', 'Đặt tiệc'], reason: 'Phù hợp nhóm 8–20 khách, có phòng riêng yên tĩnh.' },
  { id: 2, name: 'Sora Sushi Dining', area: 'Quận 3', cuisine: 'Món Nhật', price: '350K – 650K', rating: 4.8, reviews: 184, deal: 'Tặng món', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85', tags: ['Hẹn hò', 'Omakase'], reason: 'Không gian riêng tư, thực đơn theo mùa và quầy mở.' },
  { id: 3, name: 'Lửa & Khói Rooftop', area: 'Bình Thạnh', cuisine: 'Nướng', price: '250K – 450K', rating: 4.7, reviews: 241, deal: 'Giảm 15%', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', tags: ['Rooftop', 'Sinh nhật'], reason: 'View thành phố, hợp tiệc sinh nhật và nhóm bạn trẻ.' },
  { id: 4, name: 'Vườn Quê Saigon', area: 'Quận 7', cuisine: 'Món Việt', price: '200K – 400K', rating: 4.8, reviews: 412, deal: 'Giảm 10%', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85', tags: ['Sân vườn', 'Gia đình'], reason: 'Không gian xanh, có khu vui chơi nhỏ và ghế trẻ em.' },
  { id: 5, name: 'Maison de Mer', area: 'Thủ Đức', cuisine: 'Hải sản', price: '400K – 800K', rating: 4.9, reviews: 156, deal: 'Set từ 599K', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=85', tags: ['Tiếp khách', 'Phòng VIP'], reason: 'Hải sản theo ngày, phòng VIP có màn hình trình chiếu.' },
  { id: 6, name: 'Mộc Chay Garden', area: 'Phú Nhuận', cuisine: 'Món chay', price: '120K – 280K', rating: 4.7, reviews: 298, deal: 'Giảm 12%', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tags: ['Yên tĩnh', 'Healthy'], reason: 'Thực đơn nhẹ nhàng, nhiều lựa chọn thuần chay.' },
]

const categories = [
  ['🍲', 'Lẩu'], ['🥩', 'Nướng'], ['🍣', 'Món Nhật'], ['🦐', 'Hải sản'],
  ['🥗', 'Món chay'], ['🎉', 'Đặt tiệc'], ['👨‍👩‍👧', 'Gia đình'],
]

const teamMembers = [
  { initials: 'HP', name: 'Hoàng Cao Phong', role: 'Group Leader · AI & Integration', studentId: '24127486' },
  { initials: 'MN', name: 'Võ Mỹ Ngọc', role: 'Product · UX & Frontend', studentId: '24127294' },
  { initials: 'TN', name: 'Lương Thiện Nhân', role: 'Restaurant Data & Research', studentId: '24127475' },
  { initials: 'TK', name: 'Nguyễn Trung Kiên', role: 'Backend · API & Database', studentId: '24127068' },
  { initials: 'KD', name: 'Trương Khánh Duy', role: 'Recommendation & Evaluation', studentId: '24127160' },
]

function Logo() {
  return <a className="brand" href="/" aria-label="DineVina - Trang chủ"><span className="brand-mark">D</span><span>Dine<span>Vina</span></span></a>
}

function SiteHeader({ isAbout = false, onAssistant }: { isAbout?: boolean; onAssistant?: () => void }) {
  return (
    <>
      <div className="announcement">Bản demo học phần · Dữ liệu nhà hàng chỉ mang tính minh họa</div>
      <header className="site-header">
        <Logo />
        <nav aria-label="Điều hướng chính">
          <a className={isAbout ? '' : 'active'} href="/#restaurants">Khám phá</a>
          <a href="/#deals">Ưu đãi</a>
          <a href="/#events">Đặt tiệc</a>
          <a className={isAbout ? 'active' : ''} href="/gioi-thieu">Giới thiệu</a>
          <a href="/#for-partners">Dành cho nhà hàng</a>
        </nav>
        <div className="header-actions">
          {!isAbout && <button className="ghost-button" onClick={onAssistant}>✦ Trợ lý AI</button>}
          <button className="account-button">Đăng nhập</button>
        </div>
      </header>
    </>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="content-width footer-inner">
        <p>Prototype cho môn Introduction to Software Engineering · Group 8</p>
        <span>© 2026 DineVina</span>
      </div>
      <div className="footer-divider" />
      <section className="content-width business-info" aria-labelledby="business-info-title">
        <div className="business-info-heading">
          <Logo />
          <h2 id="business-info-title">THÔNG TIN DOANH NGHIỆP</h2>
          <address className="business-contact-list">
            <p><b>Địa chỉ:</b> 227 Nguyễn Văn Cừ, phường Chợ Quán, TP Hồ Chí Minh</p>
            <p><b>Email:</b> <a href="mailto:hoangcaophong.works@gmail.com">hoangcaophong.works@gmail.com</a></p>
          </address>
        </div>
      </section>
    </footer>
  )
}

function VenueCard({ venue, onBook }: { venue: Venue; onBook: (venue: Venue) => void }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="venue-card" data-reveal>
      <div className="venue-image-wrap">
        <img className="venue-image" src={venue.image} alt={`Không gian ${venue.name}`} />
        <span className="deal-badge">{venue.deal}</span>
        <button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => setSaved((value) => !value)} aria-label={saved ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}>{saved ? '♥' : '♡'}</button>
      </div>
      <div className="venue-content">
        <div className="venue-heading"><div><p className="venue-type">{venue.cuisine}</p><h3>{venue.name}</h3></div><span className="rating">★ {venue.rating}</span></div>
        <p className="venue-address">⌖ {venue.area}, TP. Hồ Chí Minh</p>
        <div className="tag-row">{venue.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="ai-reason"><b>✦ Hợp gu của bạn</b><span>{venue.reason}</span></div>
        <div className="venue-footer"><div><strong>{venue.price}</strong><span>{venue.reviews} đánh giá</span></div><button className="primary-button small" onClick={() => onBook(venue)}>Đặt chỗ</button></div>
      </div>
    </article>
  )
}

function BookingModal({ venue, onClose }: { venue: Venue; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); setSubmitted(true) }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-label="Đặt chỗ" onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Đóng">×</button>
        {submitted ? (
          <div className="booking-success"><span>✓</span><p className="eyebrow">Yêu cầu đã được ghi nhận</p><h2>Cảm ơn bạn!</h2><p>Đây là bản demo. Trong sản phẩm thật, <b>{venue.name}</b> sẽ xác nhận yêu cầu qua thông báo và số điện thoại của bạn.</p><button className="primary-button" onClick={onClose}>Tiếp tục khám phá</button></div>
        ) : (
          <>
            <div className="modal-venue"><img src={venue.image} alt="" /><div><p className="eyebrow">Đặt chỗ nhanh</p><h2>{venue.name}</h2><span>{venue.area} · {venue.deal}</span></div></div>
            <form onSubmit={submit}>
              <div className="form-grid">
                <label>Ngày đến<input type="date" required defaultValue="2026-10-18" /></label>
                <label>Giờ đến<select defaultValue="19:00"><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option></select></label>
                <label>Số khách<select defaultValue="4"><option>2</option><option>4</option><option>6</option><option>8</option><option>10+</option></select></label>
                <label>Dịp đặc biệt<select defaultValue="Bữa tối"><option>Bữa tối</option><option>Sinh nhật</option><option>Tiếp khách</option><option>Tiệc gia đình</option></select></label>
              </div>
              <label>Yêu cầu thêm<textarea placeholder="Ví dụ: cần ghế trẻ em, phòng riêng..." /></label>
              <p className="demo-note">Dữ liệu trên trang chỉ phục vụ minh họa và không được gửi ra ngoài.</p>
              <button className="primary-button full" type="submit">Gửi yêu cầu đặt chỗ</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

function AboutContent() {
  return (
    <section className="about-section">
      <div className="content-width">
        <a className="back-home-link" href="/">← Về trang chủ</a>
        <div className="about-overview" data-reveal>
          <div className="about-copy">
            <p className="eyebrow">Về DineVina</p>
            <h1>Nền tảng kết nối những bữa ăn đáng nhớ.</h1>
            <p>DineVina là nền tảng đặt bàn và đặt tiệc thông minh, kết nối thực khách với các nhà hàng phù hợp tại Việt Nam. Khách hàng có thể khám phá địa điểm, xem thực đơn và ưu đãi, tìm không gian theo nhu cầu rồi gửi yêu cầu đặt chỗ trên cùng một trải nghiệm.</p>
            <p>Với đối tác nhà hàng, DineVina mở ra một kênh tiếp cận khách hàng mới, hỗ trợ giới thiệu không gian, quản lý thông tin thực đơn và tiếp nhận nhu cầu đặt bàn hoặc tổ chức sự kiện.</p>
            <div className="about-pill-row"><span>Khám phá nhà hàng</span><span>Đặt bàn & đặt tiệc</span><span>Gợi ý thông minh</span></div>
          </div>
          <div className="about-vision-card">
            <span className="vision-orbit orbit-one" />
            <span className="vision-orbit orbit-two" />
            <div className="vision-mark">D</div>
            <p>Smart Restaurant Reservation<br />& Event Booking System</p>
            <div className="vision-stats"><span><b>03</b>Nhóm người dùng</span><span><b>09</b>Nhóm chức năng</span><span><b>04</b>Giai đoạn AI</span></div>
          </div>
        </div>

        <div className="team-heading" data-reveal>
          <div><p className="eyebrow">Đội ngũ phát triển</p><h2>Group 8 · CSC13002</h2></div>
          <p>Năm thành viên cùng làm việc theo định hướng full-stack, mỗi người dẫn dắt một mảng chuyên môn và cùng chịu trách nhiệm cho chất lượng sản phẩm.</p>
        </div>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <article className="team-card" data-reveal key={member.studentId}>
              <div className={`team-avatar avatar-${index + 1}`}>{member.initials}</div>
              <div><h3>{member.name}</h3><p>{member.role}</p><span>{member.studentId}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('Tất cả khu vực')
  const [category, setCategory] = useState('Tất cả')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const isAboutPage = window.location.pathname.replace(/\/$/, '') === '/gioi-thieu'

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -48px' })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  const filteredVenues = useMemo(() => venues.filter((venue) => {
    const matchesQuery = `${venue.name} ${venue.cuisine} ${venue.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const matchesArea = area === 'Tất cả khu vực' || venue.area === area
    const matchesCategory = category === 'Tất cả' || venue.cuisine.includes(category) || venue.tags.includes(category)
    return matchesQuery && matchesArea && matchesCategory
  }), [area, category, query])

  if (isAboutPage) {
    return (
      <div className="app-shell about-page">
        <SiteHeader isAbout />
        <main><AboutContent /></main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div id="top" className="app-shell">
      <SiteHeader onAssistant={() => setAssistantOpen(true)} />

      <main>
        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-float hero-float-left"><span>✦</span><b>AI gợi ý đúng gu</b><small>Theo dịp & ngân sách</small></div>
          <div className="hero-float hero-float-right"><span>✓</span><b>Đặt bàn 19:00</b><small>Xác nhận trong vài phút</small></div>
          <div className="hero-copy"><span className="hero-label">Dine local. Feel Vietnam.</span><h1>Một chỗ ngồi đẹp.<br /><em>Một bữa ăn đáng nhớ.</em></h1><p>Khám phá nhà hàng đúng gu, chọn không gian phù hợp và đặt bàn trong vài phút.</p></div>
          <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
            <label className="search-field wide"><span>⌕</span><div><small>Bạn muốn ăn gì?</small><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tên nhà hàng, món ăn..." /></div></label>
            <label className="search-field"><span>⌖</span><div><small>Khu vực</small><select value={area} onChange={(event) => setArea(event.target.value)}><option>Tất cả khu vực</option><option>Quận 1</option><option>Quận 3</option><option>Quận 7</option><option>Bình Thạnh</option><option>Phú Nhuận</option><option>Thủ Đức</option></select></div></label>
            <label className="search-field"><span>◷</span><div><small>Thời gian</small><select><option>Tối nay · 19:00</option><option>Trưa nay · 12:00</option><option>Ngày mai · 19:00</option></select></div></label>
            <button className="primary-button search-submit" type="submit">Tìm bàn</button>
          </form>
          <div className="trust-row"><span><b>120+</b> nhà hàng tuyển chọn</span><span><b>4.8/5</b> trải nghiệm trung bình</span><span><b>0đ</b> phí đặt chỗ</span></div>
        </section>

        <section className="category-section" aria-label="Danh mục nổi bật">
          <button className={`category-item ${category === 'Tất cả' ? 'active' : ''}`} onClick={() => setCategory('Tất cả')}><span>✦</span><b>Tất cả</b></button>
          {categories.map(([icon, label]) => <button key={label} className={`category-item ${category === label ? 'active' : ''}`} onClick={() => setCategory(label)}><span>{icon}</span><b>{label}</b></button>)}
        </section>

        <section id="deals" className="promo-section content-width">
          <article className="promo-card coral" data-reveal><div><span>DEAL CUỐI TUẦN</span><h2>Đi đông, vui hơn.<br />Giảm đến 25%</h2><button onClick={() => setCategory('Đặt tiệc')}>Khám phá ngay →</button></div><div className="promo-illustration">🍽️</div></article>
          <article className="promo-card dark" data-reveal><div><span>GỢI Ý BỞI DINE AI</span><h2>Chưa biết ăn gì?<br />Kể mình nghe nhé.</h2><button onClick={() => setAssistantOpen(true)}>Thử trợ lý AI →</button></div><div className="promo-illustration">✦</div></article>
        </section>

        <section id="restaurants" className="restaurants-section content-width">
          <div className="section-heading" data-reveal><div><p className="eyebrow">Tuyển chọn cho bạn</p><h2>Nhà hàng nổi bật tại Sài Gòn</h2><p>Không gian đẹp, thông tin rõ ràng và có thể gửi yêu cầu đặt chỗ.</p></div><span className="result-count">{filteredVenues.length} kết quả</span></div>
          {filteredVenues.length > 0 ? <div className="venue-grid">{filteredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} onBook={setSelectedVenue} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Chưa tìm thấy lựa chọn phù hợp</h3><p>Thử đổi từ khóa, khu vực hoặc chọn lại danh mục.</p><button className="ghost-button" onClick={() => { setQuery(''); setArea('Tất cả khu vực'); setCategory('Tất cả') }}>Xóa bộ lọc</button></div>}
        </section>

        <section id="events" className="event-section"><div className="content-width event-inner" data-reveal><div><p className="eyebrow light">Dành cho khoảnh khắc đặc biệt</p><h2>Đặt tiệc không còn là một bài toán khó.</h2><p>Gửi nhu cầu một lần, nhận gợi ý địa điểm phù hợp với số khách, không gian và ngân sách.</p><div className="event-stats"><span><b>01</b>Tìm đúng địa điểm</span><span><b>02</b>Gửi yêu cầu tiệc</span><span><b>03</b>Nhà hàng xác nhận</span></div></div><button className="cream-button" onClick={() => setCategory('Đặt tiệc')}>Tìm nơi tổ chức tiệc</button></div></section>
        <section id="for-partners" className="partner-section content-width" data-reveal><div><p className="eyebrow">DineVina for Business</p><h2>Biến bàn trống thành cơ hội mới.</h2><p>Đăng không gian, quản lý thực đơn và tiếp nhận yêu cầu đặt bàn từ đúng nhóm khách hàng.</p></div><button className="outline-button">Trở thành đối tác →</button></section>
      </main>

      <SiteFooter />
      <button className="ai-fab" onClick={() => setAssistantOpen((value) => !value)} aria-label="Mở trợ lý AI">✦</button>
      {assistantOpen && <aside className="assistant-panel"><button className="modal-close" onClick={() => setAssistantOpen(false)}>×</button><div className="assistant-icon">✦</div><p className="eyebrow">Dine AI · Demo</p><h2>Hôm nay bạn muốn một bữa ăn thế nào?</h2><p>Mình có thể gợi ý theo dịp, số người, ngân sách và không gian bạn thích.</p><div className="suggestion-list"><button onClick={() => { setCategory('Gia đình'); setAssistantOpen(false) }}>👨‍👩‍👧 Ăn tối gia đình, có trẻ nhỏ</button><button onClick={() => { setCategory('Đặt tiệc'); setAssistantOpen(false) }}>🎉 Sinh nhật khoảng 10 người</button><button onClick={() => { setQuery('yên tĩnh'); setAssistantOpen(false) }}>🌿 Không gian yên tĩnh, nhẹ nhàng</button></div><small>Gợi ý dựa trên dữ liệu mẫu, chưa phải kết quả AI thực tế.</small></aside>}
      {selectedVenue && <BookingModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} />}
    </div>
  )
}

export default App
