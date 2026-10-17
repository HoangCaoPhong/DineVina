import React from 'react'
import { Search, MapPin, Utensils, Calendar, Zap } from 'lucide-react'

interface HeroSectionProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedDistrict: string
  setSelectedDistrict: (d: string) => void
  selectedCuisine: string
  setSelectedCuisine: (c: string) => void
  activeQuickTag: string
  setActiveQuickTag: (tag: string) => void
  onSearch: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  setSelectedDistrict,
  selectedCuisine,
  setSelectedCuisine,
  activeQuickTag,
  setActiveQuickTag,
  onSearch
}) => {
  const categoryCircles = [
    { id: 'all', label: 'Tất cả', icon: '🍽️' },
    { id: 'deal_50', label: 'Giảm 50%', icon: '⚡' },
    { id: 'lau', label: 'Lẩu ngon', icon: '🍲' },
    { id: 'nuong', label: 'Nướng BBQ', icon: '🥩' },
    { id: 'buffet', label: 'Buffet', icon: '🍱' },
    { id: 'dimsum', label: 'Dimsum', icon: '🥟' },
    { id: 'mon_viet', label: 'Món Việt', icon: '🍚' },
    { id: 'private_room', label: 'Phòng riêng', icon: '🚪' }
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay-backdrop"></div>
        <div className="hero-content-wrap">
          <div className="hero-pill-badge">
            <Zap size={15} fill="currentColor" />
            HỆ THỐNG ĐẶT BÀN NHÀ HÀNG & ƯU ĐÃI GIỜ VÀNG DINEVINA
          </div>

          <h1 className="hero-title">
            Đặt Chỗ Nhà Hàng · <span>Giữ Chỗ Miễn Phí & Giảm Tới 50%</span>
          </h1>
          <p className="hero-subtitle">
            Khám phá các điểm ẩm thực chọn lọc tại TP.HCM. Đặt giữ chỗ trực tuyến tiện lợi, xác nhận trực tiếp cùng nhà hàng.
          </p>

          {/* PasGo Signature Floating Search Box */}
          <div className="search-card-wrapper">
            <div className="search-inputs-grid">
              {/* Keyword Search */}
              <div className="input-group">
                <Search size={18} color="#e51a24" />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tìm tên nhà hàng, món ăn (VD: Lẩu Hoàng Gia, Nướng Sakura, Cung Đình Dimsum)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* District Select */}
              <div className="input-group">
                <MapPin size={18} color="#e51a24" />
                <select
                  className="input-field"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                >
                  <option value="all">Tất cả khu vực</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 2">Quận 2 (Thảo Điền)</option>
                  <option value="Quận 3">Quận 3</option>
                  <option value="Quận 5">Quận 5</option>
                  <option value="Quận 7">Quận 7</option>
                </select>
              </div>

              {/* Cuisine Select */}
              <div className="input-group">
                <Utensils size={18} color="#e51a24" />
                <select
                  className="input-field"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  <option value="all">Tất cả ẩm thực</option>
                  <option value="Lẩu">Lẩu Đài Loan</option>
                  <option value="Nướng">Nướng Yakiniku</option>
                  <option value="Dimsum">Dimsum & Ẩm thực Hoa</option>
                  <option value="Món Việt">Món Việt truyền thống</option>
                  <option value="Buffet">Buffet Hải sản quốc tế</option>
                  <option value="Pizza">Pizza & Món Âu</option>
                </select>
              </div>

              {/* Booking Time preview */}
              <div className="input-group">
                <Calendar size={18} color="#e51a24" />
                <select className="input-field">
                  <option>Hôm nay (Giờ vàng)</option>
                  <option>Ngày mai</option>
                  <option>Cuối tuần này</option>
                </select>
              </div>

              {/* Search Button */}
              <button className="btn-search-primary" onClick={onSearch}>
                <Search size={16} />
                TÌM KIẾM
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PasGo Category Quick Circles Row */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 0' }}>
        <div className="category-circles-bar">
          {categoryCircles.map((cat) => (
            <button
              key={cat.id}
              className={`category-circle-item ${activeQuickTag === cat.id ? 'active' : ''}`}
              onClick={() => {
                setActiveQuickTag(cat.id)
                if (cat.id === 'lau') setSelectedCuisine('Lẩu')
                else if (cat.id === 'nuong') setSelectedCuisine('Nướng')
                else if (cat.id === 'buffet') setSelectedCuisine('Buffet')
                else if (cat.id === 'dimsum') setSelectedCuisine('Dimsum')
                else if (cat.id === 'mon_viet') setSelectedCuisine('Món Việt')
                else if (cat.id === 'all') setSelectedCuisine('all')
              }}
            >
              <div className="category-circle-icon">{cat.icon}</div>
              <span className="category-circle-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eatigo & PasGo Promo Banners Row */}
      <div style={{ maxWidth: '1200px', margin: '1.75rem auto 0', padding: '0 1.5rem' }}>
        <div className="promo-banners-row">
          <div className="promo-banner-card banner-1">
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
              ⚡ KHUNG GIỜ VÀNG
            </div>
            <div className="banner-title">Giảm 50% Khung Giờ Vàng</div>
            <div className="banner-sub">Áp dụng cho giờ thấp điểm 11:00 & 14:00 mỗi ngày</div>
          </div>

          <div className="promo-banner-card banner-2">
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
              🎉 ĐẶT TIỆC & SỰ KIỆN
            </div>
            <div className="banner-title">Đặt Tiệc Tặng Phòng Riêng VIP</div>
            <div className="banner-sub">Ưu đãi đoàn đông từ 15 khách, giảm thêm 10% bill thức ăn</div>
          </div>

          <div className="promo-banner-card banner-3">
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
              🏆 BỘ SƯU TẬP TUYỂN CHỌN
            </div>
            <div className="banner-title">Top Nhà Hàng Lẩu & Nướng 2026</div>
            <div className="banner-sub">Trải nghiệm ẩm thực Đài Loan & Nhật Bản chất lượng cao</div>
          </div>
        </div>
      </div>
    </>
  )
}
