import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { MarginH } from '../../styles';
import { auth, firestore } from '../../firebase';
import DeleteIcon from '@material-ui/icons/Delete';
import NativeSelect from '@material-ui/core/NativeSelect';
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';
import AddUserDialog from './AddUserDialog';
import { useWorkspaceUsers } from '../../hooks/workspace-users';
import { useActions, useStore } from '../../store';
import { User, getUserId } from '../../model/users';

const Padding = styled.div`
  padding: 30px;
`;

const UsersWrapper = styled.div`
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

// export interface User {
//   uid: string;
//   id: string;
//   email: string;
//   role: 'admin' | 'user';
//   isEditing?: boolean;
// }

const userRoles = [
  { name: 'admin', label: 'Admin' },
  { name: 'user', label: 'User' },
];

const Users = () => {
  const updateUser = useActions(actions => actions.users.updateUser);
  const addUser = useActions(actions => actions.users.addUser);
  const deleteUser = useActions(actions => actions.users.deleteUser);
  const users = useStore(state => state.users.data);

  const [showDialog, setShowDialog] = useState(false);

  if (!users) {
    return null;
  }

  function handleAddUser() {
    setShowDialog(true);
  }

  function getRoleByName(name: string) {
    return userRoles.find(role => role.name === name);
  }

  function getUserById(uid: string) {
    return users!.find(user => getUserId(user) === uid);
  }

  function handleUserRoleChange(user: User, e: any) {
    updateUser({
      id: getUserId(user)!,
      user: {
        role: e.target.value,
      },
    });
  }

  function handleCloseDialog() {
    setShowDialog(false);
  }

  function handleSubmitDialog(email: string) {
    handleCloseDialog();
    addUser(email);
  }

  function handleDeleteUser(user: User) {
    deleteUser(getUserId(user)!);
  }

  function isCurrentUserAdmin() {
    let user = getUserById(auth.currentUser!.uid);
    return user && user.role === 'admin';
  }

  function isCurrentUser(user: User) {
    return getUserId(user) === auth.currentUser!.uid;
  }

  function renderRole(user: User) {
    if (isCurrentUserAdmin() && !isCurrentUser(user)) {
      return (
        <NativeSelect
          value={user.role}
          onChange={handleUserRoleChange.bind(null, user)}
        >
          {userRoles.map(role => (
            <option key={role.name} value={role.name}>
              {role.label}
            </option>
          ))}
        </NativeSelect>
      );
    } else {
      return <Role>{getRoleByName(user.role)!.label}</Role>;
    }
  }

  function renderUser(user: User) {
    return (
      <React.Fragment key={getUserId(user)}>
        <Email>{user.email}</Email>
        {renderRole(user)}
        <Actions>
          {isCurrentUserAdmin() && !isCurrentUser(user) && (
            <Button onClick={handleDeleteUser.bind(null, user)} variant="text">
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </Actions>
      </React.Fragment>
    );
  }

  if (!isCurrentUserAdmin()) {
    return null;
  }

  return (
    <Paper>
      <Padding>
        <Typography variant="h5">Users</Typography>
        <MarginH />
        <div>
          <p>Add users and set their roles.</p>
          <Typography variant="body2">
            Admins can add and remove users and set their role.
          </Typography>
        </div>
        <MarginH />
        <UsersWrapper>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead alignCenter />
          {users.map(user => renderUser(user))}
        </UsersWrapper>
        <MarginH />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
        {showDialog && (
          <AddUserDialog
            users={users}
            onClose={handleCloseDialog}
            onSubmit={handleSubmitDialog}
          />
        )}
      </Padding>
    </Paper>
  );
};

export default Users;
