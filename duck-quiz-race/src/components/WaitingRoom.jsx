export default function WaitingRoom({ roomCode, players, isHost, myId, onStart }) {
  const playerList = Object.values(players)
  const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F']

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.headerIcon}>🏠</div>
          <div>
            <div style={s.headerTitle}>Phòng chờ</div>
            <div style={s.headerSub}>Chờ đủ người rồi bắt đầu thôi!</div>
          </div>
        </div>

        {/* Room code */}
        <div style={s.codeBox}>
          <div style={s.codeLabel}>📋 Mã phòng</div>
          <div style={s.code}>{roomCode}</div>
          <div style={s.codeHint}>Chia sẻ mã này cho bạn bè nhé! 📲</div>
        </div>

        {/* Players */}
        <div style={s.section}>
          <div style={s.sectionTitle}>👥 Người chơi ({playerList.length})</div>
          <div style={s.playerGrid}>
            {playerList.map((p, i) => (
              <div key={p.id} style={{ ...s.playerChip, background: colors[i % colors.length] + '30', border: `2px solid ${colors[i % colors.length]}`, outline: p.id === myId ? `3px solid #FFD700` : 'none' }}>
                <span style={{ fontSize: '22px' }}>{p.emoji}</span>
                <span style={s.playerName}>{p.name}</span>
                {p.id === myId && <span style={s.youTag}>bạn</span>}
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button style={{ ...s.startBtn, opacity: playerList.length < 1 ? 0.5 : 1 }} onClick={onStart} disabled={playerList.length < 1}>
            🚀 Bắt đầu đua!
          </button>
        ) : (
          <div style={s.waiting}>
            <div style={s.dots}>
              {[0,1,2].map(i => <span key={i} style={{ ...s.dot, animationDelay: `${i * 0.3}s` }} />)}
            </div>
            <span>Đang chờ host bắt đầu...</span>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes dotPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
      `}</style>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #4facfe 100%)',
    padding: '1rem', fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.96)', borderRadius: '28px',
    padding: '2rem', width: '100%', maxWidth: '440px',
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)', border: '3px solid #fff',
  },
  header: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerIcon: { fontSize: '40px', animation: 'bounce 2s ease-in-out infinite' },
  headerTitle: { fontSize: '22px', fontWeight: 800, color: '#333' },
  headerSub: { fontSize: '13px', color: '#888' },
  codeBox: {
    background: 'linear-gradient(135deg, #667eea20, #764ba220)',
    border: '2px dashed #764ba2', borderRadius: '20px',
    padding: '1.25rem', textAlign: 'center',
  },
  codeLabel: { fontSize: '13px', color: '#888', fontWeight: 600, marginBottom: '4px' },
  code: { fontSize: '52px', fontWeight: 900, letterSpacing: '10px', color: '#764ba2', lineHeight: 1 },
  codeHint: { fontSize: '12px', color: '#aaa', marginTop: '6px' },
  section: {},
  sectionTitle: { fontSize: '14px', fontWeight: 700, color: '#555', marginBottom: '10px' },
  playerGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  playerChip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    borderRadius: '99px', padding: '8px 16px',
    fontSize: '14px', fontWeight: 600, color: '#333',
  },
  playerName: { maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  youTag: {
    background: '#FFD700', color: '#5a3e00', fontSize: '10px',
    padding: '2px 8px', borderRadius: '99px', fontWeight: 800,
  },
  startBtn: {
    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
    background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    color: '#1a5e3a', fontWeight: 900, fontSize: '20px', cursor: 'pointer',
    boxShadow: '0 6px 0 #2da866', transition: 'transform 0.1s',
    fontFamily: 'inherit',
  },
  waiting: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '10px', padding: '1rem',
    color: '#888', fontSize: '14px', fontWeight: 600,
  },
  dots: { display: 'flex', gap: '4px' },
  dot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#764ba2', display: 'inline-block',
    animation: 'dotPulse 1.2s ease-in-out infinite',
  },
}