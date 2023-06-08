import { Input, InputGroup } from "rsuite"
import SendIcon from '@rsuite/icons/Send';
import { useState } from "react";
import { child, push, ref, serverTimestamp, set, update } from "firebase/database";
import { useParams } from "react-router-dom";
import { useProfileContext } from "../../../context/profile.context";
import { database } from "../../../misc/firebase";
import AttachmentBtn from "./AttachmentBtn";
import AudioMsgBtn from "./AudioMsgBtn";

const createMessage = (profile, chatId) => {
    return {
        roomId: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? {avatar: profile.avatar} : {})
        },
        createdAt: serverTimestamp(),
        likeCount: 0
    }
}
const Bottom = () => {


    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {chatId} = useParams();
    const { profile } = useProfileContext();

    const onSendClick = async () => {
        if (input.trim === "" || input.length===0) {
            return;
        }
        const data = createMessage(profile, chatId);
        data.text = input;
        setIsLoading(true);
        try {
            const messageId = await push(child(ref(database), 'messages'), data).key
            await set(ref(database,`rooms/${chatId}/lastMessage`), { ...data, messageId });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
        setIsLoading(false);
        setInput('')
    }
    
    const afterUpload = async files => {
    
        setIsLoading(true);
    
        const updates = {};
    
        files.forEach(file => {
            const msgData = createMessage(profile, chatId);
            msgData.file = file;
    
            const messageId = push(ref(database, 'messages')).key;
    
            updates[`/messages/${messageId}`] = msgData;
        });
    
        const lastMsgId = Object.keys(updates).pop();
    
        updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
        };
    
        console.log(updates)
        
        try {
            await update(ref(database), updates);
            setIsLoading(false);
        } catch (err) {
            console.log(err)
            setIsLoading(false);
        }
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            onSendClick();
        }
    }

    return (
        <div>
            <InputGroup>
                <AttachmentBtn afterUpload={afterUpload} />
                <AudioMsgBtn afterUpload={afterUpload}/>
                <Input placeholder="Write a new message here..." value={input} onChange={(e)=>setInput(e)} onKeyDown={onKeyDown}/>
                <InputGroup.Button color="blue" appearance="primary" onClick={onSendClick} disabled={isLoading}><SendIcon/></InputGroup.Button>
            </InputGroup>      
        </div>
    )
}

export default Bottom