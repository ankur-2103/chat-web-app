import { Button, Modal } from "rsuite";
import { useCurrentRoomContext } from "../../../context/chatroom.context";
import { useModalState } from "../../../misc/custom-hooks"

const RoomInfoBtn = () => {
    const { isOpen, open, close } = useModalState();
    const name = useCurrentRoomContext(v => v.name);
    const description = useCurrentRoomContext(v => v.description);
    return (
        <div>
            <Button appearance="link" className="px-0" onClick={open}>Room information</Button>
            <Modal open={isOpen} onClose={close} backdrop='false'>
                <Modal.Header><Modal.Title>About {name}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <h6 className="mb-1">Description</h6>
                    <p>{description}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button block onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RoomInfoBtn