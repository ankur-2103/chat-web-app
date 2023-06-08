import React, {useRef, useState} from "react";
import { Button, Form, Modal, Input, Schema} from "rsuite"
import { useModalState } from "../misc/custom-hooks"
import CreativeIcon from '@rsuite/icons/Creative';
import { auth, database } from "../misc/firebase";
import { child, push, ref, serverTimestamp } from "firebase/database";

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const INITIAL_FORM = {
    name: '',
    description: ''
}


const model = Schema.Model({
    name: Schema.Types.StringType().isRequired('Room name is required.'),
    description: Schema.Types.StringType().isRequired('Description is required.')
})

const CreateRoomBtnModal = () => {
    const { isOpen, open, close } = useModalState();
    const [formValue, setFormValue] = useState(INITIAL_FORM);
    const [isLoading, setLoading] = useState(false);
    const formRef = useRef();

    const onFormValueChange = (value) => {
        setFormValue(value)
    }

    const onSubmit = async () => {
        if (!formRef.current.check()) {
            return;
        }
        setLoading(true);

        const newRoomData = {
            ...formValue,
            createdAt: serverTimestamp(),
            admins: {
                [auth.currentUser.uid]: true,
            }
        }

        try {
            await push(child(ref(database), 'rooms'), newRoomData).key;
            setLoading(false);
            setFormValue(INITIAL_FORM);
            close();
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

    }

    return (
        <div className="mt-2 text-center">
            <Button block color="green" onClick={open} appearance="primary">
                <CreativeIcon/> Create new chat room
            </Button>

            <Modal open={isOpen} onClose={close} backdrop='false'>
                <Modal.Header>
                    <Modal.Title>New Chat Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form fluid onChange={onFormValueChange} formValue={formValue} model={model} ref={formRef}>
                        <Form.Group controlId="name">
                            <Form.ControlLabel>Room name</Form.ControlLabel>
                            <Form.Control name="name" placeholder="Enter chat room name..." />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.ControlLabel>Description</Form.ControlLabel>
                            <Form.Control rows={5} name="description" accepter={Textarea} placeholder='Enter room description...'/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button block appearance="primary" onClick={onSubmit} disabled={isLoading}>Create new chat room</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateRoomBtnModal