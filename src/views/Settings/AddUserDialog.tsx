import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { User } from '../../model/users';

const Error = styled.div`
  color: #f44236;
`;

const Submit = styled.input`
  opacity: 0;
`;

const AddUserDialog = ({
  onSubmit,
  onClose,
  users,
}: {
  onSubmit: (email: string) => void;
  onClose: () => void;
  users: User[];
}) => {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);

  function handleSubmit() {
    onSubmit(email);
  }

  function handleChange(e: any) {
    setEmail(e.target.value);
    if (users.find(user => user.email === e.target.value)) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
      <form action="add-user" method="post" onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Add User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the user's email, once you hit Submit that person will get an
            invite link to their email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={handleChange}
            error={showError}
            onSubmit={handleSubmit}
          />
          {showError && <Error>Email already exists</Error>}
        </DialogContent>
        <DialogActions>
          <Submit tabIndex={-1} type="submit" onClick={handleSubmit} />
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={showError}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserDialog;
