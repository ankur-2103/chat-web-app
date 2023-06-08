import React from 'react'
import ProfileAvatar from '../../ProfileAvatar'
import TimeAgo from 'timeago-react'
import ProfileInfoBtnModal from './ProfileInfoBtn'
import PresenceDot from '../../PresenceDot'
import { useCurrentRoomContext } from '../../../context/chatroom.context'
import { auth } from '../../../misc/firebase'
import { Button } from 'rsuite'
import { useHover, useMediaQuery } from '../../../misc/custom-hooks'
import IconBtnControl from './IconBtnContorl'
import { AiOutlineHeart } from 'react-icons/ai'
import { AiFillHeart } from 'react-icons/ai'
import TrashIcon from '@rsuite/icons/Trash';
import ImgBtnModal from './ImgBtnModal'

const renderFileMessage = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImgBtnModal src={file.url} fileName={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    );
  }
}

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
    
  const { author, createdAt, text, likes, likeCount, file } = message;
  const [selfRef, isHovered] = useHover();
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isAdmin = useCurrentRoomContext(v => v.isAdmin)
  const admins = useCurrentRoomContext(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const canShowIcon = isMobile || isHovered;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`} ref={selfRef}>
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid}/>
        <ProfileAvatar
            src={author.avatar}
            name={author.name}
            className="ml-1"
            size="xs"
        />

        <ProfileInfoBtnModal profile={author} className="p-0 ml-1 text-black">
        {canGrantAdmin &&
          <Button block onClick={() => handleAdmin(author.uid)} color="green" appearance='primary'>
              {isMsgAuthorAdmin
                ? 'Remove admin permission'
                : 'Give admin permission in this room'}
          </Button>}
        </ProfileInfoBtnModal>     
        
        <TimeAgo
            datetime={createdAt}
            className="font-normal text-black-45 ml-2"
        />

        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcon || isLiked}
          iconName={isLiked ? <AiFillHeart/> : <AiOutlineHeart/>}
          tooltip={isLiked ? "Unlike this message" : "Like this message"}
          onClick={() => handleLike(message.id)}
          badgeContent={likeCount}
          appearance="primary" 
        />

        {isAuthor && 
          <IconBtnControl
          isVisible={canShowIcon}
          iconName={<TrashIcon />}
          tooltip={"Delete this message"}
          onClick={()=>handleDelete(message.id)}
          />
        }
      </div>

      <div>
        {text && <span className="word-breal-all">{text}</span>}
        {file && renderFileMessage(file)}
      </div>
    </li>
  )
}

export default MessageItem