import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { auth, firestore } from '../firebase';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MarginH } from '../styles';
import ProfilePicture from '../components/ProfilePicture';
import { GlobalUserContext } from './ContextProviders';
import media from '../media-queries';

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

const Profile = () => {
  const { user, initialising } = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const globalUser = useContext(GlobalUserContext);

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        setDisplayName(user.displayName);
      }
      if (user.photoURL) {
        setProfilePictureUrl(user.photoURL);
      }
    }
  }, [initialising]);

  function handleLogout() {
    auth.signOut();
  }

  function handleDisplayNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (user) {
      const displayName = e.currentTarget.value;
      user.updateProfile({
        displayName,
      });
      setDisplayName(displayName);
    }
  }

  function handleProfilePictureChange(url: string) {
    if (user) {
      user.updateProfile({
        photoURL: url,
      });
      firestore
        .doc(`workspaces/${globalUser.workspace}/users/${user.uid}`)
        .update({
          photoUrl: url,
        });

      setProfilePictureUrl(url);
    }
  }

  return (
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
  );
};

export default Profile;
