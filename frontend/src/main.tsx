import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Đang kết nối API…')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json() as Promise<{ status: string }>
      })
      .then((data) => setApiStatus(data.status === 'ok' ? 'API hoạt động' : 'API lỗi'))
      .catch(() => setApiStatus('Chưa kết nối được API'))
  }, [])

  return (
    <main className="container">
      <span className="eyebrow">Group 8 · CSC13002</span>
      <h1>DineVina</h1>
      <p className="lead">Smart Restaurant Reservation & Event Booking System</p>
      <p>Nền tảng kết nối thực khách với nhà hàng để khám phá món ăn, đặt bàn và gửi yêu cầu tổ chức sự kiện.</p>
      <div className="status">{apiStatus}</div>
      <section>
        <h2>Lộ trình sản phẩm</h2>
        <ul>
          <li>Khám phá và lọc nhà hàng, xem thực đơn và ưu đãi</li>
          <li>Đặt bàn, gửi yêu cầu sự kiện và quản lý lịch đặt</li>
          <li>Trang quản lý dành cho đối tác nhà hàng</li>
          <li>Gợi ý phù hợp, chatbot và số hóa thực đơn bằng AI</li>
        </ul>
        <p className="note">Đây là trang khởi tạo. Các tính năng trên đang nằm trong kế hoạch phát triển.</p>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
