import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { MarginH } from '../styles';

const Padder = styled.div`
  padding: 24px;
`;

const PadStart = styled.div`
  padding-left: 60px;
`;

const Logo = () => {
  return (
    <Paper>
      <Padder>
        <Typography variant="h3">🧪 TestKit 0.1</Typography>
        <MarginH margin="6px" />
        <PadStart>
          <Typography variant="h6">Manage and run tests</Typography>
        </PadStart>
      </Padder>
    </Paper>
  );
};

export default Logo;
