import { useState, useEffect } from 'react'

export default function QuestionBox({ question, onAnswer, timeLimit = 10 }) {
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
      onAnswer(-1, false) // timeout = wrong
      return
    }
    const t = setTimeout(() => setTimeLeft(p => p - 0.1), 100)
    return () => clearTimeout(t)
  }, [timeLeft, done, onAnswer])

  function handleSelect(idx) {
    if (done) return
    setDone(true)
    setSelected(idx)
    const correct = idx === question.ans
    setTimeout(() => onAnswer(idx, correct), 900)
  }

  function getOptStyle(idx) {
    if (!done && selected === null) return styles.opt
    if (idx === question.ans) return { ...styles.opt, ...styles.optCorrect }
    if (idx === selected && idx !== question.ans) return { ...styles.opt, ...styles.optWrong }
    return { ...styles.opt, opacity: 0.45 }
  }

  const pct = Math.max(0, (timeLeft / timeLimit) * 100)
  const barColor = pct > 50 ? '#4ade80' : pct > 25 ? '#facc15' : '#f87171'

  return (
    <div style={styles.overlay}>
      {/* Timer bar */}
      <div style={styles.timerTrack}>
        <div style={{ ...styles.timerBar, width: `${pct}%`, background: barColor }} />
      </div>

      <div style={styles.inner}>
        <div style={styles.qHeader}>
          <span style={styles.qBadge}>❓ Câu hỏi</span>
          <span style={styles.qTimer}>{Math.ceil(timeLeft)}s</span>
        </div>
        <p style={styles.qText}>{question.q}</p>
        <div style={styles.opts}>
          {question.opts.map((opt, i) => (
            <button key={i} style={getOptStyle(i)} onClick={() => handleSelect(i)}>
              <span style={styles.optLabel}>{['A', 'B', 'C', 'D'][i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    background: 'rgba(10, 15, 40, 0.97)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  timerTrack: {
    height: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
  },
  timerBar: {
    height: '100%', borderRadius: '2px', transition: 'width 0.1s linear, background 0.3s',
  },
  inner: { padding: '1.25rem 1.5rem' },
  qHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  qBadge: {
    background: 'rgba(255,215,0,0.15)', color: '#FFD700',
    padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
  },
  qTimer: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  qText: { margin: '0 0 1rem', color: '#fff', fontSize: '17px', fontWeight: 600, lineHeight: 1.4 },
  opts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' },
  opt: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '11px 14px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.07)',
    color: '#fff', fontSize: '14px', textAlign: 'left', cursor: 'pointer',
    transition: 'background 0.15s, border 0.15s',
    fontFamily: 'inherit',
  },
  optCorrect: {
    background: 'rgba(74,222,128,0.2)',
    border: '1px solid rgba(74,222,128,0.6)',
    color: '#4ade80',
  },
  optWrong: {
    background: 'rgba(248,113,113,0.2)',
    border: '1px solid rgba(248,113,113,0.6)',
    color: '#f87171',
  },
  optLabel: {
    minWidth: '24px', height: '24px', borderRadius: '6px',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700,
  },
}
