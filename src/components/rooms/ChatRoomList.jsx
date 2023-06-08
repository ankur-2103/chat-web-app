import React from 'react'
import { Loader, Nav } from 'rsuite'
import RoomItem from './RoomItem'
import { useRoomsContext } from '../../context/rooms.context'
import { Link } from 'react-router-dom'

const ChatRoomList = ({ aboveElHeight }) => {
    
    const { rooms } = useRoomsContext();

    return (
        <Nav appearance='subtle' vertical reversed className='overflow-y-scroll custom-scroll' style={{ height: `calc(100% - ${aboveElHeight}px)` }}>
            {!rooms && <Loader center vertical size='md' content='Loading...' speed='slow' />}
            {rooms && rooms.length > 0 && rooms.map(room =>
                <Nav.Item as={Link} key={room.id} to={`/chats/${room.id}`}>
                    <RoomItem room={room} />
                </Nav.Item>
            )}
        </Nav>
    )
}

export default ChatRoomList