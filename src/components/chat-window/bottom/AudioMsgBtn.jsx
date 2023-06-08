import React, { useState } from 'react'
import { Button, InputGroup, Modal } from 'rsuite'
import {BiMicrophone} from 'react-icons/bi'
import { useAudioRecoder, useModalState } from '../../../misc/custom-hooks'
import SendIcon from '@rsuite/icons/Send';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../misc/firebase';
import { useParams } from 'react-router-dom';

const AudioMsgBtn = ({afterUpload}) => {
    
    const { isOpen, close, open } = useModalState();
    const [recordingStatus, onStartRecording, onStopRecording, audioBlob, audioFile] = useAudioRecoder()
    const [isUploading, setIsUploading] = useState(false);
    const {chatId} = useParams()

    const handleOnClick = () => {
        if (recordingStatus==='inactive') {
            onStartRecording()
        } else {
            onStopRecording();
            open();
        }
    }

    const onUpload = async () => {
        setIsUploading(true);
        try {
            const snap = await uploadBytes(ref(storage, `/chat/${chatId}/audio_${Date.now()}.mp3`), audioBlob, {
                cacheControl: `public, max-age=${3600 * 24 * 3}`,
            });

            const file = {
                contentType: snap.metadata.contentType,
                name: snap.metadata.name,
                url: await getDownloadURL(snap.ref),
            };

            setIsUploading(false);
            afterUpload([file]);
            close();
        } catch (error) {
            console.log(error)
            setIsUploading(false);
        }
    }

    return (
        <>
        <InputGroup.Button disabled={isUploading} onClick={handleOnClick} className={recordingStatus === 'recording' ? 'animate-blink' : ''}><BiMicrophone /></InputGroup.Button>
        <Modal open={audioFile && isOpen} onClose={close}>
            <Modal.Header>Audio</Modal.Header>
            <Modal.Body>{audioFile && <audio src={audioFile} controls></audio>}</Modal.Body>
            <Modal.Footer><Button color='blue' disabled={isUploading} onClick={onUpload} appearance='primary' endIcon={<SendIcon/>}>Send</Button></Modal.Footer>
        </Modal>
        </>
  )
}

export default AudioMsgBtn