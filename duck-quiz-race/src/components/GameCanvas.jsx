import { useEffect, useRef, useCallback, useState } from 'react'
import QuestionBox from './QuestionBox'

const TOTAL_STEPS = 40
const BASE_SPEED = 0.005
const STEP_SIZE = 1 / TOTAL_STEPS
const FINISH_X = 0.90
const QUESTION_EVERY = STEP_SIZE * 2

function rollDice() { return [2, 3, 4][Math.floor(Math.random() * 3)] }

export default function GameCanvas({ myId, myName, players, room, onProgressUpdate, onFinish }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    myProgress: 0, myScore: 0, questionIndex: 0,
    nextQuestionAt: QUESTION_EVERY, answering: false,
    lastTime: 0, _lastSync: 0,
  })

  // ✅ FIX: Lưu questions vào ref để game loop luôn đọc được giá trị mới nhất
  const questionsRef = useRef([])
  useEffect(() => {
    if (room?.questions?.length > 0) {
      questionsRef.current = room.questions
    }
  }, [room?.questions])

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [diceResult, setDiceResult] = useState(null)
  const [finished, setFinished] = useState(false)
  const finishedRef = useRef(false)

  const playersRef = useRef(players)
  useEffect(() => { playersRef.current = players }, [players])

  const draw = useCallback((W, H, ts) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const players = playersRef.current
    ctx.clearRect(0, 0, W, H)
    const waterY = H * 0.3

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, waterY)
    sky.addColorStop(0, '#87CEEB')
    sky.addColorStop(1, '#B0E2FF')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, waterY)

    // Clouds
    function drawCloud(cx, cy, r) {
      ctx.fillStyle = 'rgba(255,255,255,0.92)'
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx - r * 0.6, cy + r * 0.3, r * 0.7, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(cx + r * 0.6, cy + r * 0.3, r * 0.7, 0, Math.PI * 2); ctx.fill()
    }
    drawCloud(W * 0.1 + Math.sin(ts / 3000) * 10, waterY * 0.3, 22)
    drawCloud(W * 0.45 + Math.sin(ts / 4000 + 1) * 8, waterY * 0.2, 28)
    drawCloud(W * 0.78 + Math.sin(ts / 3500 + 2) * 10, waterY * 0.35, 20)

    // Sun
    ctx.fillStyle = '#FFD700'
    ctx.beginPath(); ctx.arc(W - 40, 35, 22, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#FFA500'; ctx.lineWidth = 2
    for (let a = 0; a < 8; a++) {
      const angle = (a / 8) * Math.PI * 2 + ts / 2000
      ctx.beginPath()
      ctx.moveTo(W - 40 + Math.cos(angle) * 26, 35 + Math.sin(angle) * 26)
      ctx.lineTo(W - 40 + Math.cos(angle) * 32, 35 + Math.sin(angle) * 32)
      ctx.stroke()
    }

    // Grass
    ctx.fillStyle = '#5D8A3C'; ctx.fillRect(0, waterY - 10, W, 10)
    ctx.fillStyle = '#7ABD52'; ctx.fillRect(0, waterY - 14, W, 4)

    // Water
    const water = ctx.createLinearGradient(0, waterY, 0, H)
    water.addColorStop(0, '#2980B9')
    water.addColorStop(1, '#1A5276')
    ctx.fillStyle = water
    ctx.fillRect(0, waterY, W, H - waterY)

    // Waves
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3
    for (let wy = waterY + 18; wy < H - 10; wy += 32) {
      ctx.beginPath()
      for (let x = 0; x <= W; x += 4) {
        const y = wy + Math.sin((x / 60) + ts / 700) * 4
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    // Step markers
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const x = (step / TOTAL_STEPS) * W * FINISH_X
      const isMajor = step % 5 === 0
      ctx.strokeStyle = isMajor ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)'
      ctx.lineWidth = isMajor ? 2 : 1
      ctx.setLineDash(isMajor ? [] : [4, 4])
      ctx.beginPath(); ctx.moveTo(x, waterY + 2); ctx.lineTo(x, H); ctx.stroke()
      ctx.setLineDash([])
      if (isMajor) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'
        ctx.fillText(step, x, waterY + 13)
      }
    }

    // Finish flag
    const finX = W * FINISH_X
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.moveTo(finX, waterY - 16); ctx.lineTo(finX, H); ctx.stroke()
    ctx.font = '24px serif'; ctx.textAlign = 'center'
    ctx.fillText('🏁', finX, waterY - 18)

    // Players
    const sortedPlayers = Object.values(players).sort((a, b) => a.id.localeCompare(b.id))
    const laneH = Math.min(58, (H - waterY - 16) / Math.max(sortedPlayers.length, 1))

    sortedPlayers.forEach((p, i) => {
      const prog = p.id === myId ? stateRef.current.myProgress : (p.progress || 0)
      const duckX = Math.max(24, W * Math.min(prog, FINISH_X - 0.01))
      const laneY = waterY + 12 + i * laneH + laneH * 0.5
      const bob = Math.sin(ts / 380 + i * 1.5) * 3
      const isMe = p.id === myId

      // Mini progress bar
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.beginPath(); ctx.roundRect(8, laneY + 14, W * FINISH_X - 16, 4, 2); ctx.fill()
      ctx.fillStyle = isMe ? '#FFD700' : '#4ECDC4'
      ctx.beginPath(); ctx.roundRect(8, laneY + 14, (W * FINISH_X - 16) * Math.min(prog / FINISH_X, 1), 4, 2); ctx.fill()

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.beginPath(); ctx.ellipse(duckX, laneY + 16, 16, 5, 0, 0, Math.PI * 2); ctx.fill()

      // Duck
      ctx.font = '30px serif'; ctx.textAlign = 'center'
      ctx.fillText(p.emoji, duckX, laneY + bob)

      // Name bubble
      const score = isMe ? stateRef.current.myScore : (p.score || 0)
      const nameText = `${p.name} ⭐${score}`
      ctx.font = isMe ? 'bold 11px sans-serif' : '10px sans-serif'
      const tw = ctx.measureText(nameText).width
      const bx = duckX - tw / 2 - 6, by = laneY - 26 + bob, bw = tw + 12, bh = 16
      ctx.fillStyle = isMe ? '#FFD700' : 'rgba(255,255,255,0.9)'
      ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 6); ctx.fill()
      ctx.fillStyle = isMe ? '#5a3e00' : '#333'
      ctx.fillText(nameText, duckX, by + 11)

      const step = Math.min(Math.round(prog / (FINISH_X / TOTAL_STEPS)), TOTAL_STEPS)
      ctx.font = '9px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.fillText(`${step}/${TOTAL_STEPS}`, duckX, laneY + 26)
    })
    ctx.textAlign = 'left'
  }, [myId]) // ✅ Không phụ thuộc vào players hay questions nữa — dùng ref

  const loop = useCallback((ts) => {
    const s = stateRef.current
    const canvas = canvasRef.current
    if (!canvas) return

    const dt = Math.min((ts - s.lastTime) / 1000, 0.05)
    s.lastTime = ts

    if (!s.answering && !finishedRef.current) {
      s.myProgress = Math.min(s.myProgress + dt * BASE_SPEED, FINISH_X)

      // ✅ Đọc questions từ ref — luôn mới nhất, không bao giờ stale
      const qs = questionsRef.current
      if (s.myProgress >= s.nextQuestionAt && s.questionIndex < qs.length && qs.length > 0) {
        s.answering = true
        setCurrentQuestion(qs[s.questionIndex])
      }

      if (s.myProgress >= FINISH_X && !finishedRef.current) {
        finishedRef.current = true
        setFinished(true)
        onProgressUpdate({ progress: FINISH_X, score: s.myScore, finished: true, finish_rank: 1 })
        onFinish()
        return
      }

      if (ts - s._lastSync > 500) {
        s._lastSync = ts
        onProgressUpdate({ progress: s.myProgress, score: s.myScore })
      }
    }

    draw(canvas.width, canvas.height, ts)
    s.animFrame = requestAnimationFrame(loop)
  }, [draw, onProgressUpdate, onFinish]) // ✅ Không có questions trong deps

  useEffect(() => {
    const s = stateRef.current
    s.animFrame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(s.animFrame)
  }, [loop])

  useEffect(() => {
    function resize() {
      const c = canvasRef.current
      if (!c) return
      c.width = c.offsetWidth
      c.height = Math.max(320, Math.min(500, window.innerHeight * 0.72))
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  function handleAnswer(_idx, correct, timeout) {
    const s = stateRef.current
    if (timeout) {
      showDice(0)
    } else if (correct) {
      const steps = rollDice()
      s.myProgress = Math.min(s.myProgress + STEP_SIZE * steps, FINISH_X)
      s.myScore += 10
      setMyScore(s.myScore)
      showDice(steps)
    } else {
      s.myProgress = Math.max(s.myProgress - STEP_SIZE, 0)
      showDice(-1)
    }
    s.questionIndex++
    s.nextQuestionAt = s.myProgress + QUESTION_EVERY
    s.answering = false
    setCurrentQuestion(null)
  }

  function showDice(steps) {
    setDiceResult(steps)
    setTimeout(() => setDiceResult(null), 1400)
  }

  const sortedForRank = Object.values(players).sort((a, b) => {
    const ap = a.id === myId ? stateRef.current.myProgress : (a.progress || 0)
    const bp = b.id === myId ? stateRef.current.myProgress : (b.progress || 0)
    return bp - ap
  })
  const myRank = sortedForRank.findIndex(p => p.id === myId) + 1
  const myStep = Math.min(Math.round(stateRef.current.myProgress / (FINISH_X / TOTAL_STEPS)), TOTAL_STEPS)

  return (
    <div style={s.wrapper}>
      <div style={s.hud}>
        <div style={s.hudChip}>🦆 <b>{myName}</b></div>
        <div style={{ ...s.hudChip, background: '#43e97b', color: '#1a5e3a' }}>Bước {myStep}/{TOTAL_STEPS}</div>
        <div style={{ ...s.hudChip, background: '#f9d423', color: '#5a3e00' }}>⭐ {myScore}</div>
        <div style={{ ...s.hudChip, background: '#4ECDC4', color: '#1a5e5a' }}>#{myRank}/{Object.keys(players).length}</div>
      </div>

      <canvas ref={canvasRef} style={s.canvas} />

      {diceResult !== null && (
        <div style={{ ...s.dice, background: diceResult > 0 ? '#43e97b' : diceResult === 0 ? '#95a5a6' : '#ff6b6b' }}>
          {diceResult > 0 ? `🎲 +${diceResult} bước!` : diceResult === 0 ? '⏰ Đứng yên!' : '💥 -1 bước!'}
        </div>
      )}

      {currentQuestion && <QuestionBox question={currentQuestion} onAnswer={handleAnswer} timeLimit={12} />}

      <style>{`@keyframes diceIn{0%{transform:translateX(-50%) scale(0.5);opacity:0}50%{transform:translateX(-50%) scale(1.2)}100%{transform:translateX(-50%) scale(1);opacity:1}}`}</style>
    </div>
  )
}

const s = {
  wrapper: {
    position: 'relative', width: '100%', height: '100vh',
    display: 'flex', flexDirection: 'column',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflow: 'hidden', background: '#87CEEB',
  },
  hud: {
    display: 'flex', gap: '6px', padding: '8px 10px', flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.92)', borderBottom: '3px solid #e0e0e0', zIndex: 10,
  },
  hudChip: {
    padding: '5px 12px', borderRadius: '99px',
    background: '#667eea', color: '#fff', fontSize: '13px', fontWeight: 700,
  },
  canvas: { flex: 1, width: '100%', display: 'block' },
  dice: {
    position: 'absolute', top: '70px', left: '50%',
    padding: '12px 28px', borderRadius: '99px',
    color: '#fff', fontWeight: 900, fontSize: '20px',
    zIndex: 20, whiteSpace: 'nowrap',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    animation: 'diceIn 0.4s ease-out forwards',
  },
}