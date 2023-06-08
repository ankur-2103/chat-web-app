import { Col, Grid, Row } from "rsuite"
import Sidebar from "../components/Sidebar"
import { RoomsContextProvider } from "../context/rooms.context"
import { Route, Routes, useMatch } from "react-router-dom"
import Chat from "./Chat"
import { useMediaQuery } from "../misc/custom-hooks"

const Home = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const match = useMatch('/');
  const canRen = isDesktop || (match && match.pattern.end);
  return (
    <RoomsContextProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {
            canRen &&
          <Col xs={24} md={8} className="h-100">
            <Sidebar/> 
          </Col>
          }

          <Routes>
              <Route exact path="/chats/:chatId" element={<Col xs={24} md={16} className="h-100"><Chat /></Col>} />
              { isDesktop && <Route path="*" element={<Col xs={24} md={16} className="h-100"><h6 className="text-center mt-page">Please select chat</h6></Col>} />}
          </Routes>

        </Row>
      </Grid> 
    </RoomsContextProvider>
  )
}

export default Home