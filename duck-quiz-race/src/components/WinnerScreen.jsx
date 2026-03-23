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
  const rankColors = ['linear-gradient(135deg,#f9d423,#ff4e50)', 'linear-gradient(135deg,#b0bec5,#78909c)', 'linear-gradient(135deg,#cd7f32,#a0522d)']
  const bgColors = ['#fff9e6','#f5f5f5','#fdf0e8']

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Winner banner */}
        <div style={{ ...s.banner, background: rankColors[myRank-1] || 'linear-gradient(135deg,#667eea,#764ba2)' }}>
          <div style={s.bannerEmoji}>{medals[myRank-1] || '🏅'}</div>
          <div style={s.bannerText}>
            <div style={s.bannerTitle}>{myRank === 1 ? 'Bạn thắng rồi! 🎉' : `Hạng ${myRank}!`}</div>
            <div style={s.bannerSub}>{me?.name} · ⭐ {me?.score || 0} điểm</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={s.board}>
          <div style={s.boardTitle}>🏆 Bảng xếp hạng</div>
          {sorted.map((p, i) => (
            <div key={p.id} style={{ ...s.row, background: p.id === myId ? '#667eea15' : (bgColors[i] || '#fff'), border: p.id === myId ? '2px solid #667eea' : '2px solid #f0f0f0' }}>
              <span style={s.rowPos}>{medals[i] || `${i+1}`}</span>
              <span style={s.rowEmoji}>{p.emoji}</span>
              <span style={s.rowName}>{p.name}{p.id === myId ? ' 👈' : ''}</span>
              <span style={s.rowScore}>⭐ {p.score}</span>
            </div>
          ))}
        </div>

        <button style={s.btn} onClick={onPlayAgain}>🔄 Chơi lại nào!</button>
      </div>

      <style>{`@keyframes pop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg,#667eea,#764ba2,#f093fb)',
    padding: '1rem', fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: '#fff', borderRadius: '28px', overflow: 'hidden',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '3px solid #fff',
    animation: 'pop 0.5s ease-out',
  },
  banner: {
    padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
  },
  bannerEmoji: { fontSize: '64px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' },
  bannerText: {},
  bannerTitle: { fontSize: '24px', fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  bannerSub: { fontSize: '15px', color: 'rgba(255,255,255,0.85)', fontWeight: 600, marginTop: '4px' },
  board: { padding: '1.25rem 1.25rem 0.5rem' },
  boardTitle: { fontSize: '14px', fontWeight: 800, color: '#555', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' },
  row: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', borderRadius: '14px', marginBottom: '8px',
  },
  rowPos: { fontSize: '20px', minWidth: '30px' },
  rowEmoji: { fontSize: '22px' },
  rowName: { flex: 1, fontWeight: 700, color: '#333', fontSize: '15px' },
  rowScore: { fontWeight: 800, color: '#f9d423', fontSize: '15px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' },
  btn: {
    width: 'calc(100% - 2.5rem)', margin: '0.75rem 1.25rem 1.25rem',
    padding: '16px', borderRadius: '16px', border: 'none',
    background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    color: '#1a5e3a', fontWeight: 900, fontSize: '18px', cursor: 'pointer',
    boxShadow: '0 6px 0 #2da866', display: 'block', fontFamily: 'inherit',
  },
}