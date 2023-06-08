import { Routes, Route, BrowserRouter } from 'react-router-dom';
import 'rsuite/dist/rsuite.css';
import './styles/main.scss';
import Signin from './pages/Signin';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileContextProvider } from './context/profile.context';
import { CustomProvider } from 'rsuite';

function App() {
  return (
    <>
      <ProfileContextProvider>
      <CustomProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<PublicRoute><Signin/></PublicRoute>}></Route>
          <Route path='*' element={<PrivateRoute><Home/></PrivateRoute>}></Route>
        </Routes>
      </BrowserRouter>
      </CustomProvider>
    </ProfileContextProvider>
    </>
  );
}

export default App;
