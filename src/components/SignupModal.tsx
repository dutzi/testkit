import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
// import firebase from 'firebase';
import { auth } from '../firebase';

const Wrapper = styled.div``;

const Submit = styled.input`
  opacity: 0;
`;

const Error = styled.div`
  margin-top: 12px;
  color: red;
`;

type Mode = 'signup' | 'signin';

const SignupModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState<Mode>('signup');

  function resetErrorMessage() {
    setErrorMessage('');
  }

  function handleSignin() {
    setMode('signin');
    resetErrorMessage();
  }

  function handleSignup() {
    setMode('signup');
    resetErrorMessage();
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }
    if (mode === 'signup') {
      try {
        await auth.createUserWithEmailAndPassword(email, password);
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      try {
        await auth.signInWithEmailAndPassword(email, password);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
    resetErrorMessage();
  }
  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value);
    resetErrorMessage();
  }

  const title = mode === 'signup' ? 'Signup' : 'Login';

  return (
    <Wrapper>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={true}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <form action="login" method="post" onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          <DialogContent>
            {mode === 'signup' && (
              <DialogContentText>
                Already a user?{' '}
                <Link href="#login" onClick={handleSignin}>
                  Login
                </Link>
              </DialogContentText>
            )}
            {mode === 'signin' && (
              <DialogContentText>
                Not a user?{' '}
                <Link href="#login" onClick={handleSignup}>
                  Signup
                </Link>
              </DialogContentText>
            )}
            <TextField
              value={email}
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              onChange={handleEmailChange}
              onSubmit={handleSubmit}
            />
            <TextField
              value={password}
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              onChange={handlePasswordChange}
              onSubmit={handleSubmit}
            />
            {errorMessage && <Error>{errorMessage}</Error>}
          </DialogContent>
          <DialogActions>
            <Submit tabIndex={-1} type="submit" onClick={handleSubmit} />
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {title}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Wrapper>
  );
};

export default SignupModal;
