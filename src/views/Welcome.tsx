import React, { useState } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MarginH } from '../styles';
import { auth } from '../firebase';
import Logo from '../components/Logo';
import SignupModal from '../components/SignupModal';

const Wrapper = styled.div`
  padding: 24px;
  width: 530px;
  max-width: calc(100% - 24px * 2);
  margin: auto;
`;

const Padder = styled.div`
  padding: 24px;
`;

const Welcome = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  function handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  function handleEmailSignin() {
    setShowRegistrationModal(true);
  }

  function handleCloseSignupModal() {
    setShowRegistrationModal(false);
  }

  return (
    <Wrapper>
      <Logo />
      <MarginH />
      <Paper>
        <Padder>
          <Typography variant="h6">
            Welcome to the beta{' '}
            <span role="img" aria-label="smiley">
              😃
            </span>
          </Typography>
          <MarginH />
          <Typography variant="body1">
            We will be rolling out features on a biweekly basis.
          </Typography>
          <MarginH />
          <Typography variant="body1">
            Let's get started by signin you up!
          </Typography>
          <MarginH />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGoogleSignIn}
          >
            Sign In With Google
          </Button>
          <MarginH margin="12px" />
          <Button variant="text" color="default" onClick={handleEmailSignin}>
            Sign Up With Email
          </Button>
        </Padder>
      </Paper>
      {showRegistrationModal && (
        <SignupModal onClose={handleCloseSignupModal} />
      )}
    </Wrapper>
  );
};

export default Welcome;
