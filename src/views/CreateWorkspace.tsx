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
import { createWorkspace } from '../data/create-workspace';
import { auth, firestore } from '../firebase';

const Wrapper = styled.div`
  padding: 24px;
  width: 530px;
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

const ButtonLabel = styled.div`
  ${(p: { show: boolean }) =>
    !p.show &&
    css`
      opacity: 0;
    `};
`;

const CreateWorkspace = () => {
  const [name, setName] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState(false);
  const { user } = useAuthState(auth);

  async function handleCreate() {
    if (name.trim()) {
      setShowSpinner(true);
      await createWorkspace(name);
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
              label="Name"
              margin="normal"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              autoFocus
            />
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
