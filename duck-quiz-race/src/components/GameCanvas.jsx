import { useEffect, useRef, useCallback, useState } from 'react'
import QuestionBox from './QuestionBox'

const FINISH_X = 0.88
const BASE_SPEED = 0.032        // progress/sec auto-advance
const CORRECT_BOOST = 0.09
const WRONG_PENALTY = 0.025
const QUESTION_EVERY = 0.14    // trigger question every this much progress

export default function GameCanvas({ myId, myName, players, room, onProgressUpdate, onFinish }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    myProgress: 0,
    myScore: 0,
    questionIndex: 0,
    nextQuestionAt: QUESTION_EVERY,
    answering: false,
    animFrame: null,
    lastTime: 0,
  })
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const questions = room?.questions || []

  // ── Canvas draw ─────────────────────────────────────────────────────────────
  const draw = useCallback((W, H, ts) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const waterY = H * 0.32

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, waterY)
    skyGrad.addColorStop(0, '#1a1a4e')
    skyGrad.addColorStop(1, '#2d6a9f')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, W, waterY)

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    for (let i = 0; i < 20; i++) {
      const sx = (i * 137.5) % W
      const sy = (i * 73) % waterY
      const r = 1 + Math.sin(ts / 800 + i) * 0.4
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    // Water
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, H)
    waterGrad.addColorStop(0, '#1565C0')
    waterGrad.addColorStop(1, '#0D47A1')
    ctx.fillStyle = waterGrad
    ctx.fillRect(0, waterY, W, H - waterY)

    // Animated waves
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 1.5
    for (let wy = waterY + 18; wy < H - 10; wy += 28) {
      ctx.beginPath()
      for (let x = 0; x <= W; x += 3) {
        const y = wy + Math.sin((x / W) * 12 + ts / 900) * 3
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Shore / banks
    ctx.fillStyle = '#8B6914'
    ctx.fillRect(0, waterY - 8, W, 8)
    ctx.fillStyle = '#6B8E23'
    ctx.fillRect(0, waterY - 12, W, 4)

    // Question markers along track
    const playerCount = Object.keys(players).length || 1
    const laneH = Math.min(60, (H - waterY - 20) / playerCount)

    if (questions.length > 0) {
      for (let qi = 0; qi < questions.length; qi++) {
        const qProgress = QUESTION_EVERY + qi * ((FINISH_X - QUESTION_EVERY) / questions.length)
        const qX = W * qProgress
        ctx.fillStyle = 'rgba(255,215,0,0.25)'
        ctx.fillRect(qX - 1, waterY, 2, H - waterY)
        ctx.fillStyle = 'rgba(255,215,0,0.8)'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('?', qX, waterY + 12)
      }
    }

    // Finish line
    const finX = W * FINISH_X
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 2.5
    ctx.setLineDash([10, 7])
    ctx.beginPath(); ctx.moveTo(finX, waterY - 12); ctx.lineTo(finX, H); ctx.stroke()
    ctx.setLineDash([])
    ctx.font = '20px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🏁', finX, waterY - 14)

    // Players
    const sortedPlayers = Object.values(players).sort((a, b) => a.id.localeCompare(b.id))
    sortedPlayers.forEach((p, i) => {
      const prog = p.id === myId ? stateRef.current.myProgress : (p.progress || 0)
      const duckX = W * Math.min(prog, FINISH_X)
      const laneY = waterY + 16 + i * laneH + laneH * 0.5
      const bob = Math.sin(ts / 400 + i * 1.3) * 2.5

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.beginPath()
      ctx.ellipse(duckX, laneY + 14, 16, 5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Duck emoji
      ctx.font = '28px serif'
      ctx.textAlign = 'center'
      ctx.fillText(p.emoji, duckX, laneY + bob)

      // Name tag
      const isMe = p.id === myId
      ctx.font = isMe ? 'bold 11px sans-serif' : '10px sans-serif'
      ctx.fillStyle = isMe ? '#FFD700' : 'rgba(255,255,255,0.8)'
      ctx.fillText(p.name + (p.finished ? ' ✓' : ''), duckX, laneY - 14 + bob)
    })

    ctx.textAlign = 'left'
  }, [players, myId, questions])

  // ── Game loop ───────────────────────────────────────────────────────────────
  const loop = useCallback((ts) => {
    const s = stateRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    const W = canvas.width
    const H = canvas.height
    const dt = Math.min((ts - s.lastTime) / 1000, 0.05)
    s.lastTime = ts

    if (!s.answering && !finished) {
      s.myProgress = Math.min(s.myProgress + dt * BASE_SPEED, 0.995)

      // Trigger question
      if (
        s.myProgress >= s.nextQuestionAt &&
        s.questionIndex < questions.length &&
        !s.answering
      ) {
        s.answering = true
        setCurrentQuestion(questions[s.questionIndex])
      }

      // Reached finish
      if (s.myProgress >= FINISH_X && !finished) {
        setFinished(true)
        onProgressUpdate({ progress: FINISH_X, score: s.myScore, finished: true, finish_rank: 1 })
        onFinish()
        return
      }

      // Throttled DB update (every ~600ms of progress change)
      if (!s._lastSync || ts - s._lastSync > 600) {
        s._lastSync = ts
        onProgressUpdate({ progress: s.myProgress, score: s.myScore })
      }
    }

    draw(W, H, ts)
    s.animFrame = requestAnimationFrame(loop)
  }, [draw, finished, questions, onProgressUpdate, onFinish])

  // ── Start loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const s = stateRef.current
    s.animFrame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(s.animFrame)
  }, [loop])

  // ── Resize canvas ───────────────────────────────────────────────────────────
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = Math.max(320, Math.min(480, window.innerHeight * 0.65))
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Answer handler ──────────────────────────────────────────────────────────
  function handleAnswer(_idx, correct) {
    const s = stateRef.current
    if (correct) {
      s.myProgress = Math.min(s.myProgress + CORRECT_BOOST, 0.995)
      s.myScore += 10
      setMyScore(s.myScore)
    } else {
      s.myProgress = Math.max(s.myProgress - WRONG_PENALTY, 0)
    }
    s.questionIndex++
    s.nextQuestionAt = s.myProgress + QUESTION_EVERY
    s.answering = false
    setCurrentQuestion(null)
  }

  // ── HUD: leaderboard ranking ────────────────────────────────────────────────
  const sortedForRank = Object.values(players).sort((a, b) => {
    const ap = a.id === myId ? stateRef.current.myProgress : (a.progress || 0)
    const bp = b.id === myId ? stateRef.current.myProgress : (b.progress || 0)
    return bp - ap
  })
  const myRank = sortedForRank.findIndex(p => p.id === myId) + 1

  return (
    <div style={styles.wrapper}>
      {/* HUD */}
      <div style={styles.hud}>
        <span style={styles.hudName}>🦆 {myName}</span>
        <span style={styles.hudScore}>⭐ {myScore}</span>
        <span style={styles.hudRank}>#{myRank} / {Object.keys(players).length}</span>
      </div>

      {/* Race canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Question overlay */}
      {currentQuestion && (
        <QuestionBox
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLimit={10}
        />
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%', height: '100vh',
    display: 'flex', flexDirection: 'column',
    background: '#0D1B3E',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflow: 'hidden',
  },
  hud: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 16px',
    background: 'rgba(0,0,0,0.5)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  hudName: { color: '#FFD700', fontWeight: 700, fontSize: '15px' },
  hudScore: { color: '#fff', fontSize: '14px' },
  hudRank: { color: 'rgba(255,255,255,0.6)', fontSize: '13px' },
  canvas: { flex: 1, width: '100%', display: 'block' },
}
