import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';
import { Link } from 'react-router-dom';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, close, open } = useModalState();

  const { name, avatar, createdAt } = profile;

  const shortName = profile.name.split(' ')[0];

  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button appearance='link' {...btnProps} onClick={open} as='a' >
        {shortName}
      </Button>
      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            name={name}
            className="width-200 height-200 img-fullsize font-huge"
          />

          <h4 className="mt-2">{name}</h4>

          <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block onClick={close} appearance='primary' color='blue'>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;