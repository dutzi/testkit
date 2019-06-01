import React, { useContext } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { MarginH } from '../../styles';
import { WorkspaceContext } from '../ContextProviders';
import Import from './Import';
import Users from './Users';
import media from '../../media-queries';
import { Toolbar } from '../../styles';
import MenuButton from '../../components/MenuButton';
import Components from './Components';

const Wrapper = styled.div`
  max-width: 60%;
  margin: 50px auto;

  ${media.mobile`
    max-width: 85%;
    margin: 20px auto;
  `}
`;

const Settings = () => {
  const workspace = useContext(WorkspaceContext);

  return (
    <React.Fragment>
      <Toolbar>
        <MenuButton />
      </Toolbar>
      <Wrapper>
        <Typography variant="h4">{workspace!.name}</Typography>
        <MarginH />
        <Components />
        <MarginH />
        <Users />
        <MarginH />
        <Import />
        <MarginH />
      </Wrapper>
    </React.Fragment>
  );
};

export default Settings;
