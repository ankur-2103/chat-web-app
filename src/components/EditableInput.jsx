import { useState } from 'react';
import { IconButton, Input, InputGroup } from 'rsuite';
import CloseIcon from '@rsuite/icons/Close';
import EditIcon from '@rsuite/icons/Edit';
import CheckIcon from '@rsuite/icons/Check';

const EditableInput = ({initialValue, onSave, label=null, placeholder='Write your value', wrapclassname='' ,emptyMsg='Input is empty', ...inputProps}) => {
    const [input, setInput] = useState(initialValue);
    const [isEditable, setIsEditable] = useState(false);

    const onSaveClick = () => {
        onSave(input.trim());
        setIsEditable(false)
    }
    return (
        <div className={wrapclassname}>
            {label}
            <InputGroup fluid='true'>
                <Input {...inputProps} value={input} onChange={(e) => setInput(e)} disabled={!isEditable} />
                <IconButton icon={isEditable ? <CloseIcon/> : <EditIcon/>} onClick={()=>setIsEditable(!isEditable)} />
                {isEditable && <IconButton icon={<CheckIcon/>} onClick={()=>onSaveClick()} color='green' appearance='primary'/>}
            </InputGroup>
        </div>
    )
}

export default EditableInput