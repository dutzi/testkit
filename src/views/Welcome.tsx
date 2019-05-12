import React from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MarginH } from '../styles';
import { auth}  from '../firebase';
import Logo from '../components/Logo';

const Wrapper = styled.div`
  padding: 24px;
  width: 530px;
  margin: auto;
`;

const Padder = styled.div`
  padding: 24px;
`;

const Welcome = () => {
  function handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <Wrapper>
      <Logo />
      <MarginH />
      <Paper>
        <Padder>
          <Typography variant="h6">Welcome to the beta 😃</Typography>
          <MarginH />
          <Typography variant="body1">
            We will be rolling out features on a weekly basis.
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
        </Padder>
      </Paper>
    </Wrapper>
  );
};

export default Welcome;
