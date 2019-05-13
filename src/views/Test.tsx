import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useCollection } from 'react-firebase-hooks/firestore';
import StepsProp from '../components/StepsProp';
import { firestore } from '../firebase';
import { getDocById } from '../data-utils';
import { Component, Step } from '../types';
import { getComponents } from '../data/components';
import { WorkspaceContext } from './Main';

const SelectsWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
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

  const workspace = useContext(WorkspaceContext);
  const { value: collection } = useCollection(
    firestore.collection(`workspaces/${workspace}/tests`),
  );
  const [components, setComponents] = useState<Component[]>([]);

  let test: firebase.firestore.QueryDocumentSnapshot | undefined;

  useEffect(() => {
    getComponents(workspace).then(setComponents);
  }, []);

  if (collection) {
    test = getDocById(testId, collection.docs);
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
    const test = getDocById(testId, collection!.docs);
    if (test) {
      var testRef = firestore
        .collection(`workspaces/${workspace}/tests`)
        .doc(test.id);
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

  function handleStepsChange(steps: Step[]) {
    updateTest({
      steps,
    });
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
              autoFocus
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
                    <MenuItem key={component.name} value={component.name}>
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
                    <MenuItem key={area.name} value={area.name}>
                      {area.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </SelectsWrapper>
          </Row>
          <Row>
            <StepsProp steps={test.data().steps} onChange={handleStepsChange} />
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
