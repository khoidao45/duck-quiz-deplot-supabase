import Lobby from './components/Lobby'
import WaitingRoom from './components/WaitingRoom'
import GameCanvas from './components/GameCanvas'
import WinnerScreen from './components/WinnerScreen'
import { useGameRoom } from './hooks/useGameRoom'

export default function App() {
  const {
    screen, myId, myName, roomCode, isHost,
    players, room, error,
    createRoom, joinRoom, startGame,
    updateMyProgress, finishRoom, reset,
  } = useGameRoom()

  if (screen === 'lobby') {
    return <Lobby onCreateRoom={createRoom} onJoinRoom={joinRoom} error={error} />
  }

  if (screen === 'waiting') {
    return (
      <WaitingRoom
        roomCode={roomCode}
        players={players}
        isHost={isHost}
        myId={myId}
        onStart={startGame}
      />
    )
  }

  if (screen === 'game') {
    return (
      <GameCanvas
        myId={myId}
        myName={myName}
        players={players}
        room={room}
        onProgressUpdate={updateMyProgress}
        onFinish={finishRoom}
      />
    )
  }

  if (screen === 'winner') {
    return (
      <WinnerScreen
        players={players}
        myId={myId}
        onPlayAgain={reset}
      />
    )
  }

  return null
}
