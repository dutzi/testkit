import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { auth } from '../firebase';

const Wrapper = styled.div`
  padding: 24px;
`;

const Profile = () => {
  function handleLogout() {
    auth.signOut();
  }

  return (
    <Wrapper>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Log out
      </Button>
    </Wrapper>
  );
};

export default Profile;
