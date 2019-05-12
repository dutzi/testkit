import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../components/Logo';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { MarginH } from '../styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { createWorkspace } from '../data/create-workspace';

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

const CreateWorkspace = () => {
  const [name, setName] = useState<string>('');

  function handleCreate() {
    createWorkspace(name);
  }

  return (
    <Wrapper>
      <Logo />
      <MarginH />
      <Paper>
        <Padder>
          <Typography variant="h6">Start A Workspace</Typography>
          <Typography variant="body1">
            What is the name of your company?
          </Typography>
          <TextField
            id="standard-required"
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
              Create A Workspace
            </Button>
          </FlexEnd>
        </Padder>
      </Paper>
    </Wrapper>
  );
};

export default CreateWorkspace;
