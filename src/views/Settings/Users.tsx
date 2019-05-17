import React, { useState, useContext, useImperativeHandle } from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MarginH, MarginV } from '../../styles';
import { storage, auth, firestore } from '../../firebase';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import { WorkspaceContext } from '../Main';
import AddUserDialog from './AddUserDialog';
import { getDocById } from '../../data-utils';

const Padding = styled.div`
  padding: 30px;
`;

const Flex = styled.div`
  display: flex;
`;

const Users = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-gap: 10px;
  align-items: baseline;
`;

const TableHead = styled.div`
  font-weight: bold;

  ${(p: { alignCenter?: boolean }) =>
    p.alignCenter &&
    css`
      text-align: center;
    `}
`;

const Email = styled.div``;

const Role = styled.div``;

const Actions = styled.div``;

interface User {
  uid: string;
  email: string;
  role: string;
  isEditing?: boolean;
}

const Import = () => {
  const [showDialog, setShowDialog] = useState(false);
  const workspace = useContext(WorkspaceContext);

  const { value: usersCollection } = useCollection(
    firestore.collection(`workspaces/${workspace}/users`),
  );
  const { value: users } = useCollectionData<User>(
    firestore.collection(`workspaces/${workspace}/users`),
  );

  if (!usersCollection || !users) {
    return null;
  }

  function handleAddUser() {
    setShowDialog(true);
  }

  const userRoles = [
    { name: 'admin', label: 'Admin' },
    { name: 'user', label: 'User' },
  ];

  function getRoleByName(name: string) {
    return userRoles.find(role => role.name === name);
  }

  function getUserById(uid: string) {
    return users!.find(user => user.uid === uid);
  }

  function handleUserRoleChange(e: any) {
    // const user = getUserById(editedUserId);
    // if (user) {
    //   user.role = e.target.value;
    // }
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  function handleSubmitDialog(email: string) {
    handleCloseDialog();
    firestore.collection(`workspaces/${workspace}/users`).add({
      id: email,
      email,
      role: 'user',
    });
  }

  function handleDeleteUser(user: User) {
    if (users && usersCollection) {
      const doc = usersCollection.docs.find(doc => doc.data().uid === user.uid);
      if (doc) {
        firestore.doc(`workspaces/${workspace}/users/${doc.id}`).delete();
      }
    }
  }

  function renderUser(user: User) {
    console.log(user, auth.currentUser);
    return (
      <React.Fragment key={user.uid}>
        <Email>{user.email}</Email>
        {user.uid === auth.currentUser!.uid && (
          <Role>{getRoleByName(user.role)!.label}</Role>
        )}
        {user.uid !== auth.currentUser!.uid && (
          <Select value={user.role} onChange={handleUserRoleChange}>
            {userRoles.map(role => (
              <MenuItem key={role.name} value={role.name}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        )}
        <Actions>
          {user.uid !== auth.currentUser!.uid && (
            <Button onClick={handleDeleteUser.bind(null, user)} variant="text">
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </Actions>
      </React.Fragment>
    );
  }

  return (
    <Paper>
      <Padding>
        <Typography variant="h5">Users</Typography>
        <MarginH />
        <div>
          <p>Add users and set their roles.</p>
        </div>
        <MarginH />
        <Users>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead alignCenter />
          {users.map(user => renderUser(user))}
        </Users>
        <MarginH />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
        {showDialog && (
          <AddUserDialog
            onClose={handleCloseDialog}
            onSubmit={handleSubmitDialog}
          />
        )}
      </Padding>
    </Paper>
  );
};

export default Import;
