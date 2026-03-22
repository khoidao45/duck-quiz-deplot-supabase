import { useState } from 'react'

export default function Lobby({ onCreateRoom, onJoinRoom, error }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState(null) // null | 'create' | 'join'
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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.duckIcon}>🦆</div>
        <h1 style={styles.title}>Duck Quiz Race</h1>
        <p style={styles.subtitle}>Đua vịt · Trả lời câu hỏi · Về đích trước!</p>

        <input
          style={styles.input}
          placeholder="Tên của bạn..."
          value={name}
          maxLength={14}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (mode === 'join' ? handleJoin() : handleCreate())}
        />

        {!mode && (
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => setMode('create')}>
              🏠 Tạo phòng
            </button>
            <button style={styles.btnSecondary} onClick={() => setMode('join')}>
              🔑 Vào phòng
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div style={styles.actionArea}>
            <button
              style={{ ...styles.btnPrimary, width: '100%', opacity: loading ? 0.7 : 1 }}
              onClick={handleCreate}
              disabled={loading || !name.trim()}
            >
              {loading ? '⏳ Đang tạo...' : '🚀 Tạo phòng ngay'}
            </button>
            <button style={styles.backBtn} onClick={() => setMode(null)}>← Quay lại</button>
          </div>
        )}

        {mode === 'join' && (
          <div style={styles.actionArea}>
            <input
              style={{ ...styles.input, letterSpacing: '6px', textAlign: 'center', textTransform: 'uppercase' }}
              placeholder="MÃ PHÒNG"
              value={code}
              maxLength={4}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
            <button
              style={{ ...styles.btnPrimary, width: '100%', opacity: loading ? 0.7 : 1 }}
              onClick={handleJoin}
              disabled={loading || !name.trim() || !code.trim()}
            >
              {loading ? '⏳ Đang vào...' : '✅ Vào phòng'}
            </button>
            <button style={styles.backBtn} onClick={() => { setMode(null); setCode('') }}>← Quay lại</button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '24px',
    padding: '2.5rem 2rem',
    width: '100%', maxWidth: '380px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  duckIcon: { fontSize: '72px', filter: 'drop-shadow(0 4px 12px rgba(255,215,0,0.4))' },
  title: { margin: 0, fontSize: '32px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' },
  subtitle: { margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  input: {
    width: '100%', padding: '12px 16px',
    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)', color: '#fff',
    fontSize: '16px', outline: 'none',
    boxSizing: 'border-box',
  },
  btnRow: { display: 'flex', gap: '10px', width: '100%' },
  btnPrimary: {
    flex: 1, padding: '13px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#3a2600', fontWeight: 700, fontSize: '15px',
    cursor: 'pointer', transition: 'transform 0.1s',
  },
  btnSecondary: {
    flex: 1, padding: '13px', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
  },
  actionArea: { width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' },
  backBtn: {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer', fontSize: '13px', alignSelf: 'center',
  },
  error: {
    background: 'rgba(220,50,50,0.2)', border: '1px solid rgba(220,50,50,0.5)',
    color: '#ff9999', borderRadius: '10px', padding: '10px 14px',
    fontSize: '13px', width: '100%', textAlign: 'center', boxSizing: 'border-box',
  },
}
