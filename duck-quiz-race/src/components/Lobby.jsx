import { useState } from 'react'

export default function Lobby({ onCreateRoom, onJoinRoom, error }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    await onCreateRoom(name.trim())
    setLoading(false)
  }

  async function handleJoin() {
    if (!name.trim() || !code.trim()) return
    setLoading(true)
    await onJoinRoom(name.trim(), code.trim())
    setLoading(false)
  }

  return (
    <div style={s.page}>
      {/* Floating bubbles */}
      {['🦆','🌊','⭐','🎲','🏆','🌟'].map((e, i) => (
        <div key={i} style={{ ...s.bubble, left: `${10 + i * 15}%`, animationDelay: `${i * 0.4}s`, fontSize: `${20 + i * 4}px` }}>{e}</div>
      ))}

      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.duckBig}>🦆</div>
          <div style={s.titleWrap}>
            <div style={s.title}>Duck Quiz</div>
            <div style={s.titleAccent}>Race!</div>
          </div>
        </div>
        <p style={s.tagline}>🏁 Đua vịt · Trả lời câu hỏi · Về đích trước!</p>

        <div style={s.inputWrap}>
          <span style={s.inputIcon}>😄</span>
          <input
            style={s.input}
            placeholder="Tên của bạn..."
            value={name}
            maxLength={14}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (mode === 'join' ? handleJoin() : handleCreate())}
          />
        </div>

        {!mode && (
          <div style={s.btnRow}>
            <button style={{ ...s.btn, ...s.btnGreen }} onClick={() => setMode('create')}>🏠 Tạo phòng</button>
            <button style={{ ...s.btn, ...s.btnBlue }} onClick={() => setMode('join')}>🔑 Vào phòng</button>
          </div>
        )}

        {mode === 'create' && (
          <div style={s.col}>
            <button style={{ ...s.btn, ...s.btnGreen, width: '100%', opacity: loading ? 0.7 : 1 }} onClick={handleCreate} disabled={loading || !name.trim()}>
              {loading ? '⏳ Đang tạo...' : '🚀 Tạo phòng ngay!'}
            </button>
            <button style={s.back} onClick={() => setMode(null)}>← Quay lại</button>
          </div>
        )}

        {mode === 'join' && (
          <div style={s.col}>
            <div style={s.inputWrap}>
              <span style={s.inputIcon}>🔑</span>
              <input
                style={{ ...s.input, letterSpacing: '8px', textAlign: 'center', textTransform: 'uppercase', fontWeight: 700 }}
                placeholder="MÃ PHÒNG"
                value={code}
                maxLength={4}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
            </div>
            <button style={{ ...s.btn, ...s.btnBlue, width: '100%', opacity: loading ? 0.7 : 1 }} onClick={handleJoin} disabled={loading || !name.trim() || !code.trim()}>
              {loading ? '⏳ Đang vào...' : '✅ Vào phòng!'}
            </button>
            <button style={s.back} onClick={() => { setMode(null); setCode('') }}>← Quay lại</button>
          </div>
        )}

        {error && <div style={s.error}>⚠️ {error}</div>}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
      `}</style>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #4facfe 100%)',
    padding: '1rem', fontFamily: "'Segoe UI', system-ui, sans-serif", position: 'relative', overflow: 'hidden',
  },
  bubble: {
    position: 'absolute', bottom: '-10%',
    animation: 'floatUp 6s ease-in infinite',
    pointerEvents: 'none', zIndex: 0,
  },
  card: {
    background: 'rgba(255,255,255,0.95)', borderRadius: '28px',
    padding: '2.5rem 2rem', width: '100%', maxWidth: '400px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 4px rgba(255,255,255,0.5)',
    position: 'relative', zIndex: 1,
    border: '3px solid #fff',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '12px' },
  duckBig: { fontSize: '64px', animation: 'pulse 2s ease-in-out infinite', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' },
  titleWrap: { display: 'flex', flexDirection: 'column', lineHeight: 1.1 },
  title: { fontSize: '30px', fontWeight: 900, color: '#333', letterSpacing: '-1px' },
  titleAccent: { fontSize: '36px', fontWeight: 900, background: 'linear-gradient(90deg, #f093fb, #f5576c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  tagline: { margin: 0, fontSize: '13px', color: '#888', textAlign: 'center' },
  inputWrap: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: '#f5f5f5', borderRadius: '14px', padding: '4px 14px',
    border: '2px solid #e8e8e8', width: '100%', boxSizing: 'border-box',
    transition: 'border 0.2s',
  },
  inputIcon: { fontSize: '18px' },
  input: {
    flex: 1, border: 'none', background: 'transparent', padding: '10px 0',
    fontSize: '15px', outline: 'none', color: '#333',
  },
  btnRow: { display: 'flex', gap: '10px', width: '100%' },
  btn: {
    flex: 1, padding: '13px', borderRadius: '14px', border: 'none',
    fontWeight: 800, fontSize: '15px', cursor: 'pointer',
    transition: 'transform 0.1s, box-shadow 0.1s', boxSizing: 'border-box',
    boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
  },
  btnGreen: { background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#1a6e4a' },
  btnBlue: { background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: '#1a4a6e' },
  btnYellow: { background: 'linear-gradient(135deg, #f9d423, #ff4e50)', color: '#5a2a00' },
  col: { display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' },
  back: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '13px', alignSelf: 'center' },
  error: {
    background: '#fff0f0', border: '2px solid #ffcdd2', color: '#c62828',
    borderRadius: '12px', padding: '10px 14px', fontSize: '13px', width: '100%',
    textAlign: 'center', boxSizing: 'border-box', fontWeight: 600,
  },
}