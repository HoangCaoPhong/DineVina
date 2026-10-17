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
  address: string
  hours: string
  phone: string
  amenities: string[]
  description: string
}

type UserRole = 'customer' | 'partner' | 'admin'
type ReservationStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled'

type ReservationItem = {
  id: number
  venue: Venue
  date: string
  time: string
  guests: string
  note: string
  status: ReservationStatus
  code: string
  history: string[]
  reviewed?: boolean
}

type EventRequest = {
  id: number
  venueName: string
  occasion: string
  date: string
  guests: string
  budget: string
  needs: string
  status: 'Đã gửi' | 'Cần làm rõ' | 'Đã gửi đề xuất' | 'Đã chấp nhận'
  messages: string[]
}

type NotificationItem = { id: number; title: string; message: string; read: boolean }

const venues: Venue[] = [
  { id: 1, name: 'Bếp Nhà An', area: 'Quận 1', cuisine: 'Món Việt', price: '180K – 350K', rating: 4.9, reviews: 326, deal: 'Giảm 20%', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=85', tags: ['Phòng riêng', 'Đặt tiệc'], reason: 'Phù hợp nhóm 8–20 khách, có phòng riêng yên tĩnh.', address: '42 Nguyễn Huệ, Bến Nghé, Quận 1', hours: '10:00 – 22:30', phone: '028 3822 1688', amenities: ['Phòng riêng', 'Bãi đỗ xe', 'Ghế trẻ em', 'Xuất hóa đơn'], description: 'Không gian Việt đương đại với thực đơn vùng miền được chăm chút từ nguyên liệu địa phương.' },
  { id: 2, name: 'Sora Sushi Dining', area: 'Quận 3', cuisine: 'Món Nhật', price: '350K – 650K', rating: 4.8, reviews: 184, deal: 'Tặng món', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85', tags: ['Hẹn hò', 'Omakase'], reason: 'Không gian riêng tư, thực đơn theo mùa và quầy mở.', address: '18 Võ Văn Tần, Phường 6, Quận 3', hours: '11:00 – 14:00 · 17:30 – 22:30', phone: '028 3930 8899', amenities: ['Quầy sushi', 'Phòng riêng', 'Bãi đỗ xe'], description: 'Trải nghiệm sushi theo mùa trong không gian tối giản, phù hợp hẹn hò và tiếp khách.' },
  { id: 3, name: 'Lửa & Khói Rooftop', area: 'Bình Thạnh', cuisine: 'Nướng', price: '250K – 450K', rating: 4.7, reviews: 241, deal: 'Giảm 15%', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85', tags: ['Rooftop', 'Sinh nhật'], reason: 'View thành phố, hợp tiệc sinh nhật và nhóm bạn trẻ.', address: '92 Nguyễn Hữu Cảnh, Bình Thạnh', hours: '17:00 – 23:30', phone: '028 3512 6688', amenities: ['Rooftop', 'Trang trí tiệc', 'Âm nhạc', 'Bãi đỗ xe'], description: 'Bếp nướng lửa mở trên tầng thượng với tầm nhìn thành phố và thực đơn chia sẻ.' },
  { id: 4, name: 'Vườn Quê Saigon', area: 'Quận 7', cuisine: 'Món Việt', price: '200K – 400K', rating: 4.8, reviews: 412, deal: 'Giảm 10%', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85', tags: ['Sân vườn', 'Gia đình'], reason: 'Không gian xanh, có khu vui chơi nhỏ và ghế trẻ em.', address: '35 Nguyễn Thị Thập, Tân Phú, Quận 7', hours: '09:30 – 22:00', phone: '028 3775 2233', amenities: ['Sân vườn', 'Khu trẻ em', 'Ghế trẻ em', 'Bãi đỗ xe'], description: 'Nhà hàng sân vườn thoáng đãng dành cho các buổi sum họp gia đình.' },
  { id: 5, name: 'Maison de Mer', area: 'Thủ Đức', cuisine: 'Hải sản', price: '400K – 800K', rating: 4.9, reviews: 156, deal: 'Set từ 599K', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=900&q=85', tags: ['Tiếp khách', 'Phòng VIP'], reason: 'Hải sản theo ngày, phòng VIP có màn hình trình chiếu.', address: '12 Trần Não, An Khánh, Thủ Đức', hours: '10:30 – 23:00', phone: '028 3740 7788', amenities: ['Phòng VIP', 'Màn hình', 'Hầm rượu', 'Bãi đỗ xe'], description: 'Hải sản tươi theo ngày cùng phòng VIP được thiết kế cho tiếp khách và sự kiện.' },
  { id: 6, name: 'Mộc Chay Garden', area: 'Phú Nhuận', cuisine: 'Món chay', price: '120K – 280K', rating: 4.7, reviews: 298, deal: 'Giảm 12%', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tags: ['Yên tĩnh', 'Healthy'], reason: 'Thực đơn nhẹ nhàng, nhiều lựa chọn thuần chay.', address: '54 Hoa Lan, Phường 2, Phú Nhuận', hours: '07:00 – 21:30', phone: '028 3517 9090', amenities: ['Thuần chay', 'Sân vườn', 'Yên tĩnh', 'Take-away'], description: 'Không gian xanh yên tĩnh với thực đơn thuần chay cân bằng và nguyên liệu hữu cơ.' },
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

function SiteHeader({ isAbout = false, onAssistant, onAccount, onWorkspace, onNotifications, userName, unreadCount = 0 }: { isAbout?: boolean; onAssistant?: () => void; onAccount?: () => void; onWorkspace?: () => void; onNotifications?: () => void; userName?: string; unreadCount?: number }) {
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
          {userName && <button className="header-icon-button" onClick={onNotifications} aria-label={`Thông báo, ${unreadCount} chưa đọc`}>♢{unreadCount > 0 && <span>{unreadCount}</span>}</button>}
          {userName && <button className="ghost-button workspace-button" onClick={onWorkspace}>Lịch của tôi</button>}
          <button className="account-button" onClick={onAccount}>{userName || 'Đăng nhập'}</button>
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

function VenueCard({ venue, onBook, onDetail }: { venue: Venue; onBook: (venue: Venue) => void; onDetail: (venue: Venue) => void }) {
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
        <button className="detail-link" onClick={() => onDetail(venue)}>Xem chi tiết · Thực đơn · Đánh giá →</button>
        <div className="venue-footer"><div><strong>{venue.price}</strong><span>{venue.reviews} đánh giá</span></div><button className="primary-button small" onClick={() => onBook(venue)}>Đặt chỗ</button></div>
      </div>
    </article>
  )
}

function BookingModal({ venue, onClose, onSubmit }: { venue: Venue; onClose: () => void; onSubmit: (data: { date: string; time: string; guests: string; note: string }) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSubmit({ date: String(form.get('date')), time: String(form.get('time')), guests: String(form.get('guests')), note: String(form.get('note') || '') })
    setSubmitted(true)
  }

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
                <label>Ngày đến<input name="date" type="date" required defaultValue="2026-10-18" /></label>
                <label>Giờ đến<select name="time" defaultValue="19:00"><option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option><option>20:00</option></select></label>
                <label>Số khách<select name="guests" defaultValue="4"><option>2</option><option>4</option><option>6</option><option>8</option><option>10+</option></select></label>
                <label>Dịp đặc biệt<select defaultValue="Bữa tối"><option>Bữa tối</option><option>Sinh nhật</option><option>Tiếp khách</option><option>Tiệc gia đình</option></select></label>
              </div>
              <label>Yêu cầu thêm<textarea name="note" placeholder="Ví dụ: cần ghế trẻ em, phòng riêng..." /></label>
              <p className="demo-note">Dữ liệu trên trang chỉ phục vụ minh họa và không được gửi ra ngoài.</p>
              <button className="primary-button full" type="submit">Gửi yêu cầu đặt chỗ</button>
            </form>
          </>
        )}
      </section>
    </div>
  )
}

function VenueDetailModal({ venue, onClose, onBook }: { venue: Venue; onClose: () => void; onBook: (venue: Venue) => void }) {
  const [tab, setTab] = useState<'info' | 'menu' | 'reviews'>('info')
  const menu = [
    { name: `Khai vị ${venue.cuisine}`, description: 'Nguyên liệu theo mùa, trình bày tinh tế', price: '95.000đ', available: true },
    { name: 'Món đặc trưng của bếp', description: 'Công thức riêng được yêu thích tại nhà hàng', price: '245.000đ', available: true },
    { name: 'Set chia sẻ DineVina', description: 'Phù hợp nhóm 3–4 khách', price: '699.000đ', available: true },
    { name: 'Món theo mùa', description: 'Nhà hàng đang cập nhật nguyên liệu', price: 'Liên hệ', available: false },
  ]

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="feature-modal venue-detail-modal" role="dialog" aria-modal="true" aria-label={`Chi tiết ${venue.name}`} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Đóng">×</button>
        <div className="detail-cover"><img src={venue.image} alt={`Không gian ${venue.name}`} /><div><p className="eyebrow">{venue.cuisine} · {venue.area}</p><h2>{venue.name}</h2><p>★ {venue.rating} · {venue.reviews} đánh giá · {venue.price}</p></div></div>
        <div className="modal-tabs" role="tablist">
          <button className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>Tổng quan</button>
          <button className={tab === 'menu' ? 'active' : ''} onClick={() => setTab('menu')}>Thực đơn</button>
          <button className={tab === 'reviews' ? 'active' : ''} onClick={() => setTab('reviews')}>Đánh giá</button>
        </div>
        <div className="feature-modal-body">
          {tab === 'info' && <div className="detail-info"><p>{venue.description}</p><div className="detail-facts"><span><b>Địa chỉ</b>{venue.address}</span><span><b>Giờ mở cửa</b>{venue.hours}</span><span><b>Liên hệ</b>{venue.phone}</span></div><div><h3>Tiện ích nổi bật</h3><div className="tag-row">{venue.amenities.map((item) => <span key={item}>✓ {item}</span>)}</div></div></div>}
          {tab === 'menu' && <div><div className="detail-section-heading"><div><h3>Thực đơn tham khảo</h3><p>Cập nhật gần nhất hôm nay · Giá mang tính tham khảo</p></div></div><div className="menu-grid">{menu.map((dish) => <article className={!dish.available ? 'unavailable' : ''} key={dish.name}><div><h4>{dish.name}</h4><p>{dish.description}</p></div><strong>{dish.price}</strong>{!dish.available && <span>Tạm hết</span>}</article>)}</div></div>}
          {tab === 'reviews' && <div><div className="review-summary"><strong>{venue.rating}</strong><div><span>★★★★★</span><p>Từ {venue.reviews} lượt đánh giá đã xác minh</p></div></div><div className="review-list"><article><div><b>Minh Anh</b><span>★★★★★</span></div><p>Không gian đúng mô tả, nhân viên xác nhận bàn nhanh và món ăn vừa vị.</p><small>Đã dùng bữa · 12/10/2026</small></article><article><div><b>Thanh Nam</b><span>★★★★★</span></div><p>Đặt bàn thuận tiện, ưu đãi được giải thích rõ ràng.</p><small>Đã dùng bữa · 08/10/2026</small><blockquote>Nhà hàng: Cảm ơn bạn đã lựa chọn chúng tôi!</blockquote></article></div></div>}
        </div>
        <div className="feature-modal-footer"><span>Hủy miễn phí trước giờ dùng bữa 2 tiếng</span><button className="primary-button" onClick={() => { onClose(); onBook(venue) }}>Đặt bàn tại đây</button></div>
      </section>
    </div>
  )
}

function EventBookingModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: Omit<EventRequest, 'id' | 'status' | 'messages'>) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    onSubmit({ venueName: String(form.get('venueName')), occasion: String(form.get('occasion')), date: String(form.get('date')), guests: String(form.get('guests')), budget: String(form.get('budget')), needs: String(form.get('needs') || '') })
    setSubmitted(true)
  }
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="feature-modal compact-modal" role="dialog" aria-modal="true" aria-label="Gửi yêu cầu đặt tiệc" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button>{submitted ? <div className="booking-success"><span>✓</span><p className="eyebrow">Yêu cầu tiệc đã được gửi</p><h2>Đối tác sẽ phản hồi bằng đề xuất</h2><p>Bạn có thể theo dõi trao đổi và chấp nhận đề xuất trong mục <b>Lịch của tôi</b>.</p><button className="primary-button" onClick={onClose}>Hoàn tất</button></div> : <><div className="feature-modal-header"><p className="eyebrow">Đặt tiệc & sự kiện</p><h2>Cho chúng mình biết nhu cầu của bạn.</h2><p>Nhà hàng sẽ gửi gói thực đơn, mức giá và điều kiện để bạn duyệt.</p></div><form className="feature-form" onSubmit={submit}><div className="form-grid"><label>Nhà hàng<select name="venueName">{venues.filter((venue) => venue.tags.includes('Đặt tiệc') || venue.tags.includes('Sinh nhật') || venue.tags.includes('Phòng VIP')).map((venue) => <option key={venue.id}>{venue.name}</option>)}</select></label><label>Dịp tổ chức<select name="occasion"><option>Sinh nhật</option><option>Tiệc gia đình</option><option>Tiếp khách</option><option>Họp mặt công ty</option></select></label><label>Ngày tổ chức<input name="date" type="date" required defaultValue="2026-10-24" /></label><label>Số khách<input name="guests" type="number" min="6" defaultValue="20" required /></label><label>Ngân sách<select name="budget"><option>5–10 triệu</option><option>10–20 triệu</option><option>20–40 triệu</option><option>Trên 40 triệu</option></select></label><label>Liên hệ ưu tiên<select><option>Email</option><option>Điện thoại</option></select></label></div><label>Yêu cầu đặc biệt<textarea name="needs" placeholder="Không gian riêng, trang trí, máy chiếu, thực đơn chay..." /></label><button className="primary-button full" type="submit">Gửi yêu cầu nhận đề xuất</button></form></>}</section></div>
}

function AccountModal({ user, role, onClose, onLogin, onLogout, onRoleChange }: { user: string; role: UserRole; onClose: () => void; onLogin: (name: string, role: UserRole) => void; onLogout: () => void; onRoleChange: (role: UserRole) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [saved, setSaved] = useState(false)
  if (user) return <div className="modal-backdrop" onMouseDown={onClose}><section className="feature-modal compact-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="feature-modal-header"><p className="eyebrow">Hồ sơ & sở thích</p><h2>Xin chào, {user}</h2><p>Chọn vai trò demo và lưu sở thích để nhận gợi ý phù hợp hơn.</p></div><div className="feature-form"><label>Vai trò đang dùng<div className="role-switch">{(['customer', 'partner', 'admin'] as UserRole[]).map((item) => <button className={role === item ? 'active' : ''} key={item} onClick={() => onRoleChange(item)}>{item === 'customer' ? 'Thực khách' : item === 'partner' ? 'Đối tác' : 'Quản trị'}</button>)}</div></label><div className="form-grid"><label>Ẩm thực yêu thích<select><option>Món Việt</option><option>Món Nhật</option><option>Hải sản</option><option>Món chay</option></select></label><label>Khu vực thường chọn<select><option>Quận 1</option><option>Quận 3</option><option>Quận 7</option></select></label><label>Ngân sách/người<select><option>150K – 300K</option><option>300K – 500K</option><option>Trên 500K</option></select></label><label>Quy mô nhóm<select><option>2 người</option><option>4–6 người</option><option>8+ người</option></select></label></div>{saved && <p className="success-note">✓ Đã lưu hồ sơ và sở thích.</p>}<div className="modal-action-row"><button className="outline-button" onClick={onLogout}>Đăng xuất</button><button className="primary-button" onClick={() => setSaved(true)}>Lưu thay đổi</button></div></div></section></div>
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = new FormData(event.currentTarget); onLogin(String(form.get('name') || 'Minh Anh'), String(form.get('role')) as UserRole); onClose() }
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="feature-modal compact-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="feature-modal-header"><p className="eyebrow">DineVina Passport</p><h2>{mode === 'login' ? 'Đăng nhập để quản lý hành trình' : 'Tạo tài khoản DineVina'}</h2></div><div className="modal-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Đăng nhập</button><button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Đăng ký</button></div><form className="feature-form" onSubmit={submit}>{mode === 'register' && <label>Họ và tên<input name="name" required placeholder="Nguyễn Minh Anh" /></label>}<label>Email<input name="email" type="email" required defaultValue="minhanh@dinevina.vn" /></label><label>Mật khẩu<input type="password" required defaultValue="dinevina2026" /></label><label>Trải nghiệm với vai trò<select name="role"><option value="customer">Thực khách</option><option value="partner">Đối tác nhà hàng</option><option value="admin">Quản trị viên</option></select></label><button className="primary-button full" type="submit">{mode === 'login' ? 'Đăng nhập bản demo' : 'Tạo tài khoản'}</button><button className="text-button" type="button">Quên mật khẩu? Nhận liên kết qua email</button></form></section></div>
}

function WorkspaceModal({ role, reservations, events, onClose, onReservationStatus, onReview, onEventAccept }: { role: UserRole; reservations: ReservationItem[]; events: EventRequest[]; onClose: () => void; onReservationStatus: (id: number, status: ReservationStatus) => void; onReview: (id: number) => void; onEventAccept: (id: number) => void }) {
  const initialTab = role === 'partner' ? 'partner' : role === 'admin' ? 'admin' : 'bookings'
  const [tab, setTab] = useState<'bookings' | 'events' | 'partner' | 'admin'>(initialTab)
  const [message, setMessage] = useState('')
  const tabs: Array<{ key: typeof tab; label: string }> = [{ key: 'bookings', label: 'Đặt bàn' }, { key: 'events', label: 'Sự kiện' }]
  if (role === 'partner') tabs.push({ key: 'partner', label: 'Kênh đối tác' })
  if (role === 'admin') tabs.push({ key: 'admin', label: 'Quản trị' })
  const showSuccess = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(''), 2600) }
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="feature-modal workspace-modal" role="dialog" aria-modal="true" aria-label="Trung tâm DineVina" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="feature-modal-header"><p className="eyebrow">Trung tâm DineVina</p><h2>{role === 'partner' ? 'Vận hành nhà hàng' : role === 'admin' ? 'Kiểm duyệt nền tảng' : 'Hành trình của tôi'}</h2></div><div className="modal-tabs">{tabs.map((item) => <button className={tab === item.key ? 'active' : ''} key={item.key} onClick={() => setTab(item.key)}>{item.label}</button>)}</div>{message && <div className="workspace-message">✓ {message}</div>}<div className="feature-modal-body workspace-body">
    {tab === 'bookings' && <div><div className="detail-section-heading"><div><h3>Lịch đặt bàn</h3><p>Trạng thái đồng bộ với nhà hàng · Hủy trước giờ dùng bữa 2 tiếng</p></div><span>{reservations.length} yêu cầu</span></div><div className="record-list">{reservations.length === 0 ? <div className="empty-inline">Bạn chưa có yêu cầu đặt bàn.</div> : reservations.map((item) => <article key={item.id}><img src={item.venue.image} alt="" /><div className="record-main"><div className="record-title"><h4>{item.venue.name}</h4><span className={`status-chip ${item.status.toLowerCase()}`}>{item.status}</span></div><p>{item.date} · {item.time} · {item.guests} khách · Mã {item.code}</p><details><summary>Lịch sử trạng thái</summary>{item.history.map((entry) => <small key={entry}>{entry}</small>)}</details></div><div className="record-actions">{(item.status === 'Pending' || item.status === 'Confirmed') && <button className="outline-button" onClick={() => onReservationStatus(item.id, 'Cancelled')}>Hủy bàn</button>}{item.status === 'Confirmed' && !item.reviewed && <button className="primary-button small" onClick={() => { onReview(item.id); showSuccess('Đã gửi đánh giá 5 sao') }}>★ Đánh giá</button>}{item.reviewed && <span className="reviewed-label">✓ Đã đánh giá</span>}</div></article>)}</div></div>}
    {tab === 'events' && <div><div className="detail-section-heading"><div><h3>Yêu cầu tiệc & trao đổi</h3><p>Theo dõi đề xuất, điều kiện và lịch sử hội thoại</p></div><span>{events.length} yêu cầu</span></div><div className="event-request-list">{events.length === 0 ? <div className="empty-inline">Bạn chưa gửi yêu cầu sự kiện.</div> : events.map((item) => <article key={item.id}><div className="record-title"><h4>{item.occasion} · {item.venueName}</h4><span className="status-chip confirmed">{item.status}</span></div><p>{item.date} · {item.guests} khách · {item.budget}</p><div className="event-thread">{item.messages.map((entry) => <span key={entry}>{entry}</span>)}</div>{item.status === 'Đã gửi đề xuất' && <button className="primary-button small" onClick={() => onEventAccept(item.id)}>Chấp nhận đề xuất</button>}</article>)}</div></div>}
    {tab === 'partner' && <div><div className="dashboard-stats"><span><b>{reservations.filter((item) => item.status === 'Pending').length}</b>Chờ xác nhận</span><span><b>{reservations.filter((item) => item.status === 'Confirmed').length}</b>Đã xác nhận</span><span><b>{events.length}</b>Khách hỏi tiệc</span><span><b>14 phút</b>Phản hồi TB</span></div><h3>Yêu cầu đặt bàn mới</h3><div className="record-list compact">{reservations.filter((item) => item.status === 'Pending').map((item) => <article key={item.id}><div className="record-main"><h4>{item.venue.name} · {item.guests} khách</h4><p>{item.date} lúc {item.time} · {item.note || 'Không có ghi chú'}</p></div><div className="record-actions"><button className="outline-button" onClick={() => onReservationStatus(item.id, 'Rejected')}>Từ chối</button><button className="primary-button small" onClick={() => onReservationStatus(item.id, 'Confirmed')}>Xác nhận</button></div></article>)}</div><div className="partner-tools"><form onSubmit={(event) => { event.preventDefault(); showSuccess('Đã nộp hồ sơ nhà hàng, trạng thái: Submitted') }}><h3>Hồ sơ nhà hàng</h3><input required placeholder="Tên nhà hàng" /><input required placeholder="Địa chỉ & quận" /><input required placeholder="Ẩm thực · Khoảng giá" /><button className="outline-button">Lưu nháp & gửi duyệt</button></form><form onSubmit={(event) => { event.preventDefault(); showSuccess('Đã cập nhật giờ mở cửa và sức chứa') }}><h3>Lịch mở cửa & sức chứa</h3><input defaultValue="Thứ 2–CN · 10:00–22:30" /><input defaultValue="40 khách / khung 30 phút" /><button className="outline-button">Cập nhật khả dụng</button></form><form onSubmit={(event) => { event.preventDefault(); showSuccess('Đã thêm món và ưu đãi mới') }}><h3>Thực đơn & ưu đãi</h3><input placeholder="Tên món · Giá · Tình trạng" /><input placeholder="Ưu đãi · Thời hạn · Điều kiện" /><button className="outline-button">Thêm nội dung</button></form></div></div>}
    {tab === 'admin' && <div><div className="dashboard-stats"><span><b>3</b>Hồ sơ chờ duyệt</span><span><b>120</b>Đang hoạt động</span><span><b>2</b>Nội dung cần xem</span><span><b>1</b>Đánh giá bị báo cáo</span></div><div className="admin-queue"><article><div><h4>Nhà hàng Mùa Vàng</h4><p>Onboarding · Hồ sơ đầy đủ · Quận 1</p></div><button className="primary-button small" onClick={() => showSuccess('Đã phê duyệt và lưu lịch sử quyết định')}>Phê duyệt</button></article><article><div><h4>Ưu đãi “Buffet 0 đồng”</h4><p>Cần kiểm tra điều kiện và thời hạn hiển thị</p></div><button className="outline-button" onClick={() => showSuccess('Đã ẩn nội dung và gửi lý do cho đối tác')}>Ẩn & phản hồi</button></article><article><div><h4>Đánh giá bị báo cáo</h4><p>Kiểm duyệt theo tiêu chuẩn cộng đồng</p></div><button className="outline-button" onClick={() => showSuccess('Đã ghi nhận quyết định kiểm duyệt')}>Xem xét</button></article></div></div>}
  </div></section></div>
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
            <div className="vision-stats"><span><b>03</b>Nhóm người dùng</span><span><b>11</b>Nhóm chức năng</span><span><b>04</b>Giai đoạn AI</span></div>
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
  const [amenity, setAmenity] = useState('Tất cả tiện ích')
  const [sort, setSort] = useState('Phù hợp nhất')
  const [priceRange, setPriceRange] = useState('Giá trung bình')
  const [purpose, setPurpose] = useState('Phù hợp')
  const [offer, setOffer] = useState('Ưu đãi')
  const [privateRoom, setPrivateRoom] = useState('Phòng riêng')
  const [meal, setMeal] = useState('Bữa ăn hàng ngày')
  const [businessType, setBusinessType] = useState('Loại hình kinh doanh')
  const [serviceType, setServiceType] = useState('Kiểu phục vụ')
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [detailVenue, setDetailVenue] = useState<Venue | null>(null)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [eventOpen, setEventOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState<UserRole>('customer')
  const [reservations, setReservations] = useState<ReservationItem[]>([
    { id: 1, venue: venues[1], date: '2026-10-20', time: '19:00', guests: '4', note: 'Bàn yên tĩnh gần cửa sổ', status: 'Confirmed', code: 'DV1020', history: ['18/10 · Gửi yêu cầu — Pending', '18/10 · Sora Sushi xác nhận — Confirmed'] },
  ])
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([
    { id: 1, venueName: 'Lửa & Khói Rooftop', occasion: 'Sinh nhật', date: '2026-10-26', guests: '24', budget: '10–20 triệu', needs: 'Trang trí tối giản', status: 'Đã gửi đề xuất', messages: ['Bạn: Cần không gian riêng cho 24 khách.', 'Nhà hàng: Đã gửi gói 14,8 triệu gồm menu và trang trí.'] },
  ])
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'Bàn đã được xác nhận', message: 'Sora Sushi Dining xác nhận bàn lúc 19:00 ngày 20/10.', read: false },
    { id: 2, title: 'Đề xuất tiệc mới', message: 'Lửa & Khói Rooftop đã gửi gói tiệc cho 24 khách.', read: false },
  ])
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
    const matchesAmenity = amenity === 'Tất cả tiện ích' || venue.amenities.includes(amenity) || venue.tags.includes(amenity)
    const minimumPrice = Number(venue.price.match(/\d+/)?.[0] || 0)
    const matchesPrice = priceRange === 'Giá trung bình' || (priceRange === 'Dưới 200K' && minimumPrice < 200) || (priceRange === '200K – 400K' && minimumPrice >= 200 && minimumPrice <= 400) || (priceRange === 'Trên 400K' && minimumPrice >= 400)
    const matchesPurpose = purpose === 'Phù hợp' || venue.tags.includes(purpose) || venue.amenities.includes(purpose)
    const discount = Number(venue.deal.match(/\d+/)?.[0] || 0)
    const matchesOffer = offer === 'Ưu đãi' || (offer === 'Có ưu đãi' && venue.deal.length > 0) || (offer === 'Ưu đãi từ 15%' && discount >= 15)
    const matchesPrivateRoom = privateRoom === 'Phòng riêng' || venue.tags.includes('Phòng riêng') || venue.amenities.includes('Phòng riêng') || venue.tags.includes('Phòng VIP')
    const matchesMeal = meal === 'Bữa ăn hàng ngày' || meal === 'Bữa tối' || (meal === 'Bữa trưa' && !venue.hours.startsWith('17')) || (meal === 'Ăn khuya' && venue.hours.includes('23'))
    const matchesBusinessType = businessType === 'Loại hình kinh doanh' || `${venue.tags.join(' ')} ${venue.amenities.join(' ')} ${venue.cuisine}`.includes(businessType)
    const matchesService = serviceType === 'Kiểu phục vụ' || serviceType === 'Phục vụ tại bàn' || (serviceType === 'Omakase' && venue.tags.includes('Omakase')) || (serviceType === 'Set menu' && venue.deal.includes('Set'))
    return matchesQuery && matchesArea && matchesCategory && matchesAmenity && matchesPrice && matchesPurpose && matchesOffer && matchesPrivateRoom && matchesMeal && matchesBusinessType && matchesService
  }).sort((first, second) => sort === 'Đánh giá cao' ? second.rating - first.rating : sort === 'Giá thấp trước' ? Number(first.price.match(/\d+/)?.[0] || 0) - Number(second.price.match(/\d+/)?.[0] || 0) : second.reviews - first.reviews), [amenity, area, businessType, category, meal, offer, priceRange, privateRoom, purpose, query, serviceType, sort])

  const activeFilters = [
    area !== 'Tất cả khu vực' ? area : '', category !== 'Tất cả' ? category : '', priceRange !== 'Giá trung bình' ? priceRange : '', purpose !== 'Phù hợp' ? purpose : '', offer !== 'Ưu đãi' ? offer : '', privateRoom !== 'Phòng riêng' ? privateRoom : '', meal !== 'Bữa ăn hàng ngày' ? meal : '', businessType !== 'Loại hình kinh doanh' ? businessType : '', serviceType !== 'Kiểu phục vụ' ? serviceType : '', amenity !== 'Tất cả tiện ích' ? amenity : '',
  ].filter(Boolean)
  const clearFilters = () => { setArea('Tất cả khu vực'); setCategory('Tất cả'); setAmenity('Tất cả tiện ích'); setPriceRange('Giá trung bình'); setPurpose('Phù hợp'); setOffer('Ưu đãi'); setPrivateRoom('Phòng riêng'); setMeal('Bữa ăn hàng ngày'); setBusinessType('Loại hình kinh doanh'); setServiceType('Kiểu phục vụ') }

  const unreadCount = notifications.filter((item) => !item.read).length
  const requireAccount = (action: () => void) => userName ? action() : setAccountOpen(true)
  const addNotification = (title: string, message: string) => setNotifications((items) => [{ id: Date.now(), title, message, read: false }, ...items])
  const createReservation = (venue: Venue, data: { date: string; time: string; guests: string; note: string }) => {
    setReservations((items) => [{ id: Date.now(), venue, ...data, status: 'Pending', code: `DV${String(Date.now()).slice(-4)}`, history: [`Vừa xong · Gửi yêu cầu — Pending`] }, ...items])
    addNotification('Đã gửi yêu cầu đặt bàn', `${venue.name} đang kiểm tra khả dụng cho ${data.guests} khách.`)
  }
  const updateReservationStatus = (id: number, status: ReservationStatus) => {
    setReservations((items) => items.map((item) => item.id === id ? { ...item, status, history: [...item.history, `Vừa xong · Cập nhật — ${status}`] } : item))
    addNotification(`Đặt bàn: ${status}`, 'Trạng thái mới đã được đồng bộ giữa thực khách và nhà hàng.')
  }
  const modalAccount = accountOpen && <AccountModal user={userName} role={role} onClose={() => setAccountOpen(false)} onLogin={(name, nextRole) => { setUserName(name); setRole(nextRole); addNotification('Chào mừng đến DineVina', 'Hồ sơ demo đã sẵn sàng để trải nghiệm.') }} onLogout={() => { setUserName(''); setRole('customer'); setAccountOpen(false); setWorkspaceOpen(false) }} onRoleChange={setRole} />

  if (isAboutPage) {
    return (
      <div className="app-shell about-page">
        <SiteHeader isAbout onAccount={() => setAccountOpen(true)} userName={userName} unreadCount={unreadCount} />
        <main><AboutContent /></main>
        <SiteFooter />
        {modalAccount}
      </div>
    )
  }

  return (
    <div id="top" className="app-shell">
      <SiteHeader onAssistant={() => setAssistantOpen(true)} onAccount={() => setAccountOpen(true)} onWorkspace={() => requireAccount(() => setWorkspaceOpen(true))} onNotifications={() => setNotificationsOpen((value) => !value)} userName={userName} unreadCount={unreadCount} />

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

        <section className="top-filter-section content-width" aria-label="Tìm và lọc nhà hàng">
          <div className="pasgo-filter-shell" aria-label="Bộ lọc nhà hàng">
            <div className="pasgo-filter-bar">
              <label><span>⌖</span><select aria-label="Khu vực" value={area} onChange={(event) => setArea(event.target.value)}><option>Tất cả khu vực</option><option>Quận 1</option><option>Quận 3</option><option>Quận 7</option><option>Bình Thạnh</option><option>Phú Nhuận</option><option>Thủ Đức</option></select></label>
              <label><span>₫</span><select aria-label="Giá trung bình" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}><option>Giá trung bình</option><option>Dưới 200K</option><option>200K – 400K</option><option>Trên 400K</option></select></label>
              <label><span>♨</span><select aria-label="Đồ ăn chính" value={category} onChange={(event) => setCategory(event.target.value)}><option value="Tất cả">Đồ ăn chính</option><option>Món Việt</option><option>Món Nhật</option><option>Nướng</option><option>Hải sản</option><option>Món chay</option><option>Đặt tiệc</option></select></label>
              <label><span>◎</span><select aria-label="Phù hợp" value={purpose} onChange={(event) => setPurpose(event.target.value)}><option>Phù hợp</option><option>Gia đình</option><option>Hẹn hò</option><option>Đặt tiệc</option><option>Tiếp khách</option><option>Sinh nhật</option><option>Sân vườn</option></select></label>
              <label><span>%</span><select aria-label="Ưu đãi" value={offer} onChange={(event) => setOffer(event.target.value)}><option>Ưu đãi</option><option>Có ưu đãi</option><option>Ưu đãi từ 15%</option></select></label>
              <label><span>▣</span><select aria-label="Phòng riêng" value={privateRoom} onChange={(event) => setPrivateRoom(event.target.value)}><option>Phòng riêng</option><option>Có phòng riêng</option></select></label>
              <button className={advancedFiltersOpen ? 'active' : ''} onClick={() => setAdvancedFiltersOpen((value) => !value)}>☷ Bộ lọc khác <span>{advancedFiltersOpen ? '−' : '+'}</span></button>
            </div>
            {advancedFiltersOpen && <div className="advanced-filter-panel">
              <label>Bữa ăn<select value={meal} onChange={(event) => setMeal(event.target.value)}><option>Bữa ăn hàng ngày</option><option>Bữa trưa</option><option>Bữa tối</option><option>Ăn khuya</option></select></label>
              <label>Loại hình<select value={businessType} onChange={(event) => setBusinessType(event.target.value)}><option>Loại hình kinh doanh</option><option>Rooftop</option><option>Sân vườn</option><option>Món chay</option><option>Phòng VIP</option></select></label>
              <label>Kiểu phục vụ<select value={serviceType} onChange={(event) => setServiceType(event.target.value)}><option>Kiểu phục vụ</option><option>Phục vụ tại bàn</option><option>Omakase</option><option>Set menu</option></select></label>
              <label>Tiện ích<select value={amenity} onChange={(event) => setAmenity(event.target.value)}><option>Tất cả tiện ích</option><option>Phòng riêng</option><option>Bãi đỗ xe</option><option>Sân vườn</option><option>Ghế trẻ em</option><option>Khu trẻ em</option></select></label>
              <label>Sắp xếp<select value={sort} onChange={(event) => setSort(event.target.value)}><option>Phù hợp nhất</option><option>Đánh giá cao</option><option>Giá thấp trước</option></select></label>
            </div>}
            {activeFilters.length > 0 && <div className="active-filter-row"><span>Đang lọc:</span>{activeFilters.map((item) => <b key={item}>{item}</b>)}<button onClick={clearFilters}>Xóa tất cả</button></div>}
          </div>
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
          {filteredVenues.length > 0 ? <div className="venue-grid">{filteredVenues.map((venue) => <VenueCard key={venue.id} venue={venue} onBook={(item) => requireAccount(() => setSelectedVenue(item))} onDetail={setDetailVenue} />)}</div> : <div className="empty-state"><span>⌕</span><h3>Chưa tìm thấy lựa chọn phù hợp</h3><p>Thử nới lỏng một vài tiêu chí trong bộ lọc.</p><button className="ghost-button" onClick={() => { setQuery(''); clearFilters() }}>Xóa bộ lọc</button></div>}
        </section>

        <section id="events" className="event-section"><div className="content-width event-inner" data-reveal><div><p className="eyebrow light">Dành cho khoảnh khắc đặc biệt</p><h2>Đặt tiệc không còn là một bài toán khó.</h2><p>Gửi nhu cầu một lần, nhận gợi ý địa điểm phù hợp với số khách, không gian và ngân sách.</p><div className="event-stats"><span><b>01</b>Tìm đúng địa điểm</span><span><b>02</b>Gửi yêu cầu tiệc</span><span><b>03</b>Nhà hàng xác nhận</span></div></div><button className="cream-button" onClick={() => requireAccount(() => setEventOpen(true))}>Gửi yêu cầu đặt tiệc</button></div></section>
        <section id="for-partners" className="partner-section content-width" data-reveal><div><p className="eyebrow">DineVina for Business</p><h2>Biến bàn trống thành cơ hội mới.</h2><p>Đăng không gian, quản lý thực đơn và tiếp nhận yêu cầu đặt bàn từ đúng nhóm khách hàng.</p></div><button className="outline-button" onClick={() => userName && role === 'partner' ? setWorkspaceOpen(true) : setAccountOpen(true)}>Trở thành đối tác →</button></section>
      </main>

      <SiteFooter />
      <button className="ai-fab" onClick={() => setAssistantOpen((value) => !value)} aria-label="Mở trợ lý AI">✦</button>
      {notificationsOpen && userName && <aside className="notification-panel"><div className="panel-heading"><div><p className="eyebrow">Cập nhật mới</p><h3>Thông báo</h3></div><button onClick={() => setNotificationsOpen(false)}>×</button></div>{notifications.map((item) => <button className={item.read ? 'read' : ''} key={item.id} onClick={() => setNotifications((items) => items.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry))}><b>{item.title}</b><span>{item.message}</span></button>)}<button className="mark-all-button" onClick={() => setNotifications((items) => items.map((item) => ({ ...item, read: true })))}>Đánh dấu tất cả đã đọc</button></aside>}
      {assistantOpen && <aside className="assistant-panel"><button className="modal-close" onClick={() => setAssistantOpen(false)}>×</button><div className="assistant-icon">✦</div><p className="eyebrow">Dine AI · Demo</p><h2>Hôm nay bạn muốn một bữa ăn thế nào?</h2><p>Mình có thể gợi ý theo dịp, số người, ngân sách và không gian bạn thích.</p><div className="suggestion-list"><button onClick={() => { setCategory('Gia đình'); setAssistantOpen(false) }}>👨‍👩‍👧 Ăn tối gia đình, có trẻ nhỏ</button><button onClick={() => { setCategory('Đặt tiệc'); setAssistantOpen(false) }}>🎉 Sinh nhật khoảng 10 người</button><button onClick={() => { setQuery('yên tĩnh'); setAssistantOpen(false) }}>🌿 Không gian yên tĩnh, nhẹ nhàng</button></div><small>Gợi ý dựa trên dữ liệu mẫu, chưa phải kết quả AI thực tế.</small></aside>}
      {selectedVenue && <BookingModal venue={selectedVenue} onClose={() => setSelectedVenue(null)} onSubmit={(data) => createReservation(selectedVenue, data)} />}
      {detailVenue && <VenueDetailModal venue={detailVenue} onClose={() => setDetailVenue(null)} onBook={(item) => requireAccount(() => setSelectedVenue(item))} />}
      {eventOpen && <EventBookingModal onClose={() => setEventOpen(false)} onSubmit={(request) => { setEventRequests((items) => [{ ...request, id: Date.now(), status: 'Đã gửi', messages: ['Bạn: Đã gửi yêu cầu sự kiện đến nhà hàng.'] }, ...items]); addNotification('Đã gửi yêu cầu tiệc', `${request.venueName} sẽ phản hồi bằng đề xuất.`) }} />}
      {modalAccount}
      {workspaceOpen && <WorkspaceModal role={role} reservations={reservations} events={eventRequests} onClose={() => setWorkspaceOpen(false)} onReservationStatus={updateReservationStatus} onReview={(id) => setReservations((items) => items.map((item) => item.id === id ? { ...item, reviewed: true } : item))} onEventAccept={(id) => { setEventRequests((items) => items.map((item) => item.id === id ? { ...item, status: 'Đã chấp nhận', messages: [...item.messages, 'Bạn: Đã chấp nhận đề xuất.'] } : item)); addNotification('Đề xuất đã được chấp nhận', 'Điều khoản sự kiện đã được lưu trong lịch sử trao đổi.') }} />}
    </div>
  )
}

export default App
