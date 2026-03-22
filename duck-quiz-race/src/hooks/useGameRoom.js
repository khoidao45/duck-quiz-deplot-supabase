import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getRandomQuestions } from '../data/questions'

const DUCK_EMOJIS = ['🦆', '🐤', '🐥', '🐓', '🦅', '🦉', '🦜', '🐦']
const DUCK_COLORS = ['#FFD700', '#FF6B6B', '#6BCB77', '#4D96FF', '#FF9F40', '#C77DFF', '#FF70A6', '#00C9A7']

function generateId(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len).toUpperCase()
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function useGameRoom() {
  const [screen, setScreen] = useState('lobby') // lobby | waiting | game | winner
  const [myId] = useState(() => generateId(12))
  const [myName, setMyName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [players, setPlayers] = useState({})
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')

  const channelRef = useRef(null)

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  // ── Subscribe to a room ─────────────────────────────────────────────────────
  const subscribeToRoom = useCallback((code) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current)

    const channel = supabase
      .channel(`room:${code}`)
      // Room status changes (game start, finish)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'rooms',
        filter: `id=eq.${code}`
      }, (payload) => {
        if (payload.new) setRoom(payload.new)
      })
      // Player updates
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'players',
        filter: `room_id=eq.${code}`
      }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setPlayers(prev => {
            const next = { ...prev }
            delete next[payload.old.id]
            return next
          })
        } else if (payload.new) {
          setPlayers(prev => ({ ...prev, [payload.new.id]: payload.new }))
        }
      })
      .subscribe()

    channelRef.current = channel
  }, [])

  // ── Create room (host) ──────────────────────────────────────────────────────
  const createRoom = useCallback(async (name) => {
    setError('')
    const code = generateRoomCode()
    const playerCount = 0
    const emoji = DUCK_EMOJIS[playerCount % DUCK_EMOJIS.length]
    const color = DUCK_COLORS[playerCount % DUCK_COLORS.length]

    // Insert room
    const { error: roomErr } = await supabase.from('rooms').insert({
      id: code,
      host_id: myId,
      status: 'waiting',
      questions: [],
    })
    if (roomErr) { setError('Không tạo được phòng: ' + roomErr.message); return }

    // Insert self as player
    const { error: playerErr } = await supabase.from('players').insert({
      id: myId, room_id: code, name, emoji, color,
      progress: 0, score: 0, question_index: 0, finished: false
    })
    if (playerErr) { setError('Lỗi khi vào phòng: ' + playerErr.message); return }

    setMyName(name)
    setRoomCode(code)
    setIsHost(true)
    setPlayers({ [myId]: { id: myId, name, emoji, color, progress: 0, score: 0, question_index: 0, finished: false } })
    setRoom({ id: code, host_id: myId, status: 'waiting', questions: [] })
    subscribeToRoom(code)
    setScreen('waiting')
  }, [myId, subscribeToRoom])

  // ── Join room ───────────────────────────────────────────────────────────────
  const joinRoom = useCallback(async (name, code) => {
    setError('')
    const upperCode = code.toUpperCase()

    // Check room exists and is waiting
    const { data: roomData, error: roomErr } = await supabase
      .from('rooms').select('*').eq('id', upperCode).single()
    if (roomErr || !roomData) { setError('Không tìm thấy phòng "' + upperCode + '"'); return }
    if (roomData.status !== 'waiting') { setError('Phòng này đã bắt đầu rồi!'); return }

    // Get current player count for emoji/color assignment
    const { data: existingPlayers } = await supabase
      .from('players').select('id').eq('room_id', upperCode)
    const playerCount = existingPlayers?.length || 0
    const emoji = DUCK_EMOJIS[playerCount % DUCK_EMOJIS.length]
    const color = DUCK_COLORS[playerCount % DUCK_COLORS.length]

    const { error: playerErr } = await supabase.from('players').insert({
      id: myId, room_id: upperCode, name, emoji, color,
      progress: 0, score: 0, question_index: 0, finished: false
    })
    if (playerErr) { setError('Lỗi khi vào phòng: ' + playerErr.message); return }

    // Fetch all current players
    const { data: allPlayers } = await supabase
      .from('players').select('*').eq('room_id', upperCode)

    const playersMap = {}
    allPlayers?.forEach(p => { playersMap[p.id] = p })

    setMyName(name)
    setRoomCode(upperCode)
    setIsHost(false)
    setPlayers(playersMap)
    setRoom(roomData)
    subscribeToRoom(upperCode)
    setScreen('waiting')
  }, [myId, subscribeToRoom])

  // ── Start game (host only) ──────────────────────────────────────────────────
  const startGame = useCallback(async () => {
    const questions = getRandomQuestions(8)
    await supabase.from('rooms').update({
      status: 'playing',
      questions,
    }).eq('id', roomCode)
    setScreen('game')
  }, [roomCode])

  // ── Update my player progress ───────────────────────────────────────────────
  const updateMyProgress = useCallback(async (updates) => {
    await supabase.from('players').update({
      ...updates,
      updated_at: new Date().toISOString()
    }).eq('id', myId)
  }, [myId])

  // ── Mark game finished for room ─────────────────────────────────────────────
  const finishRoom = useCallback(async () => {
    await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomCode)
    setScreen('winner')
  }, [roomCode])

  // ── Watch for host starting game (non-host players) ─────────────────────────
  useEffect(() => {
    if (!room) return
    if (room.status === 'playing' && screen === 'waiting') {
      setScreen('game')
    }
    if (room.status === 'finished' && screen === 'game') {
      setScreen('winner')
    }
  }, [room, screen])

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(async () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setScreen('lobby')
    setRoomCode('')
    setIsHost(false)
    setPlayers({})
    setRoom(null)
    setError('')
  }, [])

  return {
    screen, myId, myName, roomCode, isHost,
    players, room, error,
    createRoom, joinRoom, startGame,
    updateMyProgress, finishRoom, reset,
  }
}
