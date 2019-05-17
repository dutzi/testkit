import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Wrapper = styled.div``;

const AddUserDialog = ({
  onSubmit,
  onClose,
}: {
  onSubmit: (email: string) => void;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState('');
  function handleSubmit() {
    onSubmit(email);
  }

  function handleChange(e: any) {
    setEmail(e.target.value);
  }

  return (
    <Dialog open onClose={onClose} aria-labelledby="form-dialog-title">
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
