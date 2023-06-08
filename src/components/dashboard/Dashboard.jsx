import React from 'react'
import { Button, Drawer } from 'rsuite'
import { isOfflineForDatabase, useProfileContext } from '../../context/profile.context'
import { auth, database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import { ref, set, update } from 'firebase/database';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProfileAvatar from '../ProfileAvatar';
import { getUserUpdates } from '../../misc/helpers';

const Dashboard = () => {
  const { profile } = useProfileContext();

  const onSignOut = () => {
    set(ref(database, `status/${profile.uid}`), isOfflineForDatabase).then(() => auth.signOut());
  }

  const onSave = async newData => {
    const updates = await getUserUpdates(profile.uid, 'name', newData, database);
    console.log(updates)
    try {
      await update(ref(database), updates);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Drawer.Header>
        <div style={{ display: 'flex', alignItems: 'center', gap:'10px' }}>
          <ProfileAvatar src={profile.avatar} name={profile.name} size="lg"/>
          <h3>Hey, {profile.name}</h3>
        </div>          
      </Drawer.Header>
      <Drawer.Body style={{display:'flex', flexDirection:'column', gap: '50px', padding:'10px'}}>        
          <EditableInput name='nickname' initialValue={profile.name} onSave={onSave} label={<h6 className='mb-2'>Nickname</h6>} />
          <AvatarUploadBtn/>
          <Button block color='red' appearance='primary' onClick={onSignOut}>Sign out</Button>
      </Drawer.Body>
    </>
  )
}
  
export default Dashboard