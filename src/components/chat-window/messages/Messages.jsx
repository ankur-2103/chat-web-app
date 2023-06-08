import { equalTo, limitToLast, off, onValue, orderByChild, query, ref, runTransaction, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { auth, database, storage } from "../../../misc/firebase";
import { groupBy, transformToArrayWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { Button } from "rsuite";

const PAGE_SIZE = 15;
const messagesRef = ref(database, 'messages');

const shouldScrollToBottom = (node, threshold = 30) => {
    const percentage = (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;
    return percentage > threshold;
}

const Messages = () => {

    const { chatId } = useParams();
    const [messages, setMessages] = useState(null);
    const [limit, setLimit] = useState(PAGE_SIZE);
    const selfRef = useRef();

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;

    const loadMessages = (limitToLastMsg) => {
        off(messagesRef)

        const node = selfRef.current;
        
        onValue(query(messagesRef, orderByChild('roomId'), equalTo(chatId), limitToLast(limitToLastMsg || PAGE_SIZE)), (snap) => {
            const data = transformToArrayWithId(snap.val());
            setMessages(data)

            if (shouldScrollToBottom(node)) {
                node.scrollTop = node.scrollHeight;
            }
        })

        setLimit(p => p + PAGE_SIZE);
    }

    const onLoadMore = () => {
        const node = selfRef.current;
        const oldHeight = node.scrollHeight;
        
        loadMessages(limit);
        
        setTimeout(() => {
            const newHeight = node.scrollHeight;
            node.scrollTop = newHeight - oldHeight;
        }, 500);
    }

    useEffect(() => {
        const node = selfRef.current;

        loadMessages();

        setTimeout(()=>{node.scrollTop = node.scrollHeight},500)

        return () => {
            off(messagesRef);
        }
    }, [chatId])
    
    const handleAdmin = async (uid) => {
        const adminRef = ref(database, `rooms/${chatId}/admins`);
        await runTransaction(adminRef, (admins) => {
            if (admins) {
                if (admins[uid]) {
                    admins[uid] = null;
                } else {
                    admins[uid] = true;
                }
            }
            return admins;
        });
    }
    
    const handleLike = async(id) => {
        const { uid } = auth.currentUser;
        const messageRef = ref(database, `messages/${id}`);
        await runTransaction(messageRef, (msg) => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    msg.likeCount -= 1;
                    msg.likes[uid] = null;
                } else {
                    if (!msg.likes) {
                        msg.likes = {};
                        msg.likeCount = 0;
                    }
                    
                    msg.likeCount += 1;
                    msg.likes[uid] = true;
                }
            } 
        
            return msg;
        });
    }

    const handleDelete = async (id, file) => {
        if (!window.confirm("Delete this message")) {
            return;
        }

        const isLast = messages[messages.length - 1].id === id;

        const updates = {};

        updates[`/messages/${id}`] = null;

        if (isLast && messages.length > 1) {
                updates[`/rooms/${chatId}/lastMessage`] = {
                ...messages[messages.length - 2],
                msgId: messages[messages.length - 2].id,
            };
        }

        if (isLast && messages.length === 1) {
            updates[`/rooms/${chatId}/lastMessage`] = null;
        }

        try {
            await update(ref(database), updates);
            if (file) {
                const fileRef = storageRef(storage, file.url);
                await deleteObject(fileRef);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const renderMessages = () => {
        const groups = groupBy(messages, item =>
          new Date(item.createdAt).toDateString()
        );
    
        const items = [];
    
        Object.keys(groups).forEach(date => {
          items.push(
            <li key={date} className="text-center mb-1 padded">
              {date}
            </li>
          );
    
          const msgs = groups[date].map(msg => (
            <MessageItem
              key={msg.id}
              message={msg}
              handleAdmin={handleAdmin}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          ));
    
          items.push(...msgs);
        });
    
        return items;
      };

    return (
        <ul ref={selfRef} className="msg-list custom-scroll">
            {messages && messages.length >= PAGE_SIZE && (
                <li className="text-center mt-2 mb-2">
                    <Button color="green" appearance="primary" onClick={onLoadMore}>Load more</Button>
                </li>
            )}
            {isChatEmpty && <li>No messages yet</li>}
            {canShowMessages && renderMessages()}
        </ul>
    )
}

export default Messages