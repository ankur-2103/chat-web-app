import { Navigate } from 'react-router-dom'
import { useProfileContext } from '../context/profile.context';
import { Container, Loader } from 'rsuite';

const PrivateRoute = ({ children, ...routeProps }) => {
    
    const { profile, isLoading } = useProfileContext();
    
    if (isLoading) {
        return (
            <Container>
                <Loader center vertical size='md' content='Loading...' speed='slow' />
            </Container>
        );
    }

    return profile ? children : <Navigate to="/signin"/>
}

export default PrivateRoute