import { useEffect, useRef, useCallback, useState } from 'react'
import QuestionBox from './QuestionBox'

const TOTAL_STEPS = 50          // tổng số bước để về đích
const BASE_SPEED = 0.006        // progress/sec tự động tiến (chậm hơn, dài hơn)
const STEP_SIZE = 1 / TOTAL_STEPS  // 1 bước = 2% đường đua

// Rule mới: đúng → random +2/+3/+4 bước, sai → -1, timeout → 0
function rollDice() {
  return [2, 3, 4][Math.floor(Math.random() * 3)]
}

const FINISH_X = 0.92
const QUESTION_EVERY = STEP_SIZE * 2  // cứ 2 bước tự đi thì ra câu hỏi

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
    _lastSync: 0,
  })
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [diceResult, setDiceResult] = useState(null)  // hiển thị xúc xắc
  const [finished, setFinished] = useState(false)

  const questions = room?.questions || []

  // ── Canvas draw ─────────────────────────────────────────────────────────────
  const draw = useCallback((W, H, ts) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const waterY = H * 0.28

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, waterY)
    skyGrad.addColorStop(0, '#0a0a2e')
    skyGrad.addColorStop(1, '#1a4a7a')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, W, waterY)

    // Stars
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < 25; i++) {
      const sx = (i * 137.5) % W
      const sy = (i * 53) % (waterY - 10)
      const r = 0.8 + Math.sin(ts / 1000 + i) * 0.5
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill()
    }

    // Water
    const waterGrad = ctx.createLinearGradient(0, waterY, 0, H)
    waterGrad.addColorStop(0, '#0d47a1')
    waterGrad.addColorStop(1, '#01579b')
    ctx.fillStyle = waterGrad
    ctx.fillRect(0, waterY, W, H - waterY)

    // Step markers (50 vạch nhỏ)
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const x = W * (step / TOTAL_STEPS) * FINISH_X
      const isMajor = step % 5 === 0
      ctx.strokeStyle = isMajor ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.12)'
      ctx.lineWidth = isMajor ? 1.5 : 0.5
      ctx.setLineDash(isMajor ? [] : [3, 4])
      ctx.beginPath(); ctx.moveTo(x, waterY); ctx.lineTo(x, H); ctx.stroke()
      ctx.setLineDash([])
      if (isMajor) {
        ctx.fillStyle = 'rgba(255,215,0,0.7)'
        ctx.font = '9px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(step, x, waterY + 10)
      }
    }

    // Waves
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 1.5
    for (let wy = waterY + 20; wy < H - 10; wy += 30) {
      ctx.beginPath()
      for (let x = 0; x <= W; x += 3) {
        const y = wy + Math.sin((x / W) * 14 + ts / 1000) * 3
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Finish line
    const finX = W * FINISH_X
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 6])
    ctx.beginPath(); ctx.moveTo(finX, waterY - 14); ctx.lineTo(finX, H); ctx.stroke()
    ctx.setLineDash([])
    ctx.font = '22px serif'
    ctx.textAlign = 'center'
    ctx.fillText('🏁', finX, waterY - 14)

    // Players (sorted by join order for stable lanes)
    const sortedPlayers = Object.values(players).sort((a, b) => a.id.localeCompare(b.id))
    const playerCount = sortedPlayers.length || 1
    const laneH = Math.min(56, (H - waterY - 20) / playerCount)

    sortedPlayers.forEach((p, i) => {
      const prog = p.id === myId ? stateRef.current.myProgress : (p.progress || 0)
      const duckX = Math.max(20, W * Math.min(prog, FINISH_X - 0.005))
      const laneY = waterY + 14 + i * laneH + laneH * 0.5
      const bob = Math.sin(ts / 420 + i * 1.5) * 2.5

      // Progress bar (mini)
      const barW = W * FINISH_X - 20
      const barX = 10
      ctx.fillStyle = 'rgba(255,255,255,0.07)'
      ctx.fillRect(barX, laneY + 12, barW, 3)
      ctx.fillStyle = p.id === myId ? '#FFD700' : p.color || '#4D96FF'
      ctx.fillRect(barX, laneY + 12, barW * Math.min(prog / FINISH_X, 1), 3)

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.beginPath()
      ctx.ellipse(duckX, laneY + 15, 15, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Duck
      ctx.font = '26px serif'
      ctx.textAlign = 'center'
      ctx.fillText(p.emoji, duckX, laneY + bob)

      // Name + score
      const isMe = p.id === myId
      ctx.font = isMe ? 'bold 11px sans-serif' : '10px sans-serif'
      ctx.fillStyle = isMe ? '#FFD700' : 'rgba(255,255,255,0.75)'
      const score = p.id === myId ? stateRef.current.myScore : (p.score || 0)
      ctx.fillText(`${p.name} ⭐${score}`, duckX, laneY - 12 + bob)

      // Step counter
      const myStep = Math.round(prog / (FINISH_X / TOTAL_STEPS))
      ctx.font = '9px sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText(`${Math.min(myStep, TOTAL_STEPS)}/${TOTAL_STEPS}`, duckX, laneY + 24)
    })

    ctx.textAlign = 'left'
  }, [players, myId])

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
      s.myProgress = Math.min(s.myProgress + dt * BASE_SPEED, FINISH_X)

      // Trigger question
      if (s.myProgress >= s.nextQuestionAt && s.questionIndex < questions.length) {
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

      // Sync to DB ~every 500ms
      if (ts - s._lastSync > 500) {
        s._lastSync = ts
        onProgressUpdate({ progress: s.myProgress, score: s.myScore })
      }
    }

    draw(W, H, ts)
    s.animFrame = requestAnimationFrame(loop)
  }, [draw, finished, questions, onProgressUpdate, onFinish])

  useEffect(() => {
    const s = stateRef.current
    s.animFrame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(s.animFrame)
  }, [loop])

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = Math.max(340, Math.min(500, window.innerHeight * 0.7))
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // ── Answer handler ──────────────────────────────────────────────────────────
  function handleAnswer(_idx, correct, timeout) {
    const s = stateRef.current

    if (timeout) {
      // Hết giờ → đứng yên
      showDice(0)
    } else if (correct) {
      const steps = rollDice()
      s.myProgress = Math.min(s.myProgress + STEP_SIZE * steps, FINISH_X)
      s.myScore += 10
      setMyScore(s.myScore)
      showDice(steps)
    } else {
      // Sai → lùi 1 bước
      s.myProgress = Math.max(s.myProgress - STEP_SIZE * 1, 0)
      showDice(-1)
    }

    s.questionIndex++
    s.nextQuestionAt = s.myProgress + QUESTION_EVERY
    s.answering = false
    setCurrentQuestion(null)
  }

  function showDice(steps) {
    setDiceResult(steps)
    setTimeout(() => setDiceResult(null), 1200)
  }

  // HUD rank
  const sortedForRank = Object.values(players).sort((a, b) => {
    const ap = a.id === myId ? stateRef.current.myProgress : (a.progress || 0)
    const bp = b.id === myId ? stateRef.current.myProgress : (b.progress || 0)
    return bp - ap
  })
  const myRank = sortedForRank.findIndex(p => p.id === myId) + 1
  const myStep = Math.min(Math.round(stateRef.current.myProgress / (FINISH_X / TOTAL_STEPS)), TOTAL_STEPS)

  return (
    <div style={styles.wrapper}>
      {/* HUD */}
      <div style={styles.hud}>
        <span style={styles.hudName}>🦆 {myName}</span>
        <span style={styles.hudStep}>Bước {myStep}/{TOTAL_STEPS}</span>
        <span style={styles.hudScore}>⭐ {myScore}</span>
        <span style={styles.hudRank}>#{myRank}/{Object.keys(players).length}</span>
      </div>

      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Dice result popup */}
      {diceResult !== null && (
        <div style={{
          ...styles.dicePopup,
          background: diceResult > 0 ? 'rgba(74,222,128,0.95)' : diceResult === 0 ? 'rgba(100,100,100,0.95)' : 'rgba(248,113,113,0.95)',
        }}>
          {diceResult > 0 ? `🎲 +${diceResult} bước!` : diceResult === 0 ? '⏰ Hết giờ! Đứng yên' : '❌ -1 bước!'}
        </div>
      )}

      {/* Question */}
      {currentQuestion && (
        <QuestionBox
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLimit={12}
        />
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'relative', width: '100%', height: '100vh',
    display: 'flex', flexDirection: 'column',
    background: '#0a0a2e', overflow: 'hidden',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  hud: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.6)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    gap: '8px', flexWrap: 'wrap',
  },
  hudName: { color: '#FFD700', fontWeight: 700, fontSize: '14px' },
  hudStep: { color: '#fff', fontSize: '13px', fontWeight: 600 },
  hudScore: { color: '#4ade80', fontSize: '13px' },
  hudRank: { color: 'rgba(255,255,255,0.5)', fontSize: '12px' },
  canvas: { flex: 1, width: '100%', display: 'block' },
  dicePopup: {
    position: 'absolute', top: '60px', left: '50%',
    transform: 'translateX(-50%)',
    padding: '10px 24px', borderRadius: '99px',
    color: '#fff', fontWeight: 700, fontSize: '18px',
    zIndex: 20, whiteSpace: 'nowrap',
    animation: 'fadeUp 1.2s ease forwards',
  },
}