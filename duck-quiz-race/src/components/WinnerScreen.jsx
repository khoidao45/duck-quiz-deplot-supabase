export default function WinnerScreen({ players, myId, onPlayAgain }) {
  const sorted = Object.values(players).sort((a, b) => {
    if (a.finish_rank && b.finish_rank) return a.finish_rank - b.finish_rank
    if (a.finish_rank) return -1
    if (b.finish_rank) return 1
    return b.score - a.score
  })

  const me = players[myId]
  const myRank = sorted.findIndex(p => p.id === myId) + 1
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.trophy}>{medals[myRank - 1] || '🏅'}</div>
        <h2 style={styles.title}>
          {myRank === 1 ? 'Bạn thắng rồi! 🎉' : `Hạng ${myRank}!`}
        </h2>
        <p style={styles.sub}>{me?.name} — ⭐ {me?.score || 0} điểm</p>

        <div style={styles.board}>
          <p style={styles.boardTitle}>Bảng xếp hạng</p>
          {sorted.map((p, i) => (
            <div key={p.id} style={{
              ...styles.row,
              background: p.id === myId ? 'rgba(255,215,0,0.12)' : 'transparent',
              border: p.id === myId ? '1px solid rgba(255,215,0,0.3)' : '1px solid transparent',
            }}>
              <span style={styles.rowMedal}>{medals[i] || `${i + 1}.`}</span>
              <span style={styles.rowEmoji}>{p.emoji}</span>
              <span style={styles.rowName}>{p.name}</span>
              <span style={styles.rowScore}>⭐ {p.score}</span>
            </div>
          ))}
        </div>

        <button style={styles.btn} onClick={onPlayAgain}>🔄 Chơi lại</button>
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
    width: '100%', maxWidth: '400px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
  },
  trophy: { fontSize: '72px', filter: 'drop-shadow(0 4px 16px rgba(255,215,0,0.4))' },
  title: { margin: 0, color: '#fff', fontSize: '26px', fontWeight: 700 },
  sub: { margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px' },
  board: {
    width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '16px',
    padding: '1rem', display: 'flex', flexDirection: 'column', gap: '6px',
  },
  boardTitle: { margin: '0 0 8px', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' },
  row: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px 12px', borderRadius: '10px',
  },
  rowMedal: { fontSize: '18px', minWidth: '28px' },
  rowEmoji: { fontSize: '20px' },
  rowName: { color: '#fff', fontSize: '15px', flex: 1 },
  rowScore: { color: '#FFD700', fontSize: '14px', fontWeight: 600 },
  btn: {
    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#3a2600', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
    marginTop: '0.5rem',
  },
}
