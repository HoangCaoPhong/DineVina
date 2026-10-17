import React, { useState } from 'react'
import {
  Sparkles,
  X,
  Send,
  MapPin,
  Bot,
  ArrowRight
} from 'lucide-react'
import { Venue } from '../types'
import { askAI } from '../api'

interface AIAssistantModalProps {
  onClose: () => void
  onSelectVenue: (venue: Venue) => void
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  onClose,
  onSelectVenue
}) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
    query: string
    explanation: string
    suggestions: Venue[]
  } | null>(null)

  const quickPrompts = [
    'Tìm quán lẩu có phòng riêng cho 6 người',
    'Quán nướng BBQ giảm 50% giờ trưa',
    'Nhà hàng món Việt tiếp khách quận 1',
    'Buffet hải sản cho tiệc gia đình cuối tuần'
  ]

  const handleSearch = async (text: string) => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const data = await askAI(text)
      setResponse(data)
    } catch (err: any) {
      alert('Lỗi AI hỗ trợ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>DineVina AI Assistant</h2>
                <span className="ai-header-badge">Group 9 AI</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                Tư vấn chọn quán & đề xuất món ăn thông minh theo nhu cầu thực tế
              </div>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Quick Prompts */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              💡 Gợi ý câu hỏi nhanh:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  className="ai-prompt-suggestion"
                  onClick={() => {
                    setQuery(p)
                    handleSearch(p)
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Hỏi AI: Bạn muốn ăn gì, mấy người, ở đâu, ngân sách bao nhiêu?..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(query)
              }}
              style={{ flex: 1 }}
            />
            <button
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', padding: '0 1.25rem' }}
              onClick={() => handleSearch(query)}
              disabled={loading}
            >
              {loading ? 'Đang phân tích...' : <Send size={16} />}
            </button>
          </div>

          {/* AI Response Card */}
          {response && (
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} />
                Lời khuyên từ DineVina AI:
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {response.explanation}
              </p>

              {/* Suggestions Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
                {response.suggestions.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-xs)'
                    }}
                  >
                    <img
                      src={v.cover_image}
                      alt={v.name}
                      style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b', marginBottom: '3px' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <MapPin size={12} color="var(--pasgo-red)" />
                        {v.district} · {v.cuisine}
                      </div>

                      {v.max_discount > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--pasgo-red)', fontWeight: 800, marginBottom: '8px' }}>
                          ⚡ Giảm tới {v.max_discount}% theo khung giờ
                        </div>
                      )}

                      <button
                        className="btn-primary"
                        style={{ marginTop: 'auto', padding: '0.45rem', fontSize: '0.8rem', width: '100%' }}
                        onClick={() => {
                          onClose()
                          onSelectVenue(v)
                        }}
                      >
                        Đặt bàn nhà hàng này
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
