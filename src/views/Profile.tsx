import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { auth, firestore } from '../firebase';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MarginH, Toolbar } from '../styles';
import ProfilePicture from '../components/ProfilePicture';
import { GlobalUserContext } from './ContextProviders';
import media from '../media-queries';
import { useWorkspaceUsers } from '../hooks/workspace-users';
import { useCurrentUser } from '../hooks/current-user';
import { WorkspaceUser } from '../types';
import MenuButton from '../components/MenuButton';

const Wrapper = styled.div`
  max-width: 60%;
  margin: 50px auto;

  ${media.mobile`
    max-width: 85%;
    margin: 20px auto;
  `}
`;

const Padding = styled.div`
  padding: 24px;
`;

const Profile = ({ currentUser }: { currentUser: WorkspaceUser }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    currentUser.photoUrl,
  );
  const [, updateUser] = useWorkspaceUsers();

  function handleLogout() {
    auth.signOut();
  }

  function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const displayName = e.currentTarget.value;

    updateUser(currentUser.uid, {
      displayName,
    });
    setDisplayName(displayName);
  }

  function handleProfilePictureChange(url: string) {
    updateUser(currentUser.uid, {
      photoUrl: url,
    });

    setProfilePictureUrl(url);
  }

  return (
    <React.Fragment>
      <Toolbar>
        <MenuButton />
      </Toolbar>
      <Wrapper>
        <Paper>
          <Padding>
            <ProfilePicture
              src={profilePictureUrl}
              onChange={handleProfilePictureChange}
            />
            <TextField
              label="Display Name"
              value={displayName}
              onChange={handleDisplayNameChange}
            />
          </Padding>
        </Paper>
        <MarginH />
        <Button variant="outlined" color="default" onClick={handleLogout}>
          Log out
        </Button>
      </Wrapper>
    </React.Fragment>
  );
};

const CurrentUserGuard = props => {
  const currentUser = useCurrentUser();
  if (!currentUser) {
    return null;
  }

  return <Profile {...props} currentUser={currentUser} />;
};

export default CurrentUserGuard;
