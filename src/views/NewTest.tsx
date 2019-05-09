import React, { useEffect, useState, useMemo } from 'react';
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
import { useCollection } from 'react-firebase-hooks/firestore';
import StepsProp from '../components/StepsProp';
import { firestore } from '../firebase';
import { getTestById, updateTest } from '../utils';
import { Test, Component } from '../types';
import { getComponents } from '../data/components';

const SelectsWrapper = styled.div`
  display: flex;
`;

const Margin = styled.div`
  margin-right: 10px;
`;

const Row = styled.div`
  margin-bottom: 10px;
`;

function ScrollDialog({
  onClose,
  testId,
}: {
  onClose: () => void;
  testId: string;
}) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const { value: collection } = useCollection(firestore.collection('tests'));
  const [components, setComponents] = useState<Component[]>([]);

  let test: firebase.firestore.QueryDocumentSnapshot | undefined;

  useEffect(() => {
    getComponents().then(setComponents);
  }, []);

  if (collection) {
    test = getTestById(testId, collection.docs);
  }

  if (!test) {
    return <div />;
  }

  function handleClose() {
    setOpen(false);
    onClose();
  }

  function getTitle() {
    if (testId === 'new') {
      return 'New Test';
    } else {
      return `Test #${testId}`;
    }
  }

  function updateTest(data: object) {
    const test = getTestById(testId, collection!.docs);
    if (test) {
      var testRef = firestore.collection('tests').doc(test.id);
      if (testRef) {
        testRef.update(data);
      }
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateTest({
      name: e.currentTarget.value,
    });
  }

  function handleComponentChange(e: any) {
    updateTest({
      component: e.target.value,
      area: getAreas(e.target.value)[0].name,
    });
  }

  function handleAreaChange(e: any) {
    updateTest({
      area: e.target.value,
    });
  }

  function getAreas(componentName?: string) {
    const component = components.find(
      component => component.name === (componentName || test!.data().component),
    );

    if (component) {
      return component.areas;
    } else {
      return [];
    }
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
        <DialogTitle id="scroll-dialog-title">{getTitle()}</DialogTitle>
        <DialogContent dividers={true}>
          <Row>
            <TextField
              id="standard-required"
              label="Name"
              margin="normal"
              value={test.data().name}
              onChange={handleNameChange}
              fullWidth
            />
          </Row>
          <Row>
            <SelectsWrapper>
              <FormControl fullWidth>
                <InputLabel htmlFor="component">Component</InputLabel>
                <Select
                  value={test.data().component}
                  onChange={handleComponentChange}
                  inputProps={{
                    name: 'component',
                    id: 'component',
                  }}
                >
                  {components.map(component => (
                    <MenuItem value={component.name}>
                      {component.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Margin />
              <FormControl fullWidth>
                <InputLabel htmlFor="area">Area</InputLabel>
                <Select
                  value={test.data().area}
                  onChange={handleAreaChange}
                  inputProps={{
                    name: 'area',
                    id: 'area',
                  }}
                >
                  {getAreas().map(area => (
                    <MenuItem value={area.name}>{area.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectsWrapper>
          </Row>
          <Row>
            <StepsProp />
          </Row>
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
