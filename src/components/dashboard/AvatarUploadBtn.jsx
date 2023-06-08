import React, { useRef, useState } from 'react'
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';
import AvatarEditor from 'react-avatar-editor'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ref as dbref, update } from 'firebase/database';
import { database, storage } from '../../misc/firebase';
import { useProfileContext } from '../../context/profile.context';
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';

const fileInputTypes = '.png, .jpeg, jpg';
const acceptedFileType = ['image/png', 'image/jpeg', 'image/jpg'];
const isValidFile = (file) => acceptedFileType.includes(file.type);
const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('File process error'));
      }
    })
  })
}

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const { profile } = useProfileContext();
  const [img, setImg] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const avtarEditorRef = useRef();

  const onFileInputChange = (e) => {
    const currFiles = e.target.files;
    const file = currFiles[0];
    if (isValidFile(file)) {
      setImg(file);
      open();
    } 
  }
  
  const onUploadClick = async () => {
    const canvas = avtarEditorRef.current.getImageScaledToCanvas();
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = ref(storage, `/profile/${profile.uid}/avatar`);

      setIsLoading(true);

      await uploadBytes(avatarFileRef, blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      })
      
      const downloadUrl = await getDownloadURL(avatarFileRef);
      const updates = await getUserUpdates(profile.uid, 'avatar', downloadUrl, database);

      await update(dbref(database), updates);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  }

  return (
    <div className='mt-3 text-center'>
        <ProfileAvatar src={profile.avatar} name={profile.name} className='width-200 height-200 img-fullsize'/>
      <div>
        <label>
          Select new avatar
          <input id='avatar-upload' type='file' className='d-none' accept={fileInputTypes} onChange={onFileInputChange}/>
        </label>
        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='d-flex justify-content-center align-items-center h-100'>
              {img && 
                  (<AvatarEditor
                    image={img}
                    width={250}
                    height={250}
                    border={10}
                    borderRadius={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                    ref={avtarEditorRef} 
                  />)
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button block appearance='ghost' onClick={onUploadClick} disabled={isLoading}>Upload new avatar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )
}

export default AvatarUploadBtn