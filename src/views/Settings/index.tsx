import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { MarginH } from '../../styles';
import { firestore } from '../../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { WorkspaceContext } from '../ContextProviders';
import Import from './Import';
import Users from './Users';

const Wrapper = styled.div`
  max-width: 60%;
  margin: 50px auto;
`;

const Settings = () => {
  const workspace = useContext(WorkspaceContext);

  return (
    <Wrapper>
      <Typography variant="h4">{workspace!.name}</Typography>
      <MarginH />
      <Users />
      <MarginH />
      <Import />
      <MarginH />
    </Wrapper>
  );
};

export default Settings;
