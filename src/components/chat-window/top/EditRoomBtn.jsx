import { Button, Drawer, Alert } from 'rsuite';
import { useParams } from 'react-router';
import { useModalState, useMediaQuery } from '../../../misc/custom-hooks';
import EditableInput from '../../EditableInput';
import { database } from '../../../misc/firebase';
import { ref, set } from 'firebase/database';
import { useCurrentRoomContext } from '../../../context/chatroom.context';

const EditRoomBtn = () => {
    const { isOpen, open, close } = useModalState();
    const { chatId } = useParams();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const name = useCurrentRoomContext(v => v.name);
    const description = useCurrentRoomContext(v => v.description);

    const updateData = async (key, value) => {
        await set(ref(database, `rooms/${chatId}/${key}`), value)
    };

    const onNameSave = newName => {
        updateData('name', newName);
    };

    const onDescriptionSave = newDesc => {
        updateData('description', newDesc);
    };

    return (
        <div>
            <Button className="br-circle" size="sm" color="red" appearance='primary' onClick={open}>
                A
            </Button>

            <Drawer size={isMobile ? 'full' : 'sm'} open={isOpen} onClose={close} placement="right">
                <Drawer.Header>
                    <Drawer.Title>Edit Room</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    <EditableInput
                        initialValue={name}
                        onSave={onNameSave}
                        label={<h6 className="mb-2">Name</h6>}
                        emptyMsg="Name can not be empty"
                    />
                    <EditableInput
                        as="textarea"
                        rows={5}
                        initialValue={description}
                        onSave={onDescriptionSave}
                        emptyMsg="Description can not be empty"
                        wrapclassname="mt-3"
                    />
                </Drawer.Body>
                
            </Drawer>
        </div>
    );
};

export default EditRoomBtn;