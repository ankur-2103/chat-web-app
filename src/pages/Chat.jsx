import React from 'react'
import Top from '../components/chat-window/top/Top'
import Messages from '../components/chat-window/messages/Messages'
import Bottom from '../components/chat-window/bottom/Bottom'
import { useParams } from 'react-router-dom'
import { useRoomsContext } from '../context/rooms.context'
import { Loader } from 'rsuite'
import { CurrentRoomContextProvider } from '../context/chatroom.context'
import { auth } from '../misc/firebase'
import { transformToArr } from '../misc/helpers'

const Chat = () => {

  const { chatId } = useParams();

  const { rooms } = useRoomsContext();

  if (!rooms) {
    return <Loader center vertical size='md' content='Loading...' speed='slow' />
  }

  const currRoom = rooms.find(room => room.id === chatId);

  if (!currRoom) {
    return <h6 className='text-center mt-page'>Chat {chatId} not found</h6>
  }

  const { name, description } = currRoom
  
  const admins = transformToArr(currRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentRoomData = {
    name, description, admins, isAdmin
  }

  return (
    <CurrentRoomContextProvider data={currentRoomData}>
      <div className='chat-top'><Top/></div>
      <div className='chat-middle'><Messages/></div>
      <div className='chat-bottom'><Bottom/></div>
    </CurrentRoomContextProvider>
  )
}

export default Chat