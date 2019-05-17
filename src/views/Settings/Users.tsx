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
  const [editedUserId, setEditedUserId] = useState('');
  const [users, setUsers] = useState<User[]>([
    { uid: '1234', email: 'eldad@spot.im', role: 'admin' },
    { uid: '1232', email: 'eldad.b@spot.im', role: 'user' },
  ]);

  function handleAddUser() {
    alert(1);
  }

  const userRoles = [
    { name: 'admin', label: 'Admin' },
    { name: 'user', label: 'User' },
  ];

  function getUserById(uid: string) {
    return users.find(user => user.uid === uid);
  }

  function handleUserEdit(user: User) {
    setEditedUserId(user.uid);
  }

  function handleSaveUser(user: User) {
    console.log('save');
    setEditedUserId('');
  }

  function handleCloseUserEditor(user: User) {
    setEditedUserId('');
  }

  function handleUserRoleChange(e: any) {
    const user = getUserById(editedUserId);
    debugger;
    if (user) {
      user.role = e.target.value;
    }
  }

  function renderUser(user: User) {
    if (user.uid === editedUserId) {
      return (
        <React.Fragment key={user.uid}>
          <Email>{user.email}</Email>
          <Select
            value={user.role}
            onChange={handleUserRoleChange}
            // inputProps={{
            //   name: 'component',
            //   id: 'component',
            // }}
          >
            {userRoles.map(role => (
              <MenuItem key={role.name} value={role.name}>
                {role.label}
              </MenuItem>
            ))}
          </Select>

          <Actions>
            <Button onClick={handleSaveUser.bind(null, user)} variant="text">
              <CheckIcon fontSize="small" />
            </Button>
            <Button
              onClick={handleCloseUserEditor.bind(null, user)}
              variant="text"
            >
              <CloseIcon fontSize="small" />
            </Button>
          </Actions>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment key={user.uid}>
          <Email>{user.email}</Email>
          <Role>{user.role}</Role>
          <Actions>
            <Button onClick={handleUserEdit.bind(null, user)} variant="text">
              <EditIcon fontSize="small" />
            </Button>
            <Button variant="text">
              <DeleteIcon fontSize="small" />
            </Button>
          </Actions>
        </React.Fragment>
      );
    }
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
          <TableHead alignCenter>Actions</TableHead>
          {users.map(user => renderUser(user))}
        </Users>
        <MarginH />
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </Padding>
    </Paper>
  );
};

export default Import;
