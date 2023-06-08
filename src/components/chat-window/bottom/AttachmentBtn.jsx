import React, { useState } from 'react';
import { useParams } from 'react-router';
import { InputGroup, Modal, Button, Uploader} from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AttachmentIcon from '@rsuite/icons/Attachment';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtn = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, close, open } = useModalState();

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
        const uploadPromises = fileList.map(f => {
            return uploadBytes(
                ref(storage, `/chat/${chatId}/${Date.now() + f.name}`),
                f.blobFile,
                {
                    cacheControl: `public, max-age=${3600 * 24 * 3}`,
                }
            );
        });
    

        const uploadSnapshots = await Promise.all(uploadPromises);

        const shapePromises = uploadSnapshots.map(async snap => {
        return {
            contentType: snap.metadata.contentType,
            name: snap.metadata.name,
            url: await getDownloadURL(snap.ref),
        };
        });

        const files = await Promise.all(shapePromises);

        await afterUpload(files);

        setIsLoading(false);
        close();
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
        <InputGroup.Button onClick={open} startIcon={<AttachmentIcon/>}>
        </InputGroup.Button>
        <Modal open={isOpen} onClose={close}>
            <Modal.Header>
              <Modal.Title>Upload files</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Uploader
                    autoUpload={false}
                    action=""
                    fileList={fileList}
                    onChange={onChange}
                    multiple
                    listType="picture-text"
                    className="w-100"
                    disabled={isLoading}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button block disabled={isLoading} onClick={onUpload}>
                    Send to chat
                </Button>
                <div className="text-right mt-2">
                    <small>* only files less than 5 mb are allowed</small>
                </div>
            </Modal.Footer>
        </Modal>
    </>
  );
};

export default AttachmentBtn;