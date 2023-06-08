import React from 'react'
import TimeAgo from 'timeago-react'
import ProfileAvatar from '../ProfileAvatar'

const RoomItem = ({room}) => {
    return (
        <div>
            <div className='d-flex justify-content-between align-items-center'>
                <h3 className='text-disappear'>{room.name && room.name}</h3>
                <TimeAgo datetime={room.lastMessage ? new Date(room.lastMessage.createdAt) :new Date(room.createdAt)} className='font-normal text-back-45'/>
            </div>
            <div className='d-flex align-item-center text-black-70'>
                {room.lastMessage ? 
                    <>
                        <div className='d-flex align-items-center'>
                            <ProfileAvatar src={room.lastMessage.author.avatar} name={room.lastMessage.author.name} size="sm"/>
                        </div>
                        <div className='text-disappear ml-2'>
                            <div className='italic'>{room.lastMessage.author.name}</div>
                            <span>{room.lastMessage.text || room.lastMessage.file.name}</span>
                        </div>
                    </>
                 : <span>No messages yet...</span>}
            </div>
        </div>
    )
}

export default RoomItem