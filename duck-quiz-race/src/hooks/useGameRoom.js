import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getRandomQuestions } from '../data/questions'

const DUCK_EMOJIS = ['🦆', '🐤', '🐥', '🐓', '🦅', '🦉', '🦜', '🐦']
const DUCK_COLORS = ['#FFD700', '#FF6B6B', '#6BCB77', '#4D96FF', '#FF9F40', '#C77DFF', '#FF70A6', '#00C9A7']

function generateId(len = 12) {
  return Math.random().toString(36).slice(2, 2 + len)
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 6).toUpperCase()
}

export function useGameRoom() {
  const [screen, setScreen] = useState('lobby')
  const [myId] = useState(() => generateId())
  const [myName, setMyName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [players, setPlayers] = useState({})
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')

  const channelRef = useRef(null)
  const roomCodeRef = useRef('')
  const screenRef = useRef('lobby')

  // keep screenRef in sync
  useEffect(() => { screenRef.current = screen }, [screen])

  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [])

  // ── Subscribe to room changes ───────────────────────────────────────────────
  const subscribeToRoom = useCallback((code) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current)

    const channel = supabase
      .channel(`room-${code}-${Date.now()}`)
      // Room status changes → trigger game start / finish for ALL players
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${code}`,
      }, (payload) => {
        const updated = payload.new
        setRoom(updated)
        if (updated.status === 'playing' && screenRef.current === 'waiting') {
          setScreen('game')
        }
        if (updated.status === 'finished' && screenRef.current === 'game') {
          setScreen('winner')
        }
      })
      // New player joins
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${code}`,
      }, (payload) => {
        setPlayers(prev => ({ ...prev, [payload.new.id]: payload.new }))
      })
      // Player progress updates
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${code}`,
      }, (payload) => {
        setPlayers(prev => ({ ...prev, [payload.new.id]: payload.new }))
      })
      // Player leaves
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'players',
        filter: `room_id=eq.${code}`,
      }, (payload) => {
        setPlayers(prev => {
          const next = { ...prev }
          delete next[payload.old.id]
          return next
        })
      })
      .subscribe((status) => {
        console.log('Realtime status:', status)
      })

    channelRef.current = channel
  }, [])

  // ── Create room ─────────────────────────────────────────────────────────────
  const createRoom = useCallback(async (name) => {
    setError('')
    const code = generateRoomCode()

    const { error: roomErr } = await supabase.from('rooms').insert({
      id: code,
      host_id: myId,
      status: 'waiting',
      questions: [],
    })
    if (roomErr) { setError('Không tạo được phòng: ' + roomErr.message); return }

    const emoji = DUCK_EMOJIS[0]
    const color = DUCK_COLORS[0]

    const { error: playerErr } = await supabase.from('players').insert({
      id: myId, room_id: code, name, emoji, color,
      progress: 0, score: 0, question_index: 0, finished: false,
    })
    if (playerErr) { setError('Lỗi khi vào phòng: ' + playerErr.message); return }

    roomCodeRef.current = code
    setMyName(name)
    setRoomCode(code)
    setIsHost(true)
    setPlayers({ [myId]: { id: myId, name, emoji, color, progress: 0, score: 0, finished: false } })
    setRoom({ id: code, host_id: myId, status: 'waiting', questions: [] })

    // Subscribe AFTER inserting so we don't miss own insert
    subscribeToRoom(code)
    setScreen('waiting')
  }, [myId, subscribeToRoom])

  // ── Join room ───────────────────────────────────────────────────────────────
  const joinRoom = useCallback(async (name, code) => {
    setError('')
    const upperCode = code.toUpperCase()

    const { data: roomData, error: roomErr } = await supabase
      .from('rooms').select('*').eq('id', upperCode).single()
    if (roomErr || !roomData) { setError('Không tìm thấy phòng "' + upperCode + '"'); return }
    if (roomData.status !== 'waiting') { setError('Phòng này đã bắt đầu rồi!'); return }

    const { data: existingPlayers } = await supabase
      .from('players').select('*').eq('room_id', upperCode)
    const playerCount = existingPlayers?.length || 0
    const emoji = DUCK_EMOJIS[playerCount % DUCK_EMOJIS.length]
    const color = DUCK_COLORS[playerCount % DUCK_COLORS.length]

    const { error: playerErr } = await supabase.from('players').insert({
      id: myId, room_id: upperCode, name, emoji, color,
      progress: 0, score: 0, question_index: 0, finished: false,
    })
    if (playerErr) { setError('Lỗi khi vào phòng: ' + playerErr.message); return }

    const playersMap = {}
    existingPlayers?.forEach(p => { playersMap[p.id] = p })
    playersMap[myId] = { id: myId, name, emoji, color, progress: 0, score: 0, finished: false }

    roomCodeRef.current = upperCode
    setMyName(name)
    setRoomCode(upperCode)
    setIsHost(false)
    setPlayers(playersMap)
    setRoom(roomData)

    // Subscribe AFTER inserting
    subscribeToRoom(upperCode)
    setScreen('waiting')
  }, [myId, subscribeToRoom])

  // ── Start game (host only) ──────────────────────────────────────────────────
  const startGame = useCallback(async () => {
    const questions = getRandomQuestions(50)
    const { error } = await supabase.from('rooms').update({
      status: 'playing',
      questions,
    }).eq('id', roomCode)

    if (error) { console.error('startGame error:', error); return }

    // Host transitions immediately
    setScreen('game')
  }, [roomCode])

  // ── Update my player progress ───────────────────────────────────────────────
  const updateMyProgress = useCallback(async (updates) => {
    const { error } = await supabase.from('players').update({
      ...updates,
      updated_at: new Date().toISOString(),
    }).eq('id', myId)
    if (error) console.error('updateMyProgress error:', error)
  }, [myId])

  // ── Finish game ─────────────────────────────────────────────────────────────
  const finishRoom = useCallback(async () => {
    await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomCode)
    setScreen('winner')
  }, [roomCode])

  // ── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(async () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setScreen('lobby')
    setRoomCode('')
    roomCodeRef.current = ''
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