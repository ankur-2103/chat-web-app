import { useMediaQuery, useModalState } from '../../misc/custom-hooks'
import { Button, Drawer } from 'rsuite';
import DashboardIcon from '@rsuite/icons/Dashboard';
import Dashboard from './Dashboard';

const DashboardToggle = () => {

    const { isOpen, open, close } = useModalState();
    const isMobile = useMediaQuery('(max-width:992px)')

  return (
    <>
        <Button block color='blue' onClick={open} backdrop='false' appearance='primary'>
          <DashboardIcon />Dashborad
        </Button>
        <Drawer full={isMobile} placement={'left'} open={isOpen} onClose={close} >
          <Dashboard/>
        </Drawer>
    </>
    )
}

export default DashboardToggle