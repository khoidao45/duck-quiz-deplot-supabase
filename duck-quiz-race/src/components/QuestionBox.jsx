import { useState, useEffect } from 'react'

const OPT_COLORS = [
  { bg: '#FF6B6B20', border: '#FF6B6B', text: '#c0392b', label: '#FF6B6B' },
  { bg: '#4ECDC420', border: '#4ECDC4', text: '#1a7a74', label: '#4ECDC4' },
  { bg: '#45B7D120', border: '#45B7D1', text: '#1a6080', label: '#45B7D1' },
  { bg: '#F7DC6F20', border: '#F7DC6F', text: '#7a6000', label: '#F7DC6F' },
]

export default function QuestionBox({ question, onAnswer, timeLimit = 12 }) {
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setSelected(null)
    setTimeLeft(timeLimit)
    setDone(false)
  }, [question, timeLimit])

  useEffect(() => {
    if (done) return
    if (timeLeft <= 0) {
      setDone(true)
      onAnswer(-1, false, true)
      return
    }
    const t = setTimeout(() => setTimeLeft(p => +(p - 0.1).toFixed(2)), 100)
    return () => clearTimeout(t)
  }, [timeLeft, done, onAnswer])

  function handleSelect(idx) {
    if (done) return
    setDone(true)
    setSelected(idx)
    setTimeout(() => onAnswer(idx, idx === question.ans, false), 900)
  }

  function getOptStyle(idx) {
    const base = { ...s.opt, background: OPT_COLORS[idx].bg, borderColor: OPT_COLORS[idx].border, color: OPT_COLORS[idx].text }
    if (!done) return base
    if (idx === question.ans) return { ...base, background: '#43e97b30', borderColor: '#43e97b', color: '#1a6e3a', transform: 'scale(1.02)' }
    if (idx === selected) return { ...base, background: '#ff6b6b30', borderColor: '#ff6b6b', color: '#c0392b' }
    return { ...base, opacity: 0.4 }
  }

  const pct = Math.max(0, (timeLeft / timeLimit) * 100)
  const timerColor = pct > 50 ? '#43e97b' : pct > 25 ? '#f9d423' : '#ff6b6b'
  const urgency = pct < 25

  return (
    <div style={s.overlay}>
      {/* Timer */}
      <div style={s.timerWrap}>
        <div style={{ ...s.timerBar, width: `${pct}%`, background: timerColor }} />
      </div>

      <div style={s.inner}>
        {/* Header */}
        <div style={s.qHeader}>
          <div style={s.qBadge}>❓ Câu hỏi</div>
          <div style={{ ...s.timer, color: urgency ? '#ff6b6b' : '#888', fontWeight: urgency ? 900 : 600, fontSize: urgency ? '18px' : '14px' }}>
            {Math.ceil(timeLeft)}s
          </div>
        </div>
        <div style={s.rule}>✅ +2~4 bước · ❌ -1 bước · ⏰ đứng yên</div>

        {/* Question */}
        <div style={s.qText}>{question.q}</div>

        {/* Options */}
        <div style={s.opts}>
          {question.opts.map((opt, i) => (
            <button key={i} style={getOptStyle(i)} onClick={() => handleSelect(i)}>
              <span style={{ ...s.optLabel, background: OPT_COLORS[i].label, color: '#fff' }}>
                {['A','B','C','D'][i]}
              </span>
              <span style={s.optText}>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'rgba(255,255,255,0.98)',
    borderTop: '3px solid #764ba2',
    borderRadius: '20px 20px 0 0',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
  },
  timerWrap: { height: '6px', background: '#f0f0f0', borderRadius: '3px 3px 0 0', overflow: 'hidden' },
  timerBar: { height: '100%', transition: 'width 0.1s linear, background 0.3s', borderRadius: '3px' },
  inner: { padding: '1rem 1.25rem 1.25rem' },
  qHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  qBadge: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff', padding: '4px 12px', borderRadius: '99px',
    fontSize: '12px', fontWeight: 700,
  },
  timer: { transition: 'all 0.3s' },
  rule: { fontSize: '11px', color: '#aaa', marginBottom: '10px', fontWeight: 500 },
  qText: { fontSize: '16px', fontWeight: 700, color: '#333', lineHeight: 1.4, marginBottom: '12px' },
  opts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  opt: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '14px', border: '2px solid',
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
    fontFamily: 'inherit', boxSizing: 'border-box',
  },
  optLabel: {
    minWidth: '26px', height: '26px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 900, flexShrink: 0,
  },
  optText: { fontSize: '13px', fontWeight: 600, lineHeight: 1.3 },
}