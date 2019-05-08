import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SelectsWrapper = styled.div`
  display: flex;
`;

const Margin = styled.div`
  margin-right: 10px;
`;

const Row = styled.div`
  margin-bottom: 10px;
`;

function ScrollDialog({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  function handleClose() {
    setOpen(false);
    onClose();
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        aria-labelledby="scroll-dialog-title"
        maxWidth="sm"
      >
        <DialogTitle id="scroll-dialog-title">Test #1</DialogTitle>
        <DialogContent dividers={true}>
          <Row>
            <TextField
              id="standard-required"
              label="Name"
              margin="normal"
              fullWidth
            />
          </Row>
          <Row>
            <SelectsWrapper>
              <FormControl fullWidth>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={10}
                  // onChange={handleChange}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Margin />
              <FormControl fullWidth>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={10}
                  // onChange={handleChange}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple',
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </SelectsWrapper>
          </Row>
          {/* <DialogContentText>
            {Array.apply(null, Array(50))
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </DialogContentText> */}
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default ScrollDialog;
