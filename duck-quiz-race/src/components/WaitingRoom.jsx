export default function WaitingRoom({ roomCode, players, isHost, myId, onStart }) {
  const playerList = Object.values(players)

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <p style={styles.label}>Mã phòng của bạn</p>
        <div style={styles.codeBox}>{roomCode}</div>
        <p style={styles.hint}>📲 Chia sẻ mã này cho bạn bè!</p>

        <div style={styles.divider} />

        <p style={styles.playersTitle}>Người chơi ({playerList.length})</p>
        <div style={styles.playersList}>
          {playerList.map(p => (
            <div key={p.id} style={{
              ...styles.playerChip,
              border: p.id === myId ? '1.5px solid #FFD700' : '1px solid rgba(255,255,255,0.2)',
            }}>
              <span style={{ fontSize: '22px' }}>{p.emoji}</span>
              <span>{p.name}</span>
              {p.id === myId && <span style={styles.youBadge}>bạn</span>}
            </div>
          ))}
        </div>

        {isHost ? (
          <button
            style={{
              ...styles.startBtn,
              opacity: playerList.length < 1 ? 0.5 : 1,
            }}
            onClick={onStart}
            disabled={playerList.length < 1}
          >
            🚀 Bắt đầu đua!
          </button>
        ) : (
          <div style={styles.waitMsg}>
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span style={styles.dot} />
            <span>Chờ host bắt đầu...</span>
          </div>
        )}
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
    padding: '2rem',
    width: '100%', maxWidth: '420px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
  },
  label: { margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px' },
  codeBox: {
    fontSize: '52px', fontWeight: 800, color: '#FFD700',
    letterSpacing: '14px', textShadow: '0 0 30px rgba(255,215,0,0.3)',
  },
  hint: { margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  divider: { width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)' },
  playersTitle: { margin: 0, color: '#fff', fontWeight: 600, fontSize: '15px', alignSelf: 'flex-start' },
  playersList: {
    display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%',
    justifyContent: 'flex-start',
  },
  playerChip: {
    display: 'flex', alignItems: 'center', gap: '8px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '99px', padding: '8px 14px',
    color: '#fff', fontSize: '14px',
  },
  youBadge: {
    background: 'rgba(255,215,0,0.2)', color: '#FFD700',
    fontSize: '11px', padding: '2px 7px', borderRadius: '99px',
    fontWeight: 600,
  },
  startBtn: {
    width: '100%', padding: '15px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#3a2600', fontWeight: 700, fontSize: '18px',
    cursor: 'pointer', marginTop: '0.5rem',
  },
  waitMsg: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: 'rgba(255,255,255,0.5)', fontSize: '14px',
  },
  dot: {
    display: 'inline-block', width: '6px', height: '6px',
    borderRadius: '50%', background: '#FFD700',
    animation: 'pulse 1.4s ease-in-out infinite',
  },
}
