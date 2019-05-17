import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { MarginH } from '../../styles';
import { firestore } from '../../firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { WorkspaceContext } from '../Main';
import Import from './Import';
import Users from './Users';

const Wrapper = styled.div`
  max-width: 60%;
  margin: 50px auto;
`;

const Settings = () => {
  const workspace = useContext(WorkspaceContext);

  const { value: workspaceData } = useDocumentData(
    firestore.doc(`workspaces/${workspace}`),
  );

  if (!workspaceData) {
    return null;
  }

  return (
    <Wrapper>
      <Typography variant="h4">{workspaceData.name}</Typography>
      <MarginH />
      <Users />
      <MarginH />
      <Import />
      <MarginH />
    </Wrapper>
  );
};

export default Settings;
