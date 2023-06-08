import { Button, Col, Container, Grid, Panel, Row } from "rsuite"
import {BsGoogle} from 'react-icons/bs'
import { GoogleAuthProvider, getAdditionalUserInfo, signInWithPopup } from "firebase/auth"
import { auth, database } from "../misc/firebase"
import { ref, serverTimestamp, set } from "firebase/database"

const Signin = () => {

  const signInWithProvider = async (provider) => {
    try {
      const credentials = await signInWithPopup(auth, provider).catch((err) => console.log(err));
      const userMeta = getAdditionalUserInfo(credentials);
      if (userMeta.isNewUser) {
        await set(ref(database, `/profiles/${credentials.user.uid}`), {
          name: credentials.user.displayName,
          createdAt: serverTimestamp()
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onGoogleSignIn = () => {
    signInWithProvider(new GoogleAuthProvider());
  }

  return (
    <Container className="mt-page">
      <Grid>
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to chat</h2>
                <p>Prorogressive chat platform</p>
              </div>

              <div className="mt-3">
                <Button block color="green" appearance="primary" onClick={onGoogleSignIn}>
                  <BsGoogle/> Continue with Google
                </Button>
              </div>

            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  )
}

export default Signin