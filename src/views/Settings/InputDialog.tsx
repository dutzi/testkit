import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const Submit = styled.input`
  opacity: 0;
`;

const InputDialog = ({
  onSubmit,
  onClose,
  title,
  description,
  inputLabel,
  buttonLabel,
}: {
  onSubmit: (value: string) => void;
  onClose: () => void;
  title: string;
  description: string;
  inputLabel: string;
  buttonLabel: string;
}) => {
  const [value, setValue] = useState('');

  function handleSubmit() {
    onSubmit(value);
  }

  function handleChange(e: any) {
    setValue(e.target.value);
  }

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <form action="add-user" method="post" onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={inputLabel}
            type="text"
            fullWidth
            value={value}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </DialogContent>
        <DialogActions>
          <Submit tabIndex={-1} type="submit" onClick={handleSubmit} />
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {buttonLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InputDialog;
