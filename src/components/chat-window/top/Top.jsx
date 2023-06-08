import React from 'react'
import { useCurrentRoomContext } from '../../../context/chatroom.context'
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar, IconButton } from 'rsuite';
import { useMediaQuery } from '../../../misc/custom-hooks';
import RoomInfoBtn from './RoomInfoBtn';
import EditRoomBtn from './EditRoomBtn';

const Top = () => {
  const name = useCurrentRoomContext(v => v.name);
  const isMobile = useMediaQuery('(max-width: 767.5px)');
  const isAdmin = useCurrentRoomContext(v => v.isAdmin)

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='text-disappear'><IconButton as={Link} to='/' icon={<ArrowLeftLineIcon />} className={isMobile ? 'd-inline-block p-0 mr-2 text-blue link-unstyled' : 'd-none'} /><span className='text-disappear'>{name}</span></h4>
        {isAdmin && <EditRoomBtn className='ws-nowrap'/>}
      </div>
      <div className='d-flex justify-content-between align-items-center'>
        <span>todo</span>
        <RoomInfoBtn/>
      </div>
    </div>
  )
}

export default Top