import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import Logo from '../components/Logo';
import Typography from '@material-ui/core/Typography';
import { useAuthState } from 'react-firebase-hooks/auth';
import Paper from '@material-ui/core/Paper';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { MarginH } from '../styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createWorkspace } from '../clients/create-workspace';
import { auth } from '../firebase';

const Wrapper = styled.div`
  padding: 24px;
  width: 530px;
  max-width: calc(100% - 24px * 2);
  margin: auto;
`;

const Padder = styled.div`
  padding: 24px;
`;

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PacmanWrapper = styled.div`
  transform: translateX(50px) translateY(-4px);
`;

const Error = styled.div`
  color: #f55246;
  float: left;
`;

const ButtonLabel = styled.div`
  ${(p: { show: boolean }) =>
    !p.show &&
    css`
      opacity: 0;
    `};
`;

const CreateWorkspace = () => {
  const [name, setName] = useState('');
  const [nameIsTaken, setNameIsTaken] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const { user } = useAuthState(auth);

  async function handleCreate() {
    if (name.trim()) {
      setShowSpinner(true);
      const idToken = await auth.currentUser!.getIdToken(true);
      const email = await auth.currentUser!.email;

      if (!email) {
        return;
      }

      try {
        let res = await createWorkspace(name, email, idToken);
        console.log(res.data.status);
      } catch (err) {
        if (err.response.data.error === 'NameIsTaken') {
          setNameIsTaken(true);
        }
      }
      setShowSpinner(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleCreate();
  }

  function handleLogout() {
    auth.signOut();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setNameIsTaken(false);
  }

  let displayName = '';
  if (user) {
    displayName = user.displayName || '';
  }

  return (
    <Wrapper>
      <Logo />
      <MarginH />
      <Paper>
        <Padder>
          <Typography variant="h5">Hi {displayName},</Typography>
          <MarginH margin="2px" />

          <Typography variant="h6">Now, lets create a workspace.</Typography>
          <MarginH margin="24px" />
          <Typography variant="body1">
            What is the name of your company?
          </Typography>
          <form action="#" onSubmit={handleSubmit}>
            <TextField
              id="standard-required"
              variant="outlined"
              label={'Name'}
              margin="normal"
              error={nameIsTaken}
              value={name}
              onChange={handleChange}
              fullWidth
              autoFocus
            />
            {nameIsTaken && (
              <Error>
                That name is already taken{' '}
                <span role="img" aria-label="sad face">
                  😞
                </span>
              </Error>
            )}
            <MarginH />
            <FlexEnd>
              <Button
                disabled={!name}
                variant="contained"
                color="primary"
                onClick={handleCreate}
              >
                {showSpinner && (
                  <PacmanWrapper>
                    <PacmanLoader size={10} color="white" />
                  </PacmanWrapper>
                )}
                <ButtonLabel show={!showSpinner}>
                  Create A Workspace
                </ButtonLabel>
              </Button>
            </FlexEnd>
          </form>
        </Padder>
      </Paper>
      <MarginH />
      <Button onClick={handleLogout}>Sign Out</Button>
    </Wrapper>
  );
};

export default CreateWorkspace;
