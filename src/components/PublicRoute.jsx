import { Navigate } from 'react-router-dom'
import { useProfileContext } from '../context/profile.context';
import { Container, Loader } from 'rsuite';

const PublicRoute = ({ children, ...routeProps }) => {
    
    const {profile, isLoading} = useProfileContext();

    if (isLoading) {
        return (
            <Container>
                <Loader center vertical size='md' content='Loading...' speed='slow'/>
            </Container>
        )
    }

    return profile===false ? children : <Navigate to="/"/>
}

export default PublicRoute